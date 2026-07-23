// 🚀 VERSION 8: ABSOLUTE BOTTOM PADDING LOCK FOR WATCH FEED
import React, { useState, useEffect, useRef } from 'react';

export default function Watch({ onTokenClick, userProfile }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentFeedTab, setCurrentFeedTab] = useState('FOR_YOU');
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  const containerRef = useRef(null);
  const videoRefs = useRef({}); 

  const initialWatchFeed = [
    { 
      id: 'APEX', name: 'Apex AI', symbol: 'APEX', icon: '🔥', mcap: '$10.4M', price: '0.0102', change: '+500%', 
      isPositive: true, 
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31910-large.mp4',
      hypeText: "The fastest executing AI router on Solana. Don't fade the tech! 🚀🧠",
      likes: 12400, shares: 1200, commentsCount: 4,
      isGraduated: true,
      comments: [
        { id: 1, user: "SolWhale_99", text: "This is easily hitting 50M mcap this week minimum! 🔥" },
        { id: 2, user: "AlphaHunter", text: "Dev is completely cooking in the terminal." },
        { id: 3, user: "ChadGains", text: "Just doubled my bag on that micro dip." },
        { id: 4, user: "MemeLord", text: "Apex router speed is actually insane." }
      ]
    },
    { 
      id: 'BCAT', name: 'Based Cat', symbol: 'BCAT', icon: '🐱', mcap: '$1.2M', price: '0.0012', change: '+142.5%', 
      isPositive: true, 
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hacker-typing-on-a-laptop-43093-large.mp4',
      hypeText: "We just swept the floor! Cat meta is officially back. 🐾💎",
      likes: 4800, shares: 312, commentsCount: 3,
      isGraduated: false,
      comments: [
        { id: 1, user: "DegenCat", text: "Meow meta is sending hard! 🐱🚀" },
        { id: 2, user: "SolRunner", text: "Floor is completely locked, next leg up loading." },
        { id: 3, user: "CryptoPaws", text: "Holding this until graduation!" }
      ]
    },
    { 
      id: 'VTORO', name: 'The Matador', symbol: 'VTORO', icon: '🐂', mcap: '$850K', price: '0.00085', change: '-5.3%', 
      isPositive: false, 
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-financial-trading-charts-and-data-in-a-computer-screen-31012-large.mp4',
      hypeText: "Dips are just discounts. We are charging the red candles today! 🐂🩸",
      likes: 1100, shares: 89, commentsCount: 2,
      isGraduated: false,
      comments: [
        { id: 1, user: "BullRun_X", text: "Perfect entry zone right here." },
        { id: 2, user: "RedCandleSniper", text: "Load up, the rebound will be massive." }
      ]
    },
    { 
      id: 'NEURO', name: 'Neuro AI', symbol: 'NEURO', icon: '🧠', mcap: '$4.5M', price: '0.0045', change: '+89.2%', 
      isPositive: true, 
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-working-42171-large.mp4',
      hypeText: "Neural net integration complete. We are breaking the matrix. 🌌🤖",
      likes: 8900, shares: 920, commentsCount: 2,
      isGraduated: true,
      comments: [
        { id: 1, user: "NeoCrypto", text: "Matrix broken. AI agents are taking over." },
        { id: 2, user: "SolanaBrain", text: "Pure utility token, love to see it." }
      ]
    }
  ];

  const [feedData, setFeedData] = useState(initialWatchFeed);
  const [likedStatus, setLikedStatus] = useState({});

  const activeToken = feedData[activeVideoIndex] || feedData[0];

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const vid = videoRefs.current[key];
      if (vid) {
        if (Number(key) === activeVideoIndex) {
          vid.play().catch(() => {}); 
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });
  }, [activeVideoIndex]);

  const handleScroll = () => {
    if (!containerRef.current || isCommentDrawerOpen) return;
    const scrollPosition = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const currentIndex = Math.round(scrollPosition / windowHeight);
    if (currentIndex !== activeVideoIndex && currentIndex >= 0 && currentIndex < feedData.length) {
      setActiveVideoIndex(currentIndex);
    }
  };

  const handleLikeToggle = (tokenId) => {
    setLikedStatus(prev => {
      const isCurrentlyLiked = prev[tokenId];
      setFeedData(currentFeed => currentFeed.map(item => {
        if (item.id === tokenId) {
          return { ...item, likes: isCurrentlyLiked ? item.likes - 1 : item.likes + 1 };
        }
        return item;
      }));
      return { ...prev, [tokenId]: !isCurrentlyLiked };
    });
  };

  const handleShareTrigger = (token) => {
    if (navigator.share) {
      navigator.share({
        title: `Apex Forge - ${token.name}`,
        text: token.hypeText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Link copied for ${token.name} ticker!`);
    }
  };

  const handleQuickTrade = (token) => {
    if (onTokenClick) {
      onTokenClick({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        icon: token.icon,
        mcap: token.mcap,
        price: token.price,
        change: token.change,
        isGraduated: token.isGraduated,
        progress: token.isGraduated ? 100 : 45
      });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setFeedData(currentFeed => currentFeed.map(item => {
      if (item.id === activeToken.id) {
        return {
          ...item,
          commentsCount: item.commentsCount + 1,
          comments: [
            ...item.comments,
            {
              id: Date.now(),
              user: userProfile?.username?.replace('@', '') || "You",
              text: newCommentText.trim()
            }
          ]
        };
      }
      return item;
    }));
    setNewCommentText('');
  };

  const formatCount = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black text-white font-sans overflow-hidden select-none relative">
      
      <style>{`
        .snap-container { scroll-snap-type: y mandatory; overflow-y: scroll; height: 100vh; }
        .snap-item { scroll-snap-align: start; height: 100vh; position: relative; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- FLOATING HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-40 px-4 py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 drop-shadow-md pointer-events-auto">
           <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#089981]" fill="currentColor">
              <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
              <path d="M 50 45 C 35 70, 35 85, 50 45 Z" fill="#089981" />
           </svg>
           <h1 className="text-xl font-black tracking-widest text-white uppercase">Watch</h1>
        </div>
        <div className="flex items-center gap-5 drop-shadow-md z-40 pointer-events-auto">
          <span 
            onClick={() => setCurrentFeedTab('FOLLOWING')}
            className={`text-sm font-black cursor-pointer transition-colors duration-200 relative py-1 ${
              currentFeedTab === 'FOLLOWING' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Following
            {currentFeedTab === 'FOLLOWING' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#089981] rounded-full animate-fade-in" />
            )}
          </span>
          <span 
            onClick={() => setCurrentFeedTab('FOR_YOU')}
            className={`text-sm font-black cursor-pointer transition-colors duration-200 relative py-1 ${
              currentFeedTab === 'FOR_YOU' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            For You
            {currentFeedTab === 'FOR_YOU' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#089981] rounded-full animate-fade-in" />
            )}
          </span>
        </div>
      </header>

      {/* --- SCROLL-SNAPPING FEED --- */}
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className={`snap-container no-scrollbar w-full relative ${isCommentDrawerOpen ? 'overflow-hidden touch-none' : ''}`}
      >
        {feedData.map((token, index) => {
          const isActive = index === activeVideoIndex;
          const trendColor = token.isPositive ? 'text-[#089981]' : 'text-[#F23645]';
          const isItemLiked = likedStatus[token.id];

          return (
            <div key={token.id} className="snap-item w-full bg-black flex flex-col justify-end">
              
              {/* VIDEO BACKGROUND */}
              <div className="absolute inset-0 w-full h-full opacity-80">
                <video 
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={token.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none"></div>
              </div>

              {/* ACTION BUTTONS SIDEBAR */}
              <div className="absolute right-4 bottom-32 md:bottom-28 flex flex-col items-center gap-6 z-30">
                
                {/* LIKE BUTTON */}
                <div 
                  onClick={() => handleLikeToggle(token.id)}
                  className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                    isItemLiked 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                      : 'bg-white/10 border-white/20 text-white backdrop-blur-md hover:bg-white/20'
                  }`}>
                    <svg className="w-6 h-6" fill={isItemLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className={`text-[10px] font-bold drop-shadow-md transition-colors ${isItemLiked ? 'text-rose-500' : 'text-white'}`}>
                    {formatCount(token.likes)}
                  </span>
                </div>

                {/* 💬 COMMENT BUTTON */}
                <div 
                  onClick={() => setIsCommentDrawerOpen(true)} 
                  className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{token.commentsCount}</span>
                </div>

                {/* SHARE BUTTON */}
                <div 
                  onClick={() => handleShareTrigger(token)}
                  className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md">{formatCount(token.shares)}</span>
                </div>
              </div>

              {/* BOTTOM PANEL (🚀 PERFECTED WITH pb-24 TO FLOAT CLEANLY ABOVE MOBILE NAV) */}
              <div className="relative z-30 w-[85%] p-4 pb-24 md:pb-8 flex flex-col">
                <div 
                  onClick={() => handleQuickTrade(token)}
                  className="flex items-center gap-2 mb-2 cursor-pointer group w-max"
                >
                   <div className="w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-lg group-hover:border-[#089981] transition-colors">
                      {token.icon}
                   </div>
                   <div className="flex flex-col">
                     <div className="flex items-center gap-2">
                       <h2 className="text-xl font-black text-white drop-shadow-md group-hover:text-[#089981] transition-colors">{token.name}</h2>
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

                <button 
                  onClick={() => handleQuickTrade(token)}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-xl cursor-pointer ${
                    token.isGraduated 
                      ? 'bg-amber-500 text-black hover:bg-amber-600' 
                      : 'bg-[#089981] text-white hover:bg-[#06806b]'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {token.isGraduated ? 'Trade on DEX' : 'Quick Buy'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* --- OVERLAY DRAWER WITH z-[100] TO CLEAR BOTTOM NAV --- */}
      {isCommentDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          
          <div 
            onClick={() => setIsCommentDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-sm"
          />
          
          <div className="relative w-full h-[70vh] bg-[#0E0E10] border-t border-white/10 rounded-t-3xl flex flex-col overflow-hidden animate-slideUpNative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            
            <div className="flex-none p-4 border-b border-white/[0.04] flex items-center justify-between relative bg-[#0E0E10]">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mt-2">
                Comments ({activeToken.commentsCount})
              </span>
              <button 
                onClick={() => setIsCommentDrawerOpen(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold mt-2 p-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar bg-[#0E0E10]">
              {activeToken.comments.map((comment) => (
                <div key={comment.id} className="flex flex-col bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                  <span 
                    onClick={() => alert(`Navigating to @${comment.user}'s profile...`)} 
                    className="text-xs font-black text-[#089981] mb-1 cursor-pointer hover:underline w-max active:scale-95 transition-transform"
                  >
                    @{comment.user}
                  </span>
                  <p className="text-sm font-medium text-zinc-200 leading-normal">{comment.text}</p>
                </div>
              ))}
            </div>

            <form 
              onSubmit={handleAddComment}
              className="flex-none p-4 bg-[#131316] border-t border-white/5 flex items-center gap-3 pb-8"
            >
              <input 
                type="text"
                placeholder={`Replying to @${activeToken.symbol}...`}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-600 outline-none focus:border-[#089981]/50 transition-colors"
              />
              <button 
                type="submit"
                className="bg-[#089981] hover:bg-[#06806b] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-transform active:scale-95 cursor-pointer"
              >
                Send
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}