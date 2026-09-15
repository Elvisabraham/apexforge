import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Landmark, Code2, Crosshair } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

const TOTAL_SUPPLY = 1_000_000_000;
const FALLBACK_SOL_PRICE = 145.00;

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// 🛠️ FIXED: Added Millions (M) and Billions (B) formatting
const formatCurrency = (value) => {
  if (value === 0) return '$0.00';
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (absValue >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (absValue >= 1_000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(2)}`;
};

export default function TokenHolders({ currentToken, token, userTokenBalance }) {
  const { publicKey } = useWallet();
  const [holders, setHolders] = useState([]);
  const [metrics, setMetrics] = useState({ top10: 0, dev: 0, snipers: 0, pool: 0, regular: 0, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;
  
  const passedDevAddress = activeToken?.devAddress || activeToken?.creator || activeToken?.dev_address || activeToken?.user_address || activeToken?.wallet || activeToken?.owner || activeToken?.creator_address;
  
  const tokenPriceUsd = activeToken?.price || 0.00773;

  useEffect(() => {
    if (!tokenMint) return;
console.log("Current Token Data:", activeToken);
console.log("Connected Wallet:", publicKey?.toString());
    let isMounted = true;

    const fetchHolders = async () => {
      try {
        if (isFirstLoad.current) setIsLoading(true);

        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && isMounted) {
          const holdingsMap = {};
          const sniperWallets = new Set();
          
          // 🛡️ THE BULLETPROOF DEV FINDER:
          // If the token object didn't give us the dev address, we find the very first wallet 
          // that interacted with the token. On launchpads, the Dev is always transaction #1.
          const firstTrade = data.find(tx => tx.wallet || tx.wallet_address || tx.user_address);
          const actualDevAddress = passedDevAddress || (firstTrade ? (firstTrade.wallet || firstTrade.wallet_address || firstTrade.user_address) : null);

          data.forEach((tx) => {
            const wallet = tx.wallet || tx.wallet_address || tx.user_address;
            const tokenAmt = parseFloat(tx.token_amount || tx.amount || tx.tokens || 0);
            const solAmt = parseFloat(tx.sol_amount || tx.sol || 0);
            const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;

            if (!wallet || tokenAmt === 0) return;

            if (!holdingsMap[wallet]) {
              holdingsMap[wallet] = { wallet, balance: 0, usdInvested: 0 };
            }

            // Snipers are the first 5 unique buyers who are NOT the Dev
            if (isBuy && sniperWallets.size < 5 && wallet !== actualDevAddress) {
              sniperWallets.add(wallet);
            }

            if (isBuy) {
              holdingsMap[wallet].balance += tokenAmt;
              holdingsMap[wallet].usdInvested += (solAmt * FALLBACK_SOL_PRICE);
            } else {
              holdingsMap[wallet].balance -= tokenAmt;
              holdingsMap[wallet].usdInvested -= (solAmt * FALLBACK_SOL_PRICE);
            }
          });

          if (publicKey && userTokenBalance && holdingsMap[publicKey.toString()]) {
            const parsedBalance = parseFloat(userTokenBalance);
            if (!isNaN(parsedBalance) && parsedBalance > 1000) {
                holdingsMap[publicKey.toString()].balance = parsedBalance;
            }
          }

          const userHolders = Object.values(holdingsMap)
            .filter((h) => h.balance > 0.000001)
            .sort((a, b) => b.balance - a.balance);

          const circulatingTokens = userHolders.reduce((acc, h) => acc + h.balance, 0);
          const effectiveTotalSupply = Math.max(TOTAL_SUPPLY, circulatingTokens);
          const curveTokens = Math.max(0, effectiveTotalSupply - circulatingTokens);

          const fullList = [
            {
              id: 'bonding-curve',
              address: 'Bonding Curve Vault',
              balance: curveTokens,
              usdInvested: 0, 
              percentage: (curveTokens / effectiveTotalSupply) * 100,
              isCurve: true,
            },
            ...userHolders.map((h) => ({
              id: h.wallet,
              address: h.wallet,
              balance: h.balance,
              usdInvested: h.usdInvested,
              percentage: (h.balance / effectiveTotalSupply) * 100,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.wallet}`,
              isDev: actualDevAddress && h.wallet === actualDevAddress,
              isSniper: sniperWallets.has(h.wallet),
              isMe: publicKey && h.wallet === publicKey.toString(),
            }))
          ].sort((a, b) => b.balance - a.balance);

          const top10Sum = fullList.filter(h => !h.isCurve).slice(0, 10).reduce((acc, h) => acc + h.percentage, 0);
          const devSum = fullList.filter(h => h.isDev).reduce((acc, h) => acc + h.percentage, 0);
          const sniperSum = fullList.filter(h => h.isSniper).reduce((acc, h) => acc + h.percentage, 0);
          const poolSum = (curveTokens / effectiveTotalSupply) * 100;
          const regularSum = Math.max(0, 100 - (devSum + sniperSum + poolSum));

          setMetrics({
            top10: Math.min(100, top10Sum),
            dev: devSum,
            snipers: sniperSum,
            pool: poolSum,
            regular: regularSum,
            totalCount: userHolders.length + 1
          });

          setHolders(fullList.slice(0, 25));
        }
      } catch (err) {
        console.error("Error calculating holders:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      }
    };

    fetchHolders();
    const interval = setInterval(fetchHolders, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [tokenMint, passedDevAddress, publicKey, userTokenBalance, tokenPriceUsd]);

  if (isLoading && holders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
          Scanning Token Supply...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* SUPPLY DISTRIBUTION BAR */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-3 flex flex-col gap-3 shadow-sm">
        <div className="flex justify-between items-center">
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Supply Distribution</span>
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Holders: <span className="text-white">{metrics.totalCount}</span></span>
        </div>
        
        <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-white/5">
          <div style={{ width: `${metrics.pool}%` }} className="bg-[#00f2a1] transition-all" title="Pool" />
          <div style={{ width: `${metrics.dev}%` }} className="bg-amber-400 transition-all" title="Dev" />
          <div style={{ width: `${metrics.snipers}%` }} className="bg-purple-500 transition-all" title="Snipers" />
          <div style={{ width: `${metrics.regular}%` }} className="bg-blue-500 transition-all" title="Regular" />
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Top 10</span>
            <span className="text-xs font-black text-amber-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {metrics.top10.toFixed(2)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Snipers</span>
            <span className="text-xs font-black text-purple-400 flex items-center gap-1"><Crosshair className="w-3 h-3" /> {metrics.snipers.toFixed(2)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Dev</span>
            <span className="text-xs font-black text-amber-400 flex items-center gap-1"><Code2 className="w-3 h-3" /> {metrics.dev.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* HOLDERS LIST HEADER */}
      <div className="flex items-center px-3 py-1 text-[9px] font-black tracking-widest text-zinc-500 uppercase">
        <div className="w-[40%]">Holder</div>
        <div className="w-[25%] text-right">Position</div>
        <div className="w-[20%] text-right">Profit</div>
        <div className="w-[15%] text-right">%</div>
      </div>

      {/* HOLDERS LIST */}
      <div className="flex flex-col gap-2">
        {holders.map((holder, index) => {
          let rankColor = 'text-zinc-600';
          if (index === 0) rankColor = 'text-amber-400 font-black';
          else if (index === 1) rankColor = 'text-zinc-300 font-black';
          else if (index === 2) rankColor = 'text-amber-700 font-black';

          const rowBg = holder.isCurve 
            ? "bg-[#00f2a1]/[0.02] border-[#00f2a1]/20 hover:bg-[#00f2a1]/[0.05]" 
            : "bg-[#121318] border-white/5 hover:bg-[#181920] hover:border-[#00f2a1]/30";

          // Calculate Gamified Metrics
          const positionUsd = holder.balance * tokenPriceUsd;
          const profitUsd = positionUsd - holder.usdInvested;

          // Formatting Profit text color
          let profitColor = 'text-zinc-500';
          let profitText = '---';
          if (!holder.isCurve) {
            if (profitUsd > 1) {
                profitColor = 'text-[#00f2a1] drop-shadow-[0_0_8px_rgba(0,242,161,0.3)]';
                profitText = `+${formatCurrency(profitUsd)}`;
            } else if (profitUsd < -1) {
                profitColor = 'text-[#F23645]';
                profitText = `-${formatCurrency(Math.abs(profitUsd))}`;
            } else {
                profitText = '$0.00';
            }
          }

          return (
            <div 
              key={holder.id} 
              onClick={() => {
                if (!holder.isCurve) window.open(`https://solscan.io/account/${holder.address}`, '_blank');
              }}
              className={`${rowBg} rounded-xl p-2.5 flex items-center justify-between shadow-sm border transition-all duration-200 ${!holder.isCurve && 'cursor-pointer'} group relative overflow-hidden`}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#00f2a1]/[0.03] transition-all duration-500 pointer-events-none" 
                style={{ width: `${Math.min(100, holder.percentage)}%` }} 
              />

              {/* 1. HOLDER INFO (40% width) */}
              <div className="flex items-center gap-2 relative z-10 w-[40%]">
                <span className={`text-[10px] w-3 text-center ${rankColor}`}>{index + 1}</span>
                <div className={`w-6 h-6 rounded-full border overflow-hidden shrink-0 flex items-center justify-center ${holder.isCurve ? 'bg-[#00f2a1]/10 border-[#00f2a1]/30' : 'bg-[#1c1d24] border-white/10'}`}>
                  {holder.isCurve ? <Landmark className="w-3 h-3 text-[#00f2a1]" /> : <img src={holder.avatar} alt="Holder Avatar" className="w-full h-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className={`text-xs font-bold truncate max-w-[80px] ${holder.isCurve || holder.isMe ? 'text-[#00f2a1]' : 'text-white'}`}>
                      {holder.isCurve ? 'Curve' : holder.isMe ? 'You' : shortenAddress(holder.address)}
                    </span>
                    {holder.isDev && <span className="text-[8px] bg-amber-400/10 text-amber-400 px-1 py-0.5 rounded font-black uppercase border border-amber-400/20">Dev</span>}
                    {holder.isSniper && !holder.isDev && <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1 py-0.5 rounded font-black uppercase border border-purple-500/20">Sniper</span>}
                  </div>
                </div>
              </div>

              {/* 2. POSITION (25% width) */}
              <div className="flex flex-col items-end relative z-10 w-[25%]">
                <span className={`text-xs font-bold ${holder.isCurve ? 'text-zinc-500' : 'text-white'}`}>
                    {holder.isCurve ? '---' : formatCurrency(positionUsd)}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono mt-0.5 tabular-nums">
                  {Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(holder.balance)} tok
                </span>
              </div>

              {/* 3. PROFIT (20% width) */}
              <div className="flex flex-col items-end relative z-10 w-[20%]">
                <span className={`text-xs font-bold tabular-nums ${profitColor}`}>
                    {profitText}
                </span>
              </div>

              {/* 4. PERCENTAGE (15% width) */}
              <div className="flex flex-col items-end relative z-10 w-[15%]">
                <span className="text-xs font-black text-white tabular-nums">{holder.percentage.toFixed(2)}%</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}