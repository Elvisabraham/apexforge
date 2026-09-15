import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenHolders({ currentToken, token }) {
  const { publicKey } = useWallet();
  const [topHolders, setTopHolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSupplyHeld, setTotalSupplyHeld] = useState(0);

  // Unified mint resolution
  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;

  useEffect(() => {
    if (!tokenMint) return;

    let isMounted = true;

    const fetchHolders = async () => {
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint);

        if (error) throw error;

        if (data && isMounted) {
          const holdingsMap = {};
          
          // Crunch the numbers: Calculate net token balance per wallet (Buys - Sells)
          data.forEach(tx => {
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

          // Filter out wallets that sold everything, then sort by biggest bag
          const validHolders = Object.values(holdingsMap)
            .filter(h => h.balance > 0)
            .sort((a, b) => b.balance - a.balance);

          const total = validHolders.reduce((sum, h) => sum + h.balance, 0);
          
          // Silently update the numbers
          setTotalSupplyHeld(total);
          setTopHolders(validHolders.slice(0, 20));
        }
      } catch (err) {
        console.error("Error calculating holders:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // 1. Initial Load
    fetchHolders();
    
    // 2. Silent Background Loop (Every 20 seconds)
    const interval = setInterval(() => {
      fetchHolders();
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [tokenMint]);

  // 🛡️ THE IRONCLAD FAILSAFE: 
  // ONLY show the loading screen if it is strictly the initial load AND we have zero data yet.
  if (isLoading && topHolders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
          Scanning Token Supply...
        </div>
      </div>
    );
  }

  // If loading is done, but nobody has traded yet
  if (topHolders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
          No holders found yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar p-2 pb-16">
      {/* Header Row */}
      <div className="flex items-center justify-between px-3 py-2 text-[9px] font-black tracking-widest text-zinc-500 uppercase">
        <span>Rank & Wallet</span>
        <span>Balance & %</span>
      </div>

      {topHolders.map((holder, index) => {
        const isMe = publicKey && holder.wallet === publicKey.toString();
        // Calculate what % of the current distributed supply this wallet owns
        const percentage = totalSupplyHeld > 0 ? ((holder.balance / totalSupplyHeld) * 100).toFixed(2) : 0;
        
        let rankColor = 'text-zinc-500';
        if (index === 0) rankColor = 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
        else if (index === 1) rankColor = 'text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,216,0.5)]';
        else if (index === 2) rankColor = 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]';

        return (
          <div 
            key={holder.wallet}
            onClick={() => window.open(`https://solscan.io/account/${holder.wallet}`, '_blank')}
            className="bg-[#121318] hover:bg-[#181920] p-3 rounded-xl border border-white/5 hover:border-[#00f2a1]/30 flex items-center justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden"
          >
            {/* Subtle progress bar in the background representing their bag size */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#00f2a1]/[0.03] transition-all duration-500 pointer-events-none" 
              style={{ width: `${Math.min(100, percentage)}%` }} 
            />

            <div className="flex items-center gap-3 relative z-10">
              <span className={`text-xs font-mono font-black w-4 text-center ${rankColor}`}>
                #{index + 1}
              </span>
              
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0 group-hover:border-[#00f2a1]/50 transition-colors">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${holder.wallet}`} alt="Holder Avatar" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col">
                <span className={`text-sm font-bold flex items-center gap-1.5 ${isMe ? 'text-[#00f2a1]' : 'text-white'}`}>
                  {isMe ? 'You' : shortenAddress(holder.wallet)}
                  {isMe && <span className="bg-[#00f2a1]/20 text-[#00f2a1] border border-[#00f2a1]/30 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest">Bag</span>}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Holder
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end relative z-10">
              <span className="text-sm font-bold text-white tabular-nums">
                {Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(holder.balance)}
              </span>
              <span className="text-[10px] font-black tracking-widest text-[#00f2a1] mt-0.5 flex items-center gap-1">
                {percentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}