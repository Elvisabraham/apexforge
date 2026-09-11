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
          .eq('token_mint', tokenMint) // 🚀 Updated to match your DB exactly
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
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
          filter: `token_mint=eq.${tokenMint}` // 🚀 Updated to match your DB exactly
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
    <div className="space-y-2 text-left pb-24">
      <div className="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2">
        <span>Transaction</span>
        <span>Amount</span>
      </div>
      
      {liveTrades.map((tx) => {
        // Defensive data parsing to handle slight variations in your DB column names
        const typeStr = tx.type ? tx.type.toUpperCase() : (tx.is_buy ? 'BUY' : 'SELL');
        const isBuy = typeStr === 'BUY';
        
        const solAmt = tx.sol_amount || tx.solAmount || 0;
        const tokenAmt = tx.token_amount || tx.tokenAmount || 0;
        const wallet = tx.wallet_address || tx.user_address || tx.maker || 'Unknown';

        return (
          <div key={tx.id || Math.random()} className="bg-[#121318] p-3 rounded-xl border border-white/5 flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${isBuy ? 'bg-[#00f2a1]/20 text-[#00f2a1]' : 'bg-[#F23645]/20 text-[#F23645]'}`}>
                {typeStr}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tabular-nums">
                  {parseFloat(solAmt).toFixed(3)} SOL
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {shortenAddress(wallet)} • {timeAgo(tx.created_at)}
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