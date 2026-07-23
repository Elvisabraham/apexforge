import React, { useState } from 'react';

export default function Home({ 
  tokens = [], 
  trendingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  setActivePage, 
  userProfile, 
  onOpenSidebar,
  onOpenAccountDrawer,
  onOpenNotifications 
}) {
  const [activeTab, setActiveTab] = useState('EXPLORE');
  const [searchQuery, setSearchQuery] = useState('');

  const enrichedTokens = tokens.map(t => {
    const trend = t.trend || Array.from({length: 12}, () => Math.random() * 100);
    const mcapValue = parseFloat((t.mcap || t.marketCap || '$1M').replace(/[^0-9.]/g, ''));
    const isPositive = (t.change || '').includes('+') || parseFloat(t.change || 0) >= 0;
    return { ...t, trend, mcapValue, isPositive };
  });

  const displayedTokens = enrichedTokens.filter(t => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(query) || 
             t.symbol.toLowerCase().includes(query) || 
             (t.mintAddress && t.mintAddress.toLowerCase().includes(query));
    }
    if (activeTab === 'EXPLORE') return true;
    if (activeTab === 'GRADUATED') return t.isGraduated === true || t.progress >= 100;
    if (activeTab === 'TRENDING') return !t.isGraduated && t.progress >= 5 && t.progress < 100;
    if (activeTab === 'NEW') return !t.isGraduated && (!t.progress || t.progress < 5);
    return true; 
  });

  const spotlightToken = [...enrichedTokens].sort((a, b) => b.mcapValue - a.mcapValue)[0];

  const handleTokenClick = (tokenData) => {
    if (onTokenClick) onTokenClick(tokenData);
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
    <div className="flex flex-col w-full h-full bg-[#0A0A0B] text-white font-sans overflow-hidden select-none relative">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- UNMOVABLE HEADER --- */}
      <header className="flex-none z-50 bg-[#0A0A0B]/95 backdrop-blur-xl pt-4 pb-3 px-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-4">
          
          {/* 🚀 LEFT SIDE: PROFILE AVATAR + DIRECTORY TITLE */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => { if (onOpenAccountDrawer) onOpenAccountDrawer(); }} 
              className="w-10 h-10 rounded-full border-2 border-[#089981] hover:border-white bg-[#121212] flex items-center justify-center overflow-hidden cursor-pointer transition-colors shadow-lg shrink-0"
            >
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.username || 'Elvis'}`} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 text-[#089981]" fill="currentColor">
                <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
                <path d="M 50 45 C 35 70, 35 85, 50 45 Z" fill="#089981" />
              </svg>
              <h1 className="text-base sm:text-lg font-black tracking-widest text-white uppercase mt-0.5">Directory</h1>
            </div>
          </div>
          
          {/* 🚀 RIGHT SIDE: EARN BUTTON (VISIBLE ON MOBILE) + NOTIFICATIONS */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActivePage && setActivePage('earn')}
              className="flex items-center gap-1.5 bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/30 px-3 py-1.5 rounded-xl transition-all shadow-inner cursor-pointer"
            >
              <span className="w-1.5 h-1.5 bg-[#089981] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-[#089981] uppercase tracking-[0.15em]">Earn</span>
            </button>

            <button 
              onClick={onOpenNotifications}
              className="relative p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#089981] rounded-full border border-[#0A0A0B]"></span>
            </button>
          </div>
        </div>

        <div className="flex items-center bg-[#131722] border border-white/5 rounded-xl px-4 py-3.5 focus-within:border-[#089981]/50 transition-colors shadow-inner">
          <svg className="w-5 h-5 text-zinc-500 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search tokens or CAs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[15px] font-bold text-white placeholder-zinc-600 outline-none"
          />
        </div>
      </header>

      {/* --- SCROLLABLE FEED --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-20">
        
        {spotlightToken && !searchQuery && (activeTab === 'TRENDING' || activeTab === 'EXPLORE') && (
          <div className="px-4 pt-4 pb-2">
            <div 
              onClick={() => handleTokenClick(spotlightToken)}
              className="relative w-full bg-gradient-to-br from-[#1A1A24] to-[#0A0A0B] border border-white/10 hover:border-[#A855F7]/50 rounded-[2rem] p-5 cursor-pointer group overflow-hidden transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#A855F7]/15 blur-3xl rounded-full pointer-events-none group-hover:bg-[#A855F7]/30 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <span className="bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  Spotlight
                </span>
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Featured</span>
              </div>

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border-2 border-[#A855F7]/50 rounded-full flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                   {spotlightToken.imagePreview ? <img src={spotlightToken.imagePreview} className="w-full h-full object-cover" alt="icon"/> : spotlightToken.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-black text-white truncate">{spotlightToken.name}</h2>
                  <span className="text-sm font-mono font-bold text-zinc-400 mt-1">{spotlightToken.symbol}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-6 relative z-10">
                <div className="flex flex-col">
                  <span className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${spotlightToken.isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {spotlightToken.isPositive ? '▲' : '▼'} {spotlightToken.change}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-1">MCap: {spotlightToken.mcap || spotlightToken.marketCap}</span>
                </div>
                <button className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-md">
                  Trade
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 py-3 border-b border-white/[0.04]">
          <div className="flex gap-2 w-full overflow-x-auto no-scrollbar bg-[#131722] p-1.5 rounded-xl border border-white/5">
            {['EXPLORE', 'TRENDING', 'NEW', 'GRADUATED'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[80px] py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                  activeTab === tab 
                    ? 'bg-[#089981] text-white shadow-md' 
                    : 'bg-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col px-3 pt-2 min-h-[500px]">
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
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl cursor-pointer hover:bg-[#131722] transition-colors border border-transparent hover:border-white/[0.05] group shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0 w-[45%]">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1A1A24] border border-white/10 rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner overflow-hidden group-hover:border-[#089981]/50 transition-colors">
                      {t.imagePreview ? <img src={t.imagePreview} alt={t.name} className="w-full h-full object-cover" /> : t.icon}
                    </div>
                    
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[15px] sm:text-[17px] font-black text-white truncate leading-tight mb-1 group-hover:text-[#089981] transition-colors">{t.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#787B86] uppercase tracking-wider">{t.mcap || t.marketCap} MC</span>
                        {t.isGraduated || t.progress >= 100 ? (
                          <span className="text-[9px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded uppercase font-black tracking-widest shadow-sm">Grad</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center w-14 sm:w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    {renderSparkline(t.trend, t.isPositive)}
                  </div>

                  <div className="flex flex-col items-end shrink-0 w-[30%]">
                    <span className="text-[15px] sm:text-[17px] font-black text-white font-mono tracking-tight">${t.price}</span>
                    <span className={`text-[11px] sm:text-[12px] font-black ${changeColor} tracking-wide mt-1`}>{t.isPositive ? '▲' : '▼'} {t.change}</span>
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