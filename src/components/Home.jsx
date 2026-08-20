import React, { useState } from 'react';

export default function Home({ 
  tokens, 
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
  const [activeTab, setActiveTab] = useState('Total'); // Total, Tokens, Perps
  const [activePortfolioTab, setActivePortfolioTab] = useState('Positions'); // Positions, Activities, Follows
  const [launchFilter, setLaunchFilter] = useState('New'); // 'New', 'Migrating', 'Migrated'
  const [tokenTimeframe, setTokenTimeframe] = useState('24h');

  // Filter tokens based on global search query
  const filteredTrending = trendingTokens.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👈 ADDED MIGRATING FILTER LOGIC
  const filteredMigrating = migratingTokens.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGraduated = graduatedTokens.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👈 UPDATED DISPLAY LOGIC TO HANDLE ALL 3 STATES
  const displayLaunches = 
    launchFilter === 'New' 
      ? filteredTrending 
      : launchFilter === 'Migrating' 
      ? filteredMigrating 
      : filteredGraduated;

  return (
    <div className="flex-1 bg-[#050505] text-white flex flex-col w-full h-full overflow-hidden p-2 pt-0 md:p-3 md:pt-0">
      
      {/* --- COMPACT TOP BAR --- */}
  <div className="flex items-center justify-between pb-1 shrink-0 border-b border-zinc-800/40">
    <div className="flex items-center gap-3">
      {/* Mobile sidebar button preserved */}
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
            className="w-9 h-9 bg-[#141417] border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            🔔
          </button>
          <div 
            onClick={onOpenAccountDrawer}
            className="flex items-center gap-2 bg-[#141417] border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-xs">
              {userProfile?.name ? userProfile.name[0] : 'E'}
            </div>
            <span className="text-xs font-bold text-zinc-200 hidden sm:inline">{userProfile?.name || 'Elvis'}</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Dashboard Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-w-[1700px] w-full mx-auto">
        
        {/* COLUMN 1: Portfolio / Account Summary */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex bg-[#0a0a0c] p-1 rounded-xl mb-4 border border-zinc-800/50">
              {['Total', 'Tokens', 'Perps'].map((tab) => (
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

        {/* COLUMN 2: Launches Feed */}
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

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {displayLaunches.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">
                No tokens found
              </div>
            ) : (
              displayLaunches.map((token) => (
                <div 
                  key={token.id}
                  onClick={() => onTokenClick(token)}
                  className="bg-[#0a0a0c] hover:bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700 p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 group shadow-sm"
                >
                 
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#121216] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
  {token.imagePreview || token.image ? (
    <img src={token.imagePreview || token.image} alt={token.symbol} className="w-full h-full object-cover" />
  ) : (
    <span className="text-base font-black text-white">{token.symbol?.slice(0, 2) || token.icon || '🪙'}</span>
  )}

  {/* Green status badge dot in bottom corner */}
  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#089981] border-2 border-[#0a0a0c] rounded-full" />
</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-black text-white truncate">{token.name}</span>
                      <span className="text-[11px] font-mono font-black text-[#089981]">MC ${token.mcap || '10.0K'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">TX {Math.floor(Math.random() * 50) + 5}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">{token.change || '+0.0%'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: Tokens Leaderboard Table */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Tokens</h2>
            <button className="flex items-center gap-1 bg-[#0a0a0c] border border-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-bold text-zinc-300 hover:text-white transition-colors">
              <span>{tokenTimeframe}</span>
              <span className="text-[9px]">▼</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">
            <span># Token</span>
            <span>Market Cap</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {[
              { rank: 1, name: 'ANSEM', mcap: '$272.5M', icon: '🐵' },
              { rank: 2, name: 'EYE', mcap: '$5M', icon: '👁️' },
              { rank: 3, name: 'Z500', mcap: '$876.7K', icon: '⚡' },
              { rank: 4, name: 'BULLSHIT', mcap: '$1.1M', icon: '💩' },
              { rank: 5, name: 'CATE', mcap: '$13.1M', icon: '🐱' },
              { rank: 6, name: 'JIMOTHY', mcap: '$6.6M', icon: '🧸' },
              { rank: 7, name: 'LAYOOO', mcap: '$2.4M', icon: '🚀' },
            ].map((item) => (
              <div 
                key={item.rank}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-500 w-4">{item.rank}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#089981]">{item.mcap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 4: Perps Market Table */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Perps</h2>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Leverage</span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">
            <span># Symbol</span>
            <span>Price</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {[
              { rank: 1, symbol: 'BTC', lev: '40x', price: '$64,354.00', icon: '₿' },
              { rank: 2, symbol: 'SNDK', lev: '10x', price: '$1,810.40', icon: '⚡' },
              { rank: 3, symbol: 'ETH', lev: '25x', price: '$1,909.60', icon: 'Ξ' },
              { rank: 4, symbol: 'SKHX', lev: '10x', price: '$1,208.60', icon: '🛡️' },
              { rank: 5, symbol: 'SPCX', lev: '20x', price: '$145.90', icon: '🪐' },
              { rank: 6, symbol: 'HYPE', lev: '10x', price: '$59.39', icon: '🔥' },
              { rank: 7, symbol: 'XYZ100', lev: '30x', price: '$30,001.00', icon: '💎' },
            ].map((item) => (
              <div 
                key={item.rank}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-500 w-4">{item.rank}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-purple-400">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.symbol}</div>
                    <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.2 rounded font-mono">{item.lev}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-200">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}