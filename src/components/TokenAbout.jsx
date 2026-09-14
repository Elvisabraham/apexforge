import React, { useState, useEffect } from 'react';
import { Globe, MessageSquare, Copy, Check } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Adjust path if your supabase client file is located elsewhere

const XIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const DexDollarIcon = ({ className = "w-3 h-3", strokeWidth = 3 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function TokenAbout({ currentToken, onOpenChat, onViewProfile }) {
  const [copied, setCopied] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  const mintAddress = currentToken?.mint_address || currentToken?.mintAddress || currentToken?.address || '';

  // Real message counter from Supabase
  useEffect(() => {
    if (!mintAddress) return;
    let isMounted = true;

    const fetchLiveChatCount = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('token_address', mintAddress);

        if (!error && count !== null && isMounted) {
          setChatCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch chat metrics:', err);
      }
    };

    fetchLiveChatCount();

    const channel = supabase
      .channel(`live-chat-count-${mintAddress}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `token_address=eq.${mintAddress}`,
        },
        () => {
          if (isMounted) setChatCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [mintAddress]);

  // Creator address
  const rawCreatorAddress = currentToken?.creator_address || currentToken?.creatorAddress || currentToken?.dev_address || '';
  const formattedCreatorAddress = rawCreatorAddress.length > 10 
    ? `${rawCreatorAddress.slice(0, 4)}...${rawCreatorAddress.slice(-4)}` 
    : (rawCreatorAddress || 'Anonymous Dev');

  // Navigate to Dev Profile
  const handleDevClick = () => {
    if (!rawCreatorAddress) return;
    if (typeof onViewProfile === 'function') {
      onViewProfile(rawCreatorAddress);
    } else {
      window.location.href = `/profile/${rawCreatorAddress}`;
    }
  };

  // Real Token Metrics
  const displayMcap = currentToken?.mcap ? currentToken.mcap.toString().replace('$', '') : '0.00';
  const displayLiq = currentToken?.liquidity ? currentToken.liquidity.toString().replace('$', '') : '0.00';
  const displayVol = currentToken?.vol24h ? currentToken.vol24h.toString().replace('$', '') : '0.00';
  const displaySupply = currentToken?.supply || '1B';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!rawCreatorAddress) return;
    navigator.clipboard.writeText(rawCreatorAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Check if any valid social link exists
  const hasSocials = Boolean(
    (currentToken?.website && currentToken.website !== '#') ||
    (currentToken?.twitter && currentToken.twitter !== '#') ||
    (currentToken?.telegram && currentToken.telegram !== '#')
  );

  return (
    <div className="space-y-4 text-left pb-24">
      
      {/* 1. METRICS GRID */}
      <div className="block lg:hidden">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Token Metrics</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#121318] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Market Cap</span>
            <span className="flex items-center text-xs font-black text-white tabular-nums tracking-tight">
              <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
              {displayMcap}
            </span>
          </div>
          <div className="bg-[#121318] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">24h Vol</span>
            <span className="flex items-center text-xs font-black text-white tabular-nums tracking-tight">
              <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
              {displayVol}
            </span>
          </div>
          <div className="bg-[#121318] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Liquidity</span>
            <span className="flex items-center text-xs font-black text-white tabular-nums tracking-tight">
              <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
              {displayLiq}
            </span>
          </div>
          <div className="bg-[#121318] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Supply</span>
            <span className="text-xs font-black text-white tabular-nums tracking-tight">{displaySupply}</span>
          </div>
        </div>
      </div>

      {/* 2. CHAT BANNER */}
      <div className="block lg:hidden">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Community</div>
        <button 
          onClick={onOpenChat}
          className="w-full bg-[#121318] hover:bg-[#171922] border border-white/5 hover:border-[#00f2a1]/40 rounded-xl p-3 flex items-center justify-between transition-all group active:scale-[0.99] shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00f2a1]/10 border border-[#00f2a1]/20 flex items-center justify-center text-[#00f2a1]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-[#00f2a1] transition-colors">
                Token Live Chat
              </span>
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1] animate-pulse"></span>
                {chatCount > 0 ? `${chatCount.toLocaleString()} Active` : 'Live'} • Join Trench Chat
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#00f2a1]/10 text-[#00f2a1] border border-[#00f2a1]/20 px-2.5 py-1 rounded-md">
            Open →
          </span>
        </button>
      </div>

      {/* 3. COIN CREATOR CARD */}
      <div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Coin Creator</div>
        <div className="flex items-center justify-between bg-[#121318] p-3 rounded-xl border border-white/5 shadow-sm">
          
          {/* CLICKABLE LEFT SIDE: Avatar + Name trigger the profile route */}
          <div 
            onClick={handleDevClick} 
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#1c1d24] group-hover:border-[#00f2a1]/40 rounded-full flex items-center justify-center text-lg border border-white/10 shrink-0 transition-colors">
              👾
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#00f2a1] transition-colors tabular-nums tracking-tight">
                  {formattedCreatorAddress}
                </span>
                
                {/* COPY BUTTON: Safely stops the click from triggering the profile redirect */}
                <button 
                  onClick={handleCopy}
                  type="button"
                  disabled={!rawCreatorAddress}
                  title="Click to copy full address"
                  className="p-1 hover:text-white text-zinc-500 transition-colors"
                >
                  {rawCreatorAddress && (copied ? <Check className="w-3 h-3 text-[#00f2a1]" /> : <Copy className="w-3 h-3" />)}
                </button>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 group-hover:text-zinc-400 transition-colors">Forged on Apex</span>
            </div>
          </div>
          
          {/* RESTORED FOLLOW BUTTON */}
          <button className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-2 active:scale-95">
            Follow Dev
          </button>
        </div>
      </div>

      {/* 4. DESCRIPTION */}
      <div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</div>
        <p className="text-xs text-zinc-300 leading-relaxed bg-[#121318] p-3.5 rounded-xl border border-white/5 shadow-sm break-words">
          {currentToken?.description || 'No description provided.'}
        </p>
      </div>

      {/* 5. SOCIAL LINKS (Completely hidden unless a valid URL is provided) */}
      {hasSocials && (
        <div className="flex flex-wrap gap-2 pt-1 lg:hidden">
          {currentToken?.website && currentToken.website !== '#' && (
            <a 
              href={currentToken.website.startsWith('http') ? currentToken.website : `https://${currentToken.website}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-[#00f2a1]"/> Website
            </a>
          )}

          {currentToken?.twitter && currentToken.twitter !== '#' && (
            <a 
              href={currentToken.twitter.startsWith('http') ? currentToken.twitter : `https://x.com/${currentToken.twitter.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <XIcon className="w-3.5 h-3.5 text-[#00f2a1]"/> Twitter
            </a>
          )}

          {currentToken?.telegram && currentToken.telegram !== '#' && (
            <a 
              href={currentToken.telegram.startsWith('http') ? currentToken.telegram : `https://t.me/${currentToken.telegram.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#00f2a1]"/> Telegram
            </a>
          )}
        </div>
      )}
    </div>
  );
}