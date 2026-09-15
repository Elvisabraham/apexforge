import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  MessageSquare, 
  Repeat2, 
  Heart, 
  MoreHorizontal, 
  Image as ImageIcon, 
  BarChart2, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Activity
} from 'lucide-react';

const shortenAddress = (address) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

export default function TokenCallouts({ currentToken, token, tokenSymbol }) {
  const { publicKey } = useWallet();
  const [callouts, setCallouts] = useState([]);
  const [newCallout, setNewCallout] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeToken = currentToken || token;
  const tokenMint = activeToken?.mintAddress || activeToken?.mint || activeToken?.address || activeToken?.mint_address || activeToken?.symbol || tokenSymbol;
  const displaySymbol = activeToken?.symbol || 'TOKEN';
  
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
    const interval = setInterval(fetchCallouts, 15000); 
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
      fetchCallouts();
    } catch (err) {
      console.error("Error posting callout:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className="flex flex-col pb-16">
      
      {/* 📝 THE X (TWITTER) STYLE INPUT */}
      <div className="flex gap-3 p-4 border-b border-white/5 bg-[#121318]/50">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0 mt-1">
          {publicKey ? (
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${publicKey.toString()}`} alt="You" className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-zinc-600"><Activity className="w-5 h-5"/></div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2">
          <textarea
            value={newCallout}
            onChange={(e) => setNewCallout(e.target.value)}
            disabled={!publicKey || isSubmitting}
            placeholder={publicKey ? "Drop your alpha thesis..." : "Connect wallet to post..."}
            className="w-full bg-transparent text-white placeholder-zinc-500 text-[15px] resize-none h-14 focus:outline-none custom-scrollbar pt-2"
          />
          
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <div className="flex items-center gap-4 text-[#00f2a1]">
              <button type="button" className="hover:bg-[#00f2a1]/10 p-1.5 rounded-full transition-colors"><ImageIcon className="w-4 h-4" /></button>
              <button type="button" className="hover:bg-[#00f2a1]/10 p-1.5 rounded-full transition-colors"><BarChart2 className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                 Entry MC: <span className="text-white font-bold">{formatCurrency(liveMarketCap)}</span>
               </span>
               <button
                 type="submit"
                 disabled={!publicKey || !newCallout.trim() || isSubmitting}
                 className="bg-[#00f2a1] text-black hover:bg-[#00f2a1]/80 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all"
               >
                 {isSubmitting ? 'Posting' : 'Post'}
               </button>
            </div>
          </div>
        </form>
      </div>

      {/* 📋 THE BINANCE SQUARE STYLE FEED */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-xs text-[#00f2a1] font-mono animate-pulse uppercase tracking-widest">Loading Feed...</div>
        </div>
      ) : callouts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">No alpha posted yet. Lead the charge.</div>
        </div>
      ) : (
        <div className="flex flex-col">
          {callouts.map((call) => {
            const entryMc = parseFloat(call.entry_market_cap) || 1;
            const multiplier = liveMarketCap / entryMc;
            const pctChange = (multiplier - 1) * 100;
            
            let perfColor = 'text-zinc-400 bg-zinc-800/50';
            let perfIcon = null;
            let perfText = 'Entry';

            if (pctChange > 5) {
              perfColor = 'text-[#00f2a1] bg-[#00f2a1]/10';
              perfIcon = <TrendingUp className="w-3 h-3" />;
              perfText = `${multiplier.toFixed(1)}x`;
            } else if (pctChange < -5) {
              perfColor = 'text-[#F23645] bg-[#F23645]/10';
              perfIcon = <TrendingDown className="w-3 h-3" />;
              perfText = `-${Math.abs(pctChange).toFixed(0)}%`;
            }

            return (
              <div key={call.id} className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                
                {/* Left: Avatar */}
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${call.creator_wallet}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>

                {/* Right: Content */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[14px] font-bold text-white hover:underline truncate max-w-[120px]">
                        {shortenAddress(call.creator_wallet)}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00f2a1]" />
                      <span className="text-zinc-500 text-[13px]">· {timeAgo(call.created_at)}</span>
                    </div>
                    <button className="text-zinc-500 hover:text-[#00f2a1] p-1"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>

                  {/* Body Text */}
                  <p className="text-[14px] text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
                    {call.content}
                  </p>

                  {/* 📊 THE BINANCE DATA CENTER (Asset Embed) */}
                  <div className="mt-2 mb-1 border border-white/5 rounded-xl p-3 bg-black/40 flex items-center justify-between hover:border-[#00f2a1]/20 transition-all group/asset relative overflow-hidden">
                     
                     {/* Side-Status Indicator (Green if up, Red if down) */}
                     {pctChange > 5 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f2a1] shadow-[0_0_8px_#00f2a1]" />}
                     {pctChange < -5 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F23645]" />}
                     {pctChange >= -5 && pctChange <= 5 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-600" />}
                     
                     <div className="flex items-center gap-3 pl-2">
                        <div className="w-9 h-9 rounded-full bg-[#1c1d24] flex items-center justify-center border border-white/10 group-hover/asset:border-[#00f2a1]/30 transition-colors">
                           <span className="text-white text-sm font-black uppercase">${displaySymbol.charAt(0)}</span>
                        </div>
                        
                        <div className="flex flex-col gap-0.5">
                           <div className="flex items-center gap-2">
                               <span className="text-[13px] font-black text-white uppercase">${displaySymbol}</span>
                               <span className="text-[11px] font-mono text-zinc-400">
                                 ${activeToken?.price || '0.00773'}
                               </span>
                           </div>
                           <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                             Called at MC: <span className="text-zinc-300">{formatCurrency(entryMc)}</span>
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex flex-col items-end gap-1">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded font-black tracking-wider text-[11px] ${perfColor}`}>
                           {perfIcon} {perfText}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                          Live MC: <span className={pctChange > 5 ? 'text-[#00f2a1]' : 'text-white'}>{formatCurrency(liveMarketCap)}</span>
                        </span>
                     </div>
                  </div>

                  {/* Footer Actions (X Style) */}
                  <div className="flex items-center justify-between mt-1 pt-1 max-w-md pr-4">
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#00f2a1] transition-colors group-hover:text-zinc-400">
                      <div className="p-1.5 rounded-full hover:bg-[#00f2a1]/10"><MessageSquare className="w-4 h-4" /></div>
                      <span className="text-xs">12</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#00f2a1] transition-colors group-hover:text-zinc-400">
                      <div className="p-1.5 rounded-full hover:bg-[#00f2a1]/10"><Repeat2 className="w-4 h-4" /></div>
                      <span className="text-xs">3</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#F23645] transition-colors group-hover:text-zinc-400">
                      <div className="p-1.5 rounded-full hover:bg-[#F23645]/10"><Heart className="w-4 h-4" /></div>
                      <span className="text-xs">{call.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#00f2a1] hover:brightness-125 transition-all">
                      <div className="flex items-center gap-1 bg-[#00f2a1]/10 px-3 py-1 rounded-full border border-[#00f2a1]/30">
                         <Zap className="w-3.5 h-3.5 fill-current" />
                         <span className="text-[10px] font-black uppercase tracking-wider">Buy</span>
                      </div>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}