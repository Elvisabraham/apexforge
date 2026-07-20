import React, { useState, useEffect, useRef } from 'react';

export default function Watch({ onTokenClick, userProfile }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef(null);

  // 🚀 TIKTOK-STYLE VIDEO FEED DATA
  // We include video placeholders and hype descriptions
  const watchFeed = [
    { 
      id: 'APEX', name: 'Apex AI', symbol: 'APEX', icon: '🔥', mcap: '$10.4M', price: '0.0102', change: '+500%', 
      isPositive: true, 
      videoType: 'bg-gradient-to-br from-emerald-900 to-black', // Placeholder for actual video source
      hypeText: "The fastest executing AI router on Solana. Don't fade the tech! 🚀🧠",
      likes: '12.4K', shares: '1.2K', comments: '842',
      isGraduated: true
    },
    { 
      id: 'BCAT', name: 'Based Cat', symbol: 'BCAT', icon: '🐱', mcap: '$1.2M', price: '0.0012', change: '+142.5%', 
      isPositive: true, 
      videoType: 'bg-gradient-to-tr from-blue-900 to-black', 
      hypeText: "We just swept the floor! Cat meta is officially back. 🐾💎",
      likes: '4.8K', shares: '312', comments: '156',
      isGraduated: false
    },
    { 
      id: 'VTORO', name: 'The Matador', symbol: 'VTORO', icon: '🐂', mcap: '$850K', price: '0.00085', change: '-5.3%', 
      isPositive: false, 
      videoType: 'bg-gradient-to-bl from-rose-900 to-black', 
      hypeText: "Dips are just discounts. We are charging the red candles today! 🐂🩸",
      likes: '1.1K', shares: '89', comments: '45',
      isGraduated: false
    },
    { 
      id: 'NEURO', name: 'Neuro AI', symbol: 'NEURO', icon: '🧠', mcap: '$4.5M', price: '0.0045', change: '+89.2%', 
      isPositive: true, 
      videoType: 'bg-gradient-to-b from-purple-900 to-black', 
      hypeText: "Neural net integration complete. We are breaking the matrix. 🌌🤖",
      likes: '8.9K', shares: '920', comments: '411',
      isGraduated: true
    }
  ];

  // Handle Scroll Snapping to track which video is active
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPosition = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const currentIndex = Math.round(scrollPosition / windowHeight);
    if (currentIndex !== activeVideoIndex) {
      setActiveVideoIndex(currentIndex);
    }
  };

  const handleQuickTrade = (token) => {
    // Standardize token object to pass back to App.js -> TokenHome
    onTokenClick({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      icon: token.icon,
      mcap: token.mcap,
      price: token.price,
      change: token.change,
      isGraduated: token.isGraduated,
      progress: token.isGraduated ? 100 : 45 // mock progress
    });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black text-white font-sans overflow-hidden">
      
      <style>{`
        /* Crucial classes for scroll snapping */
        .snap-container { scroll-snap-type: y mandatory; overflow-y: scroll; height: 100vh; }
        .snap-item { scroll-snap-align: start; height: 100vh; position: relative; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- FLOATING HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#089981]" fill="currentColor">
              <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
              <path d="M 50 45 C 35 70, 35 85, 50 45 Z" fill="#089981" />
           </svg>
           <h1 className="text-xl font-black tracking-widest text-white uppercase drop-shadow-md">Watch</h1>
        </div>
        <div className="flex items-center gap-4 drop-shadow-md pointer-events-auto">
          <span className="text-sm font-black text-white hover:text-zinc-300 cursor-pointer">Following</span>
          <span className="text-sm font-black text-white underline underline-offset-8 decoration-2 decoration-[#089981] cursor-pointer">For You</span>
        </div>
      </header>

      {/* --- SCROLL-SNAPPING FEED --- */}
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className="snap-container no-scrollbar w-full relative pb-20"
      >
        {watchFeed.map((token, index) => {
          const isActive = index === activeVideoIndex;
          const trendColor = token.isPositive ? 'text-[#089981]' : 'text-[#F23645]';

          return (
            <div key={token.id} className="snap-item w-full bg-black">
              
              {/* 🎬 BACKGROUND MEDIA (Video/Gradient Placeholder) */}
              <div className={`absolute inset-0 w-full h-full ${token.videoType} opacity-80`}>
                {/* Simulated playback indicator / gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              </div>

              {/* 🖱️ FLOATING ACTION SIDEBAR (Right) */}
              <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-40">
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{token.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2h12v2H6zm0-3v-2h12v2H6zm0-3V6h12v2H6z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{token.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{token.shares}</span>
                </div>
              </div>

              {/* 📊 BOTTOM METRICS & INFO PANEL */}
              <div className="absolute left-0 bottom-24 w-[80%] p-4 flex flex-col z-40">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-lg">
                      {token.icon}
                   </div>
                   <div className="flex flex-col">
                     <div className="flex items-center gap-2">
                       <h2 className="text-xl font-black text-white drop-shadow-md">{token.name}</h2>
                       {token.isGraduated && <span className="bg-amber-400 text-black text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Graduated</span>}
                     </div>
                     <span className="text-xs font-mono font-bold text-zinc-300 drop-shadow-md">@{token.symbol}</span>
                   </div>
                </div>

                <p className="text-sm font-medium text-white mb-4 drop-shadow-md pr-4 leading-relaxed">
                  {token.hypeText}
                </p>

                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 w-max shadow-lg mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Price</span>
                    <span className="text-lg font-black font-mono text-white">${token.price}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Market Cap</span>
                    <span className="text-lg font-black font-mono text-white">{token.mcap}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col justify-center">
                    <span className={`text-sm font-black tracking-wide ${trendColor}`}>{token.isPositive ? '▲' : '▼'} {token.change}</span>
                  </div>
                </div>

                {/* 🚀 MASSIVE QUICK BUY BUTTON */}
                <button 
                  onClick={() => handleQuickTrade(token)}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-lg uppercase tracking-widest transition-transform active:scale-95 shadow-xl ${token.isGraduated ? 'bg-amber-500 text-black hover:bg-amber-600' : 'bg-[#089981] text-white hover:bg-[#06806b]'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {token.isGraduated ? 'Trade on DEX' : 'Quick Buy'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}