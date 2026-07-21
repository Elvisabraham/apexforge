import React, { useState } from 'react';

export default function Home({ tokens = [], trendingTokens = [], graduatedTokens = [], onTokenClick, setActivePage, userProfile, onOpenAccountDrawer }) {
  const [activeTab, setActiveTab] = useState('TRENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // 🚀 We still enrich the tokens with visual elements (sparklines)
  const enrichedTokens = tokens.map(t => {
    const trend = t.trend || Array.from({length: 12}, () => Math.random() * 100);
    const mcapValue = parseFloat((t.mcap || t.marketCap || '$1M').replace(/[^0-9.]/g, ''));
    const isPositive = (t.change || '').includes('+') || parseFloat(t.change || 0) >= 0;
    
    return { ...t, trend, mcapValue, isPositive };
  });

  // 🚀 FIXED: Absolute strict filtering logic based on the real status flags
  const displayedTokens = enrichedTokens.filter(t => {
    // 1. If searching, override the tabs and search ALL tokens
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(query) || 
             t.symbol.toLowerCase().includes(query) || 
             (t.mintAddress && t.mintAddress.toLowerCase().includes(query));
    }
    
    // 2. Strict Tab Routing
    if (activeTab === 'GRADUATED') {
      return t.isGraduated === true || t.progress >= 100;
    }
    
    if (activeTab === 'TRENDING') {
      return !t.isGraduated && t.progress > 0 && t.progress < 100;
    }

    if (activeTab === 'NEW') {
      return !t.isGraduated && (!t.progress || t.progress === 0);
    }
    
    return true; 
  });

  // Spotlight token can just be the highest mcap in the array
  const spotlightToken = [...enrichedTokens].sort((a, b) => b.mcapValue - a.mcapValue)[0];

  const handleTokenClick = (tokenData) => {
    if (onTokenClick) {
      onTokenClick(tokenData);
    }
  };

  const renderSparkline = (trendData, isPositive) => {
    const max = Math.max(...trendData);
    const min = Math.min(...trendData);
    const range = max - min || 1;
    const color = isPositive ? '#089981' : '#F23645';
    
    const points = trendData.map((val, idx) => {
      const x = (idx / (trendData.length - 1)) * 100;
      const y = 100 - (((val - min) / range) * 100);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M 0,100 L 0,${100 - (((trendData[0] - min) / range) * 100)} L ${points} L 100,100 Z`} fill={`${color}20`} />
      </svg>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden select-none">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* --- UNMOVABLE HEADER --- */}
      <header className="flex-none z-50 bg-[#0A0A0B]/95 backdrop-blur-xl pt-4 pb-2 px-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-4">
          
          <div className="flex items-center gap-3">
            {/* Pure Trigger for Account Drawer */}
            <div 
              onClick={() => {
                if (onOpenAccountDrawer) onOpenAccountDrawer();
              }} 
              className="w-8 h-8 rounded-full border border-white/10 hover:border-[#089981]/50 bg-[#121212] flex items-center justify-center overflow-hidden cursor-pointer transition-colors shadow-inner"
            >
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">👤</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#089981]" fill="currentColor">
                <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
                <path d="M 50 45 C 35 70, 35 85, 50 45 Z" fill="#089981" />
              </svg>
              <h1 className="text-lg font-black tracking-widest text-white uppercase mt-0.5">Directory</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setActivePage && setActivePage('earn')}
              className="flex items-center gap-1.5 bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/30 px-3 py-1.5 rounded-xl transition-all shadow-inner"
            >
              <span className="w-1.5 h-1.5 bg-[#089981] rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-[#089981] uppercase tracking-[0.15em]">Earn</span>
            </button>

            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F23645] rounded-full border border-[#0A0A0B]"></span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center bg-[#131722] border border-white/5 rounded-xl px-4 py-3 focus-within:border-[#089981]/50 transition-colors shadow-inner">
          <svg className="w-4 h-4 text-zinc-500 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search tokens or CAs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-white placeholder-zinc-600 outline-none"
          />
        </div>
      </header>

      {/* --- SCROLLABLE FEED --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        
        {/* STEALTH MONETIZATION: SPOTLIGHT BANNER */}
        {spotlightToken && !searchQuery && activeTab === 'TRENDING' && (
          <div className="px-4 pt-4 pb-2">
            <div 
              onClick={() => handleTokenClick(spotlightToken)}
              className="relative w-full bg-gradient-to-br from-[#1A1A24] to-[#0A0A0B] border border-white/10 hover:border-[#A855F7]/40 rounded-2xl p-4 cursor-pointer group overflow-hidden transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#A855F7]/10 blur-3xl rounded-full pointer-events-none group-hover:bg-[#A855F7]/20 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  Spotlight
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Featured</span>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-black border border-[#A855F7]/30 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-inner overflow-hidden">
                   {spotlightToken.imagePreview ? <img src={spotlightToken.imagePreview} className="w-full h-full object-cover" alt="icon"/> : spotlightToken.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-xl font-black text-white truncate">{spotlightToken.name}</h2>
                  <span className="text-xs font-mono font-bold text-zinc-400">{spotlightToken.symbol}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-5 relative z-10">
                <div className="flex flex-col">
                  <span className={`text-lg font-black font-mono tracking-tight ${spotlightToken.isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {spotlightToken.isPositive ? '▲' : '▼'} {spotlightToken.change}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">MCap: {spotlightToken.mcap || spotlightToken.marketCap}</span>
                </div>
                <button className="px-4 py-1.5 bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-md">
                  Trade
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 py-3 border-b border-white/[0.04]">
          <div className="flex gap-2 w-full overflow-x-auto no-scrollbar bg-[#131722] p-1.5 rounded-xl border border-white/5">
            {['TRENDING', 'NEW', 'GRADUATED'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-[#089981] text-white shadow-md' 
                    : 'bg-transparent text-zinc-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 FIXED: min-h added to stop layout jumping when switching to empty tabs */}
        <div className="flex flex-col px-2 pt-1 min-h-[500px]">
          {displayedTokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <span className="text-sm font-bold uppercase tracking-widest">No assets found.</span>
            </div>
          ) : (
            displayedTokens.map((t, index) => {
              const changeColor = t.isPositive ? 'text-[#089981]' : 'text-[#F23645]';
              
              return (
                <div 
                  key={t.id || index} 
                  onClick={() => handleTokenClick(t)}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-[#131722] transition-colors border border-transparent hover:border-white/[0.02] group animate-slideDown"
                >
                  <div className="flex items-center gap-3.5 min-w-0 w-[45%]">
                    <div className="w-10 h-10 bg-[#1A1A24] border border-white/5 rounded-full flex items-center justify-center text-xl shrink-0 shadow-inner overflow-hidden group-hover:border-[#089981]/30 transition-colors">
                      {t.imagePreview ? <img src={t.imagePreview} alt={t.name} className="w-full h-full object-cover" /> : t.icon}
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-sm font-black text-white truncate leading-tight mb-0.5 group-hover:text-[#089981] transition-colors">{t.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#787B86] uppercase tracking-wider">{t.mcap || t.marketCap} MC</span>
                        {t.isGraduated || t.progress >= 100 ? (
                          <span className="text-[8px] bg-amber-400/10 text-amber-400 px-1 rounded uppercase font-black tracking-widest">Grad</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center w-12 sm:w-16 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                    {renderSparkline(t.trend, t.isPositive)}
                  </div>

                  <div className="flex flex-col items-end shrink-0 w-[30%]">
                    <span className="text-[14px] sm:text-[15px] font-black text-white font-mono tracking-tight">${t.price}</span>
                    <span className={`text-[10px] sm:text-[11px] font-black ${changeColor} tracking-wide mt-0.5`}>{t.isPositive ? '▲' : '▼'} {t.change}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}