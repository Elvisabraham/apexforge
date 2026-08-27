import React, { useState } from 'react';

export default function WatchView({ onTradeOnDex }) {
  const [likes, setLikes] = useState(12400);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="relative w-full h-[calc(100vh-52px)] bg-black text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      
      {/* BACKGROUND VIDEO / MEDIA CONTAINER */}
      <div className="absolute inset-0 z-0 bg-zinc-950 flex items-center justify-center">
        {/* Replace with actual <video> tag when connecting media URL */}
        <div className="w-full h-full bg-gradient-to-b from-transparent via-black/40 to-black/90 pointer-events-none" />
      </div>

      {/* TOP HEADER SPACE */}
      <div className="relative z-10 flex justify-between items-center" />

      {/* RIGHT SIDE ACTION BAR (Likes, Comments, Shares) */}
      <div className="absolute right-6 bottom-28 z-20 flex flex-col items-center gap-6">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all ${
            isLiked ? 'text-red-500 scale-110' : 'text-white'
          }`}>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-zinc-300">{(likes / 1000).toFixed(1)}K</span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all">
            <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-zinc-300">4</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all">
            <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-zinc-300">1.2K</span>
        </button>
      </div>

      {/* BOTTOM TOKEN DETAILS & CALL TO ACTION */}
      <div className="relative z-10 max-w-xl space-y-4">
        {/* Token Badge & Handle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-lg font-bold">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Apex AI</h2>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-[10px] font-black tracking-wider uppercase">
                GRADUATED
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-400">@APEX</p>
          </div>
        </div>

        {/* Description Pitch */}
        <p className="text-sm font-semibold text-zinc-200">
          The fastest executing AI router on Solana. Don't fade the tech! 🚀🧠
        </p>

        {/* Metrics Card */}
        <div className="inline-flex items-center gap-6 p-3 bg-[#121318]/80 backdrop-blur-md border border-white/10 rounded-xl">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase">PRICE</div>
            <div className="text-sm font-black text-white">$0.0102</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase">MARKET CAP</div>
            <div className="text-sm font-black text-white">$10.4M</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-1 text-[#089981] font-black text-xs bg-[#089981]/10 px-2 py-1 rounded">
            ▲ +500%
          </div>
        </div>

        {/* Big Yellow CTA Button */}
        <button
          type="button"
          onClick={onTradeOnDex}
          className="w-full py-4 bg-[#FF9900] hover:bg-[#e68a00] text-black font-black text-base rounded-2xl transition-all shadow-xl shadow-[#FF9900]/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <span>⚡ TRADE ON DEX</span>
        </button>
      </div>

    </div>
  );
}