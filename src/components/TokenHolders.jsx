import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Landmark, Code2, Crosshair } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

const TOTAL_SUPPLY = 1_000_000_000;

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenHolders({ currentToken, token, userTokenBalance }) {
  const { publicKey } = useWallet();
  const [holders, setHolders] = useState([]);
  const [metrics, setMetrics] = useState({ top10: 0, dev: 0, snipers: 0, pool: 0, regular: 0, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;
  const devAddress = activeToken?.devAddress || activeToken?.creator || activeToken?.dev_address;

  useEffect(() => {
    if (!tokenMint) return;

    let isMounted = true;

    const fetchHolders = async () => {
      try {
        if (isFirstLoad.current) setIsLoading(true);

        // Fetch trades in chronological order so we can identify the first buyers (Snipers)
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint)
          .order('created_at', { ascending: true }); // Must order by time to catch snipers!

        if (error) throw error;

        if (data && isMounted) {
          const holdingsMap = {};
          const sniperWallets = new Set();

          // Crunch the numbers and identify snipers
          data.forEach((tx) => {
            const wallet = tx.wallet || tx.wallet_address || tx.user_address;
            const tokenAmt = parseFloat(tx.token_amount || tx.amount || tx.tokens || 0);
            const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;

            if (!wallet || tokenAmt === 0) return;

            if (!holdingsMap[wallet]) {
              holdingsMap[wallet] = { wallet, balance: 0, txCount: 0 };
            }

            // The first 5 unique wallets to ever execute a BUY (that aren't the dev) are flagged as Snipers
            if (isBuy && sniperWallets.size < 5 && wallet !== devAddress) {
              sniperWallets.add(wallet);
            }

            if (isBuy) holdingsMap[wallet].balance += tokenAmt;
            else holdingsMap[wallet].balance -= tokenAmt;
            
            holdingsMap[wallet].txCount += 1;
          });

          // Inject your real wallet balance if available
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

          // Build the exact holder list with roles
          const fullList = [
            {
              id: 'bonding-curve',
              address: 'Bonding Curve Vault',
              balance: curveTokens,
              percentage: (curveTokens / effectiveTotalSupply) * 100,
              isCurve: true,
            },
            ...userHolders.map((h) => ({
              id: h.wallet,
              address: h.wallet,
              balance: h.balance,
              percentage: (h.balance / effectiveTotalSupply) * 100,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.wallet}`,
              isDev: devAddress && h.wallet === devAddress,
              isSniper: sniperWallets.has(h.wallet),
              isMe: publicKey && h.wallet === publicKey.toString(),
            }))
          ].sort((a, b) => b.balance - a.balance);

          // Calculate Breakdown Metrics
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
  }, [tokenMint, devAddress, publicKey, userTokenBalance]);

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
      {/* 📊 ADVANCED SUPPLY BREAKDOWN */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-3 flex flex-col gap-3 shadow-sm">
        <div className="flex justify-between items-center">
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Supply Distribution</span>
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Holders: <span className="text-white">{metrics.totalCount}</span></span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-white/5">
          <div style={{ width: `${metrics.pool}%` }} className="bg-[#00f2a1] hover:brightness-125 transition-all" title={`Pool: ${metrics.pool.toFixed(1)}%`} />
          <div style={{ width: `${metrics.dev}%` }} className="bg-amber-400 hover:brightness-125 transition-all" title={`Dev: ${metrics.dev.toFixed(1)}%`} />
          <div style={{ width: `${metrics.snipers}%` }} className="bg-purple-500 hover:brightness-125 transition-all" title={`Snipers: ${metrics.snipers.toFixed(1)}%`} />
          <div style={{ width: `${metrics.regular}%` }} className="bg-blue-500 hover:brightness-125 transition-all" title={`Regular: ${metrics.regular.toFixed(1)}%`} />
        </div>

        {/* Legend */}
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

      {/* Holders List */}
      <div className="flex flex-col gap-2">
        {holders.map((holder, index) => {
          let rankColor = 'text-zinc-600';
          if (index === 0) rankColor = 'text-amber-400 font-black';
          else if (index === 1) rankColor = 'text-zinc-300 font-black';
          else if (index === 2) rankColor = 'text-amber-700 font-black';

          const rowBg = holder.isCurve 
            ? "bg-[#00f2a1]/[0.02] border-[#00f2a1]/20 hover:bg-[#00f2a1]/[0.05]" 
            : "bg-[#121318] border-white/5 hover:bg-[#181920] hover:border-[#00f2a1]/30";

          return (
            <div 
              key={holder.id} 
              onClick={() => {
                if (!holder.isCurve) window.open(`https://solscan.io/account/${holder.address}`, '_blank');
              }}
              className={`${rowBg} rounded-xl p-3 flex items-center justify-between shadow-sm border transition-all duration-200 ${!holder.isCurve && 'cursor-pointer'} group relative overflow-hidden`}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#00f2a1]/[0.03] transition-all duration-500 pointer-events-none" 
                style={{ width: `${Math.min(100, holder.percentage)}%` }} 
              />

              <div className="flex items-center gap-3 relative z-10">
                <span className={`text-[10px] w-3 text-center ${rankColor}`}>{index + 1}</span>
                
                <div className={`w-8 h-8 rounded-full border overflow-hidden shrink-0 flex items-center justify-center ${holder.isCurve ? 'bg-[#00f2a1]/10 border-[#00f2a1]/30' : 'bg-[#1c1d24] border-white/10'}`}>
                  {holder.isCurve ? (
                    <Landmark className="w-4 h-4 text-[#00f2a1]" />
                  ) : (
                    <img src={holder.avatar} alt="Holder Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-bold ${holder.isCurve || holder.isMe ? 'text-[#00f2a1]' : 'text-white'}`}>
                      {holder.isCurve ? 'Bonding Curve' : holder.isMe ? 'You' : shortenAddress(holder.address)}
                    </span>
                    {holder.isCurve && (
                      <span className="text-[8px] bg-[#00f2a1]/10 text-[#00f2a1] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-[#00f2a1]/20">Pool</span>
                    )}
                    {holder.isDev && (
                      <span className="text-[8px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-amber-400/20">Dev</span>
                    )}
                    {holder.isSniper && (
                      <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-purple-500/20">Sniper</span>
                    )}
                    {holder.isMe && (
                      <span className="text-[8px] bg-[#00f2a1]/20 text-[#00f2a1] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-[#00f2a1]/30">Bag</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end relative z-10">
                <span className="text-xs font-black text-white tabular-nums">{holder.percentage.toFixed(2)}%</span>
                <span className="text-[9px] text-zinc-500 font-mono mt-0.5 tabular-nums">
                  {Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(holder.balance)} tokens
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}