import React, { useState } from 'react';
import { Globe, MessageSquare, Copy, Check } from 'lucide-react';

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

export default function TokenAbout({ currentToken, onOpenChat }) {
  const [copied, setCopied] = useState(false);

  const rawAddress = currentToken?.creatorAddress || currentToken?.mintAddress || '43pUqvLugVZYeQ2mc7buVQygKJBS6pKx75';
  
  // Clean 4-dot-4 Solana format: 43pU...q2HR
  const formattedAddress = rawAddress.length > 10 
    ? `${rawAddress.slice(0, 4)}...${rawAddress.slice(-4)}`
    : rawAddress;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rawAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4 text-left pb-4">
      
      {/* 1. COIN CREATOR CARD (Truncated & Copyable) */}
      <div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Coin Creator</div>
        <div className="flex items-center justify-between bg-[#121318] p-3 rounded-xl border border-white/5 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-[#1c1d24] rounded-full flex items-center justify-center text-lg border border-white/10 shrink-0">
              👾
            </div>
            <div className="flex flex-col min-w-0">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#00f2a1] transition-colors group"
                title="Click to copy full address"
              >
                <span className="font-mono">{formattedAddress}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-[#00f2a1]" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                )}
              </button>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">0 Forged</span>
            </div>
          </div>
          
          <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ml-2 active:scale-95">
            Follow
          </button>
        </div>
      </div>

      {/* 2. PROMINENT CHAT BANNER (Tapping opens the mobile Chat Drawer) */}
      <div>
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
                1,420 Online • Join Trench Chat
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#00f2a1]/10 text-[#00f2a1] border border-[#00f2a1]/20 px-2.5 py-1 rounded-md">
            Open →
          </span>
        </button>
      </div>

      {/* 3. DESCRIPTION */}
      <div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</div>
        <p className="text-xs text-zinc-300 leading-relaxed bg-[#121318] p-3.5 rounded-xl border border-white/5">
          {currentToken?.description || 'The launchpad for memecoins paired to ptokens. Built for the trenches.'}
        </p>
      </div>

      {/* 4. SOCIAL LINKS */}
      <div className="flex flex-wrap gap-2 pt-1">
        <a href={currentToken?.website || '#'} className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors">
          <Globe className="w-3.5 h-3.5"/> Website
        </a>
        <a href={currentToken?.twitter || '#'} className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors">
          <XIcon className="w-3.5 h-3.5"/> Twitter
        </a>
        <a href={currentToken?.telegram || '#'} className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 text-[11px] px-3 py-2 rounded-lg border border-white/5 font-mono flex items-center gap-1.5 transition-colors">
          <TelegramIcon className="w-3.5 h-3.5"/> Telegram
        </a>
      </div>
    </div>
  );
}