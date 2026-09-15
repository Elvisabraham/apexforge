import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

const DexDollarIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

// Helper for relative timestamps
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

export default function TokenMyTrades({ currentToken, token }) {
  const { publicKey, connected } = useWallet();
  const [myTrades, setMyTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setTick] = useState(0);

  // Unified mint resolution matching your other components
  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol;

  // Re-render every 10s to keep relative timestamps accurate
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // If no wallet is connected, wipe the list and stop
    if (!tokenMint || !connected || !publicKey) {
      setMyTrades([]);
      return;
    }

    let isMounted = true;
    const walletString = publicKey.toString();

    const fetchMyTrades = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('token_mint', tokenMint)
          // Look for trades matching the connected wallet (checks multiple potential column names)
          .or(`wallet.eq.${walletString},wallet_address.eq.${walletString},user_address.eq.${walletString}`)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        if (isMounted) setMyTrades(data || []);
      } catch (err) {
        console.error("Error fetching my trades:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMyTrades();

    // Real-time listener for MY new trades
    const uniqueChannelName = `my-trades-feed-${tokenMint}-${walletString.slice(0,6)}`;
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
          
          const txWallet = payload.new.wallet || payload.new.wallet_address || payload.new.user_address;
          
          // Only add to the feed if the incoming trade belongs to the connected wallet
          if (txWallet === walletString) {
            setMyTrades((prev) => {
              if (prev.some((tx) => tx.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tokenMint, publicKey, connected]);

  // STATE 1: Wallet Not Connected
  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center px-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
          <DexDollarIcon className="w-5 h-5 text-zinc-500" />
        </div>
        <span className="text-sm font-bold text-zinc-300 mb-1">Wallet Not Connected</span>
        <span className="text-xs text-zinc-500">Connect your wallet to view your personal trades and PNL for {activeToken?.symbol || 'this token'}.</span>
      </div>
    );
  }

  // STATE 2: Loading Data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
          Syncing Your Trades...
        </div>
      </div>
    );
  }

  // STATE 3: Connected, but no trades for this token yet
  if (myTrades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center px-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
          <DexDollarIcon className="w-5 h-5 text-zinc-500" />
        </div>
        <span className="text-sm font-bold text-zinc-300 mb-1">No Trade History</span>
        <span className="text-xs text-zinc-500">You haven't made any trades on {activeToken?.symbol || 'this token'} yet.</span>
      </div>
    );
  }

  // STATE 4: Show the User's Trades
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar p-2 pb-16">
      {myTrades.map((tx) => {
        const solAmt = tx.sol_amount || tx.sol || tx.solAmount || 0;
        const tokenAmt = tx.amount || tx.token_amount || tx.tokenAmount || 0;
        const txSignature = tx.signature || tx.tx_signature || tx.tx_hash;
        
        const isBuy = tx.type?.toLowerCase() === 'buy' || tx.isBuy;
        const typeStr = isBuy ? 'BUY' : 'SELL';

        return (
          <div 
            key={tx.id || `${tx.created_at}-${Math.random()}`} 
            onClick={() => {
              if (txSignature) window.open(`https://solscan.io/tx/${txSignature}`, '_blank');
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
                  You • {timeAgo(tx.created_at)}
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