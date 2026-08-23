import React, { useState } from 'react';

export default function Home({ 
  tokens = [], 
  trendingTokens = [], 
  migratingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  setActivePage, 
  userProfile, 
  onOpenSidebar, 
  onOpenAccountDrawer, 
  onOpenNotifications,
  searchQuery = ''
}) {
  const [activeTab, setActiveTab] = useState('Total');
  const [activePortfolioTab, setActivePortfolioTab] = useState('Positions');
  const [launchFilter, setLaunchFilter] = useState('New');
  const [tokenTimeframe, setTokenTimeframe] = useState('24h');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  // Search filtering
  const filterList = (list) => list.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrending = filterList(trendingTokens);
  const filteredMigrating = filterList(migratingTokens);
  const filteredGraduated = filterList(graduatedTokens);

  const displayLaunches = 
    launchFilter === 'New' 
      ? filteredTrending 
      : launchFilter === 'Migrating' 
      ? filteredMigrating 
      : filteredGraduated;

  // Mock Tokens Data with High-World-Class Metadata
  const leaderboardData = [
    { rank: 1, symbol: 'ANSEM', name: 'Ansem', mcap: '$272.5M', change: '+14.2%', isPositive: true, volume: '$12.4M', icon: '🐵' },
    { rank: 2, symbol: 'EYE', name: 'Eye Network', mcap: '$5.0M', change: '+8.7%', isPositive: true, volume: '$820K', icon: '👁️' },
    { rank: 3, symbol: 'Z500', name: 'Z500 Protocol', mcap: '$876.7K', change: '-3.1%', isPositive: false, volume: '$140K', icon: '⚡' },
    { rank: 4, symbol: 'BULLSHIT', name: 'Bullshit Coin', mcap: '$1.1M', change: '+42.0%', isPositive: true, volume: '$310K', icon: '💩' },
    { rank: 5, symbol: 'CATE', name: 'Cate Tech', mcap: '$13.1M', change: '+2.1%', isPositive: true, volume: '$2.1M', icon: '🐱' },
    { rank: 6, symbol: 'JIMOTHY', name: 'Jimothy', mcap: '$6.6M', change: '-1.4%', isPositive: false, volume: '$950K', icon: '🧸' },
    { rank: 7, symbol: 'LAYOOO', name: 'Layooo', mcap: '$2.4M', change: '+105.8%', isPositive: true, volume: '$1.8M', icon: '🚀' },
  ];

  return (
    <div className="flex-1 bg-[#050505] text-white flex flex-col w-full h-full overflow-hidden p-2 pt-0 md:p-3 md:pt-0 font-sans">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-2 shrink-0 border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg bg-white/5"
          >
            ≡
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenNotifications}
            className="w-8 h-8 bg-[#141417] border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm"
          >
            🔔
          </button>
          <div 
            onClick={onOpenAccountDrawer}
            className="flex items-center gap-2 bg-[#141417] border border-zinc-800 hover:border-zinc-700 px-3 py-1 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-[10px]">
              {userProfile?.name ? userProfile.name[0] : 'E'}
            </div>
            <span className="text-xs font-bold text-zinc-200 hidden sm:inline">{userProfile?.name || 'Elvis AI'}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Dashboard Grid */}
      <div className="flex-1 p-2 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-w-[1700px] w-full mx-auto">
        
        {/* COLUMN 1: Portfolio / Account Summary */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex bg-[#0a0a0c] p-1 rounded-xl mb-4 border border-zinc-800/50">
              {['Total', 'Tokens'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Balance</span>
              <div className="text-2xl font-black font-mono text-white mt-0.5">$0</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">P&L</span>
                <span className="text-xs font-mono font-bold text-zinc-400">$0</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col border-t border-zinc-800/60 pt-4">
            <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-2 mb-3">
              {['Positions', 'Activities', 'Follows'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActivePortfolioTab(sub)}
                  className={`text-xs font-bold transition-colors relative pb-1 ${activePortfolioTab === sub ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {sub}
                  {activePortfolioTab === sub && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-purple-500 rounded-full"></div>}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <span className="text-xs text-zinc-500 font-medium">No {activePortfolioTab.toLowerCase()} yet</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Launches Feed (Upgraded with Screenshot 2 Detailed Metrics) */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Launches</h2>
            <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-zinc-800/50">
              {['New', 'Migrating', 'Migrated'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setLaunchFilter(filter)} 
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    launchFilter === filter 
                      ? 'bg-zinc-800 text-white shadow' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {displayLaunches.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">
                No tokens found
              </div>
            ) : (
              displayLaunches.map((token) => (
                <div 
                  key={token.id || token.mintAddress}
                  onClick={() => onTokenClick(token)}
                  className="bg-[#0a0a0c] hover:bg-zinc-800/30 border border-zinc-800/60 hover:border-zinc-700/80 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-sm"
                >
                  {/* Left Section: Icon & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#121216] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                      {token.imagePreview || token.image ? (
                        <img src={token.imagePreview || token.image} alt={token.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-white">{token.symbol?.slice(0, 3) || 'TOKEN'}</span>
                      )}
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#089981] border-2 border-[#0a0a0c] rounded-full" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-black text-white tracking-tight">{token.symbol}</span>
                        <span className="text-[11px] text-zinc-400 truncate">{token.name}</span>
                      </div>

                      {/* Screenshot 2 Detailed Metrics Line */}
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-mono">
                        <span>{token.timeAgo || '1s'}</span>
                        <span className="text-zinc-600">🔍</span>
                        <span className="flex items-center gap-0.5"><span className="text-zinc-600">👥</span> {token.holders || 2}</span>
                        <span className="font-bold text-zinc-400">TX {token.txCount || 1}</span>
                      </div>

                      {/* Percentage Indicators */}
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono font-bold">
                        <span className="text-rose-500 flex items-center gap-0.5">🎯 {token.sniperPct || '0%'}</span>
                        <span className="text-emerald-500 flex items-center gap-0.5">🎰 {token.devPct || '0%'}</span>
                        <span className="text-sky-400 flex items-center gap-0.5">💎 {token.holderPct || '0%'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Buy Action & Financial Metrics */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <button className="flex items-center gap-1 bg-[#141417] hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-zinc-300 hover:text-emerald-400 transition-colors">
                      <span className="text-amber-400">⚡</span>
                      <span>{token.buySol || '0.1'}</span>
                    </button>

                    <div className="flex flex-col items-end text-right font-mono">
                      <span className="text-[11px] font-black text-[#089981]">MC ${token.mcap || '2.4K'}</span>
                      <span className="text-[9px] text-zinc-500 uppercase">VOL ${token.volume || '0.09'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: World-Class Tokens Leaderboard */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Tokens</h2>
            
            {/* Interactive Timeframe Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                className="flex items-center gap-1 bg-[#0a0a0c] border border-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-bold text-zinc-300 hover:text-white transition-colors"
              >
                <span>{tokenTimeframe}</span>
                <span className="text-[9px] text-zinc-500">▼</span>
              </button>

              {isTimeframeOpen && (
                <div className="absolute right-0 mt-1 w-20 bg-[#0a0a0c] border border-zinc-800 rounded-xl shadow-2xl py-1 z-20">
                  {['1h', '6h', '24h', '7d'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => { setTokenTimeframe(tf); setIsTimeframeOpen(false); }}
                      className="w-full text-left px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">
            <span># Token</span>
            <div className="flex items-center gap-4">
              <span>24h Change</span>
              <span>Market Cap</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {leaderboardData.map((item) => (
              <div 
                key={item.rank}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-zinc-500 w-4 shrink-0">{item.rank}</span>
                  <div className="w-8 h-8 rounded-xl bg-[#0a0a0c] border border-zinc-800 flex items-center justify-center text-sm shrink-0 shadow-inner group-hover:border-zinc-700 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{item.symbol}</span>
                    <span className="text-[9px] text-zinc-500 truncate font-mono">Vol {item.volume}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono shrink-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {item.change}
                  </span>
                  <span className="text-xs font-bold text-[#089981] min-w-[55px] text-right">{item.mcap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}