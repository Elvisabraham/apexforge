import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';
import { Flame, ShieldCheck, Send, TrendingUp, Clock, MessageSquare, Zap } from 'lucide-react';

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

export default function TokenCallouts({ currentToken, token }) {
  const { publicKey } = useWallet();
  const [callouts, setCallouts] = useState([]);
  const [newCallout, setNewCallout] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.symbol;
  
  // Fallback to $54,800 if activeToken doesn't have a live market cap yet
  const liveMarketCap = activeToken?.marketCap || activeToken?.usd_market_cap || 54800; 

  const fetchCallouts = async () => {
    if (!tokenMint) return;
    try {
      const { data, error } = await supabase
        .from('callouts')
        .select('*')
        .eq('token_mint', tokenMint)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCallouts(data || []);
    } catch (err) {
      console.error("Error fetching callouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallouts();
    const interval = setInterval(fetchCallouts, 15000); // Live refresh every 15s
    return () => clearInterval(interval);
  }, [tokenMint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCallout.trim() || !publicKey || !tokenMint) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('callouts').insert([{
        token_mint: tokenMint,
        creator_wallet: publicKey.toString(),
        content: newCallout.trim(),
        entry_market_cap: liveMarketCap,
      }]);

      if (error) throw error;
      setNewCallout('');
      fetchCallouts(); // Instantly refresh list
    } catch (err) {
      console.error("Error posting callout:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to calculate time ago
  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex flex-col gap-4 pb-16 pt-2">
      
      {/* 📝 POST ALPHA INPUT */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-3 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Transmit Alpha
            </span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider bg-black/30 px-2 py-0.5 rounded border border-white/5">
              Entry MC Snapshot: <span className="text-[#00f2a1] font-bold">{formatCurrency(liveMarketCap)}</span>
            </span>
          </div>
          
          <textarea
            value={newCallout}
            onChange={(e) => setNewCallout(e.target.value)}
            disabled={!publicKey || isSubmitting}
            placeholder={publicKey ? "What's the play? Give the thesis..." : "Connect wallet to post alpha..."}
            className="w-full bg-black/20 border border-white/5 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2a1]/50 resize-none h-20 transition-all custom-scrollbar"
          />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!publicKey || !newCallout.trim() || isSubmitting}
              className="bg-[#00f2a1]/10 text-[#00f2a1] hover:bg-[#00f2a1]/20 border border-[#00f2a1]/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Transmitting...' : 'Post Callout'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 📋 CALLOUTS FEED */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">
            Scanning Comms...
          </div>
        </div>
      ) : callouts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
            No alpha posted yet. Be the first.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {callouts.map((call) => {
            // Calculate Performance Math
            const entryMc = parseFloat(call.entry_market_cap) || 1;
            const multiplier = liveMarketCap / entryMc;
            const pctChange = (multiplier - 1) * 100;
            
            let perfColor = 'text-zinc-500 border-zinc-700 bg-zinc-800/50';
            let perfIcon = null;
            let perfText = '';

            if (pctChange > 5) {
              perfColor = 'text-[#00f2a1] border-[#00f2a1]/30 bg-[#00f2a1]/10 drop-shadow-[0_0_8px_rgba(0,242,161,0.2)]';
              perfIcon = <TrendingUp className="w-3 h-3" />;
              perfText = `${multiplier.toFixed(1)}x (+${pctChange.toFixed(0)}%)`;
            } else if (pctChange < -5) {
              perfColor = 'text-[#F23645] border-[#F23645]/30 bg-[#F23645]/10';
              perfText = `-${Math.abs(pctChange).toFixed(0)}%`;
            } else {
              perfText = 'Entry';
            }

            return (
              <div key={call.id} className="bg-[#121318] border border-white/5 rounded-xl p-3.5 flex flex-col gap-3 hover:border-white/10 transition-colors shadow-sm">
                
                {/* Header: User & Performance Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${call.creator_wallet}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white hover:text-[#00f2a1] cursor-pointer transition-colors">
                          {shortenAddress(call.creator_wallet)}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono">Entry: {formatCurrency(entryMc)}</span>
                    </div>
                  </div>

                  {/* Dynamic Multiplier Badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider ${perfColor}`}>
                    {perfIcon}
                    {perfText}
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-zinc-300 leading-relaxed break-words">
                  {call.content}
                </p>

                {/* Footer: Actions & Timestamp */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5" /> Reply
                    </button>
                    <span className="flex items-center gap-1 text-[9px] text-zinc-600 font-mono">
                      <Clock className="w-3 h-3" /> {timeAgo(call.created_at)}
                    </span>
                  </div>

                  <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Quick Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}