import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

// Cleanly shorten wallet addresses
const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenTopTraders({ currentToken, token }) {
  const { publicKey } = useWallet();
  const [topTraders, setTopTraders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unified mint resolution matching your other components
  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;

  useEffect(() => {
    if (!tokenMint) return;

    let isMounted = true;

    const fetchTopTraders = async () => {
      try {
        setIsLoading(true);
        
        // Fetch up to 1000 recent trades to calculate the top traders leaderboard
        const { data, error } = await supabase
          .from('trades')
          .select('wallet, wallet_address, user_address, sol_amount, sol, type')
          .eq('token_mint', tokenMint)
          .limit(1000);

        if (error) throw error;

        if (data && isMounted) {
          const tradersMap = {};
          
          // Crunch the numbers: Aggregate total volume per wallet
          data.forEach(tx => {
            const wallet = tx.wallet || tx.wallet_address || tx.user_address;
            const solAmt = parseFloat(tx.sol_amount || tx.sol || 0);
            const isBuy = tx.type?.toLowerCase() === 'buy';
            
            if (!wallet) return;
            
            if (!tradersMap[wallet]) {
              tradersMap[wallet] = { 
                wallet, 
                totalVolume: 0, 
                buyVolume: 0, 
                sellVolume: 0,
                txCount: 0
              };
            }
            
            tradersMap[wallet].totalVolume += solAmt;
            tradersMap[wallet].txCount += 1;
            
            if (isBuy) {
              tradersMap[wallet].buyVolume += solAmt;
            } else {
              tradersMap[wallet].sellVolume += solAmt;
            }
          });

          // Sort the array by highest total SOL volume
          const sortedTraders = Object.values(tradersMap)
            .sort((a, b) => b.totalVolume - a.totalVolume)
            .slice(0, 20); // Show Top 20 Whales

          setTopTraders(sortedTraders);
        }
      } catch (err) {
        console.error("Error calculating top traders:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTopTraders();
    
    // Refresh the leaderboard automatically every 15 seconds
    const interval = setInterval(fetchTopTraders, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [tokenMint]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
          Scanning Whale Wallets...
        </div>
      </div>
    );
  }

  if (topTraders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
          No trading activity found yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar p-2 pb-16">
      {/* Header Row */}
      <div className="flex items-center justify-between px-3 py-2 text-[9px] font-black tracking-widest text-zinc-500 uppercase">
        <span>Trader Rank</span>
        <span>Total Volume (SOL)</span>
      </div>

      {topTraders.map((trader, index) => {
        // Check if the current row is the connected wallet
        const isMe = publicKey && trader.wallet === publicKey.toString();
        
        // Dynamically style the Top 3 ranks (Gold, Silver, Bronze)
        let rankColor = 'text-zinc-500';
        if (index === 0) rankColor = 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
        else if (index === 1) rankColor = 'text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,216,0.5)]';
        else if (index === 2) rankColor = 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]';

        return (
          <div 
            key={trader.wallet}
            onClick={() => window.open(`https://solscan.io/account/${trader.wallet}`, '_blank')}
            className="bg-[#121318] hover:bg-[#181920] p-3 rounded-xl border border-white/5 hover:border-[#00f2a1]/30 flex items-center justify-between transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-black w-4 text-center ${rankColor}`}>
                #{index + 1}
              </span>
              
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0 group-hover:border-[#00f2a1]/50 transition-colors">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trader.wallet}`} alt="Whale Avatar" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col">
                <span className={`text-sm font-bold flex items-center gap-1.5 ${isMe ? 'text-[#00f2a1]' : 'text-white'}`}>
                  {isMe ? 'You' : shortenAddress(trader.wallet)}
                  {isMe && <span className="bg-[#00f2a1]/20 text-[#00f2a1] border border-[#00f2a1]/30 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest">Connected</span>}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  <span className="text-[#00f2a1]">{trader.buyVolume.toFixed(2)}B</span> / <span className="text-[#F23645]">{trader.sellVolume.toFixed(2)}S</span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-white tabular-nums">
                {trader.totalVolume.toFixed(2)} SOL
              </span>
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase mt-0.5">
                {trader.txCount} Trades
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}