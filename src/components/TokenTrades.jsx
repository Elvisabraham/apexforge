import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Make sure this path points to your client

// Helper to calculate "12s ago", "2m ago", etc.
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Helper to cleanly shorten wallet addresses
const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenTrades({ currentToken }) {
  const [liveTrades, setLiveTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    if (!currentToken) return;
    
    const tokenMint = currentToken.mint_address || currentToken.mintAddress || currentToken.address || currentToken.id;
    if (!tokenMint) return;

    // 1. Fetch initial trade history
    const fetchInitialTrades = async () => {
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*') // 🚀 THE MISSING PIECE! This tells Supabase to return the data.
          .eq('token_mint', tokenMint) 
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error("🔴 Supabase Fetch Error:", error);
          throw error;
        }
        
        console.log("📦 TRADES DATA FROM DB:", data);
        setLiveTrades(data || []);
      } catch (err) {
        console.error("Error fetching live trades:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialTrades();

    // 2. 🚀 SUPABASE REALTIME LISTENER 
    const uniqueChannelName = `live-trades-${tokenMint}-${Date.now()}`;
    const subscription = supabase
      .channel(uniqueChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `token_mint=eq.${tokenMint}`
        },
        (payload) => {
          console.log("🟢 NEW LIVE TRADE DETECTED:", payload.new);
          setLiveTrades((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    // Cleanup listener safely
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentToken]);

  if (isLoading) {
    return <div className="text-center text-xs text-[#00f2a1] font-mono py-10 animate-pulse uppercase tracking-widest">Syncing Blockchain...</div>;
  }

  if (liveTrades.length === 0) {
    return <div className="text-center text-xs text-zinc-500 font-mono py-10 uppercase tracking-widest">No trades yet. Be the first!</div>;
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pb-20">
      {liveTrades.map((tx) => {
        // Checking all possible fallbacks just in case
        const solAmt = tx.sol_amount || tx.sol || tx.solAmount || 0;
        const tokenAmt = tx.amount || tx.token_amount || tx.tokenAmount || 0;
        const wallet = tx.wallet || tx.wallet_address || 'Unknown';
        
        // 🚀 Grab the transaction signature from your database
        const txSignature = tx.signature || tx.tx_signature || tx.tx_hash || tx.id;
        
        // Ensure Buy/Sell badge logic is bulletproof
        const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;
        const typeStr = isBuy ? 'BUY' : 'SELL';

        return (
          <div 
            key={tx.id || Math.random()} 
            onClick={() => {
              if (txSignature) {
                window.open(`https://solscan.io/tx/${txSignature}`, '_blank');
              }
            }}
            className="bg-[#121318] p-3 rounded-xl border border-white/5 flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300 hover:border-[#00f2a1]/40 hover:bg-white/[0.02] cursor-pointer group relative"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${isBuy ? 'bg-[#00f2a1]/20 text-[#00f2a1]' : 'bg-[#F23645]/20 text-[#F23645]'}`}>
                {typeStr}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tabular-nums">
                  {parseFloat(solAmt).toFixed(3)} SOL
                </span>
                <span className="text-[10px] text-zinc-500 font-mono group-hover:text-[#00f2a1]/80 transition-colors flex items-center gap-1">
                  {shortenAddress(wallet)} • {timeAgo(tx.created_at)}
                  <svg className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white tabular-nums">
                {parseFloat(tokenAmt).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase mt-0.5">
                Tokens
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}