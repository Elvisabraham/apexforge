import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Helper to calculate relative time
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.max(0, Math.floor((now - past) / 1000));
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Cleanly shorten wallet addresses
const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function TokenTrades({ currentToken, token }) {
  const [liveTrades, setLiveTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTick] = useState(0); // Triggers periodic re-render for relative timestamps

  // Unified mint resolution matching TokenChat
  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;

  // Re-render every 10s to keep relative timestamps accurate
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!tokenMint) return;

    let isMounted = true;

    // 1. Fetch initial trade history
    const fetchInitialTrades = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        if (isMounted) setLiveTrades(data || []);
      } catch (err) {
        console.error("Error fetching live trades:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialTrades();

    // 2. Realtime listener with duplicate defense
    const uniqueChannelName = `trades-feed-${tokenMint}-${Date.now()}`;
    const channel = supabase
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
          if (!payload.new) return;
          setLiveTrades((prev) => {
            // Avoid duplicates if the client initiated the trade locally
            if (prev.some((tx) => tx.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tokenMint]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
          Syncing Blockchain Trades...
        </div>
      </div>
    );
  }

  if (liveTrades.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
          No trades yet. Be the first!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar p-2 pb-16">
      {liveTrades.map((tx) => {
        const solAmt = tx.sol_amount || tx.sol || tx.solAmount || 0;
        const tokenAmt = tx.amount || tx.token_amount || tx.tokenAmount || 0;
        const wallet = tx.wallet || tx.wallet_address || tx.user_address || 'Unknown';
        const txSignature = tx.signature || tx.tx_signature || tx.tx_hash;
        
        const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;
        const typeStr = isBuy ? 'BUY' : 'SELL';

        return (
          <div 
            key={tx.id || `${tx.created_at}-${wallet}`} 
            onClick={() => {
              if (txSignature) {
                window.open(`https://solscan.io/tx/${txSignature}`, '_blank');
              }
            }}
            className="bg-[#121318] hover:bg-[#181920] p-3 rounded-xl border border-white/5 hover:border-[#00f2a1]/30 flex items-center justify-between transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                isBuy ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/20' : 'bg-[#F23645]/15 text-[#F23645] border border-[#F23645]/20'
              }`}>
                {typeStr}
              </span>
              
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tabular-nums">
                  {parseFloat(solAmt).toFixed(3)} SOL
                </span>
                <span className="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-300 transition-colors flex items-center gap-1">
                  {shortenAddress(wallet)} • {timeAgo(tx.created_at)}
                  {txSignature && (
                    <svg className="w-2.5 h-2.5 text-zinc-600 group-hover:text-[#00f2a1] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white tabular-nums">
                {Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(tokenAmt)}
              </span>
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase mt-0.5">
                Tokens
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}