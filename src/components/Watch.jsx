// 🚀 VERSION 8: WATCH FEED WITH TIKTOK-STYLE SEARCH BAR & OVERLAY
import React, { useState, useEffect, useRef } from 'react';

export default function Watch({ onTokenClick, userProfile }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentFeedTab, setCurrentFeedTab] = useState('FOR_YOU');
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  // 🚀 NEW: Search state variables
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // 🚀 Filter feed based on search query
  const filteredFeed = feedData.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.hypeText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeToken = filteredFeed[activeVideoIndex] || filteredFeed[0] || feedData[0];

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
  }, [activeVideoIndex, searchQuery]);

  const handleScroll = () => {
    if (!containerRef.current || isCommentDrawerOpen) return;
    const scrollPosition = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const currentIndex = Math.round(scrollPosition / windowHeight);
    if (currentIndex !== activeVideoIndex && currentIndex >= 0 && currentIndex < filteredFeed.length) {
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
    if (!newCommentText.trim() || !activeToken) return;

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

      {/* --- DESKTOP FLOATING HEADER (Tabs + Search Icon) --- */}
      <header className="fixed top-0 left-64 w-[calc(100%-16rem)] hidden md:flex z-40 px-6 py-6 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 drop-shadow-md pointer-events-auto">
           <h1 className="text-xl font-black tracking-widest text-white uppercase">Watch Feed</h1>
        </div>
        <div className="flex items-center gap-6 drop-shadow-md z-40 pointer-events-auto">
          <div className="flex items-center gap-5">
            <span 
              onClick={() => setCurrentFeedTab('FOLLOWING')}
              className={`text-sm font-black cursor-pointer transition-colors duration-200 relative py-1 ${
                currentFeedTab === 'FOLLOWING' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Following
              {currentFeedTab === 'FOLLOWING' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#089981] rounded-full" />
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
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#089981] rounded-full" />
              )}
            </span>
          </div>

          {/* 🔍 TikTok Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* --- MOBILE FLOATING HEADER (Tabs + TikTok Search Icon) --- */}
      <header className="fixed top-0 left-0 w-full flex md:hidden z-40 px-4 py-5 items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 drop-shadow-md pointer-events-auto">
           <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#089981]" fill="currentColor">
              <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
              <path d="M 50 45 C 35 70, 35 85, 50 45 Z" fill="#089981" />
           </svg>
           <h1 className="text-lg font-black tracking-widest text-white uppercase">Watch</h1>
        </div>
        
        <div className="flex items-center gap-4 drop-shadow-md pointer-events-auto">
          <span 
            onClick={() => setCurrentFeedTab('FOLLOWING')}
            className={`text-xs font-black cursor-pointer transition-colors duration-200 ${
              currentFeedTab === 'FOLLOWING' ? 'text-white underline decoration-[#089981] decoration-2' : 'text-zinc-400'
            }`}
          >
            Following
          </span>
          <span 
            onClick={() => setCurrentFeedTab('FOR_YOU')}
            className={`text-xs font-black cursor-pointer transition-colors duration-200 ${
              currentFeedTab === 'FOR_YOU' ? 'text-white underline decoration-[#089981] decoration-2' : 'text-zinc-400'
            }`}
          >
            For You
          </span>

          {/* 🔍 TikTok Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ml-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* --- SCROLL-SNAPPING FEED --- */}
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className={`snap-container no-scrollbar w-full relative pb-40 ${isCommentDrawerOpen || isSearchOpen ? 'overflow-hidden touch-none' : ''}`}
      >
        {filteredFeed.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-black text-white">No Tickers Found</h3>
            <p className="text-xs text-zinc-400">No matching videos or tokens for "{searchQuery}". Try searching for APEX, BCAT, or AI.</p>
            <button onClick={() => setSearchQuery('')} className="mt-2 px-4 py-2 bg-[#089981] text-white rounded-xl text-xs font-bold uppercase cursor-pointer">Clear Search</button>
          </div>
        ) : (
          filteredFeed.map((token, index) => {
            const isActive = index === activeVideoIndex;
            const trendColor = token.isPositive ? 'text-[#089981]' : 'text-[#F23645]';
            const isItemLiked = likedStatus[token.id];

            return (
              <div key={token.id} className="snap-item w-full bg-black">
                
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
                <div className="absolute right-4 bottom-44 flex flex-col items-center gap-6 z-30">
                  
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

                {/* BOTTOM PANEL */}
                <div className="absolute left-0 bottom-32 md:bottom-24 mb-16 md:mb-0 w-[85%] p-4 flex flex-col z-30">
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
          })
        )}
      </div>

      {/* --- 🔍 TIKTOK-STYLE SEARCH OVERLAY MODAL --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex flex-col p-4 animate-fadeIn">
          
          {/* Search Header Input bar */}
          <div className="flex items-center gap-3 w-full max-w-2xl mx-auto pt-2 pb-4">
            <div className="flex-1 flex items-center bg-[#121212] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#089981] transition-colors shadow-inner">
              <svg className="w-5 h-5 text-zinc-400 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                autoFocus
                placeholder="Search tokens, symbols, or hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-bold placeholder-zinc-500 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white px-2 cursor-pointer font-bold text-xs">Clear</button>
              )}
            </div>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Search Results List */}
          <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full flex flex-col gap-3 no-scrollbar pb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1 mt-2">Matching Watch Tickers</span>
            
            {feedData.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || t.hypeText.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs font-bold">No results found for "{searchQuery}"</div>
            ) : (
              feedData
                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || t.hypeText.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((token) => (
                  <div 
                    key={token.id}
                    onClick={() => {
                      const foundIdx = feedData.findIndex(t => t.id === token.id);
                      if (foundIdx !== -1) setActiveVideoIndex(foundIdx);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between bg-[#121212] hover:bg-white/[0.04] border border-white/5 p-4 rounded-2xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {token.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{token.name}</h4>
                          <span className="text-[10px] font-mono font-bold text-zinc-400">@{token.symbol}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium truncate max-w-[220px] sm:max-w-md">{token.hypeText}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-mono font-black text-white">${token.price}</span>
                      <span className={`text-[10px] font-black ${token.isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>{token.change}</span>
                    </div>
                  </div>
                ))
            )}
          </div>

        </div>
      )}

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