import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Landmark } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

const TOTAL_SUPPLY = 1_000_000_000; // Standard 1B Memecoin Supply

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenHolders({ currentToken, token, userTokenBalance }) {
  const { publicKey } = useWallet();
  const [holders, setHolders] = useState([]);
  const [totalHoldersCount, setTotalHoldersCount] = useState(0);
  const [top10Percent, setTop10Percent] = useState('0.00%');
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
        if (isFirstLoad.current) {
          setIsLoading(true);
        }

        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint);

        if (error) throw error;

        if (data && isMounted) {
          const holdingsMap = {};

          data.forEach((tx) => {
            const wallet = tx.wallet || tx.wallet_address || tx.user_address;
            const tokenAmt = parseFloat(tx.token_amount || tx.amount || tx.tokens || 0);
            const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;

            if (!wallet || tokenAmt === 0) return;

            if (!holdingsMap[wallet]) {
              holdingsMap[wallet] = { wallet, balance: 0 };
            }

            if (isBuy) {
              holdingsMap[wallet].balance += tokenAmt;
            } else {
              holdingsMap[wallet].balance -= tokenAmt;
            }
          });

          // If connected wallet has a verified on-chain balance, use it over estimated DB tally
          if (publicKey && userTokenBalance && holdingsMap[publicKey.toString()]) {
            const parsedBalance = parseFloat(userTokenBalance);
            // Only override if it's a valid number (ignores string formats like "627M")
            if (!isNaN(parsedBalance) && parsedBalance > 1000) {
                holdingsMap[publicKey.toString()].balance = parsedBalance;
            }
          }

          const userHolders = Object.values(holdingsMap)
            .filter((h) => h.balance > 0.000001)
            .sort((a, b) => b.balance - a.balance);

          // Calculate circulating tokens
          const circulatingTokens = userHolders.reduce((acc, h) => acc + h.balance, 0);

          // 🛡️ TESTNET FAILSAFE: If test trades exceed 1 Billion, dynamically adjust total supply so math doesn't break
          const effectiveTotalSupply = Math.max(TOTAL_SUPPLY, circulatingTokens);
          const curveTokens = Math.max(0, effectiveTotalSupply - circulatingTokens);

          // Build full list: Bonding Curve is the biggest holder initially
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
              isMe: publicKey && h.wallet === publicKey.toString(),
            }))
          ];

          // Top 10 percentage across the entire token supply (Capped at 100%)
          const top10Sum = Math.min(100, fullList.slice(0, 10).reduce((acc, h) => acc + h.percentage, 0));
          setTop10Percent(`${top10Sum.toFixed(2)}%`);
          setTotalHoldersCount(userHolders.length + 1); // Users + Curve Vault
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
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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
      {/* Summary Header */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-3 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Top 10 Supply</span>
          <span className="text-xs font-black text-amber-500 flex items-center gap-1.5 mt-0.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            {top10Percent}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Holders</span>
          <span className="text-xs font-black text-white mt-0.5 tabular-nums">{totalHoldersCount}</span>
        </div>
      </div>

      {/* Holders List */}
      <div className="flex flex-col gap-2">
        {holders.map((holder, index) => {
          let rankColor = 'text-zinc-600';
          if (index === 0) rankColor = 'text-amber-400 font-black';
          else if (index === 1) rankColor = 'text-zinc-300 font-black';
          else if (index === 2) rankColor = 'text-amber-700 font-black';

          return (
            <div 
              key={holder.id} 
              onClick={() => {
                if (!holder.isCurve) {
                  window.open(`https://solscan.io/account/${holder.address}`, '_blank');
                }
              }}
              className="bg-[#121318] hover:bg-[#181920] border border-white/5 hover:border-[#00f2a1]/30 rounded-xl p-3 flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer group relative overflow-hidden"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#00f2a1]/[0.03] transition-all duration-500 pointer-events-none" 
                style={{ width: `${Math.min(100, holder.percentage)}%` }} 
              />

              <div className="flex items-center gap-3 relative z-10">
                <span className={`text-[10px] w-3 text-center ${rankColor}`}>{index + 1}</span>
                
                <div className="w-8 h-8 rounded-full bg-[#1c1d24] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {holder.isCurve ? (
                    <Landmark className="w-4 h-4 text-[#00f2a1]" />
                  ) : (
                    <img src={holder.avatar} alt="Holder Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${holder.isCurve ? 'text-[#00f2a1]' : holder.isMe ? 'text-[#00f2a1]' : 'text-white'}`}>
                      {holder.isCurve ? 'Bonding Curve' : holder.isMe ? 'You' : shortenAddress(holder.address)}
                    </span>
                    {holder.isCurve && (
                      <span className="text-[8px] bg-[#00f2a1]/10 text-[#00f2a1] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-[#00f2a1]/20">
                        Pool
                      </span>
                    )}
                    {holder.isDev && (
                      <span className="text-[8px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-amber-400/20">
                        Dev
                      </span>
                    )}
                    {holder.isMe && (
                      <span className="text-[8px] bg-[#00f2a1]/20 text-[#00f2a1] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-[#00f2a1]/30">
                        Bag
                      </span>
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