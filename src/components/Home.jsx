import React from 'react';

export default function Home({ 
  trendingTokens = [], 
  migratingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  userProfile, 
  onOpenSidebar, 
  onOpenAccountDrawer, 
  onOpenNotifications,
  searchQuery = ''
}) {
  // Search filter utility
  const filterList = (list) => list.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNew = filterList(trendingTokens);
  const filteredMigrating = filterList(migratingTokens);
  const filteredMigrated = filterList(graduatedTokens);

  // Helper component to render individual token cards inside each column
  const TokenCard = ({ token }) => (
    <div 
      onClick={() => onTokenClick(token)}
      className="bg-[#0a0a0c] hover:bg-zinc-800/30 border border-zinc-800/60 hover:border-zinc-700/80 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[#121216] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative font-black text-white text-xs">
          {token.imagePreview || token.image ? (
            <img src={token.imagePreview || token.image} alt={token.symbol} className="w-full h-full object-cover" />
          ) : (
            <span>{token.symbol?.slice(0, 2) || 'TK'}</span>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs font-black text-white tracking-tight">{token.symbol}</span>
            <span className="text-[11px] text-zinc-400 truncate">{token.name}</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-mono">
            <span>{token.timeAgo || '1s'}</span>
            <span className="text-zinc-600">🔍</span>
            <span className="flex items-center gap-0.5"><span className="text-zinc-600">👥</span> {token.holders || 2}</span>
            <span className="font-bold text-zinc-400">TX {token.txCount || 1}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono font-bold">
            <span className="text-rose-500 flex items-center gap-0.5">🎯 {token.sniperPct || '0%'}</span>
            <span className="text-emerald-500 flex items-center gap-0.5">🎰 {token.devPct || '0%'}</span>
            <span className="text-sky-400 flex items-center gap-0.5">💎 {token.holderPct || '0%'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 gap-1.5">
        <button className="flex items-center gap-1 bg-[#141417] hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-zinc-300 hover:text-emerald-400 transition-colors">
          <span className="text-amber-400">⚡</span>
          <span>≡ {token.buySol || '0.1'}</span>
        </button>

        <div className="flex flex-col items-end text-right font-mono">
          <span className="text-[11px] font-black text-[#089981]">MC ${token.mcap || '2.4K'}</span>
          <span className="text-[9px] text-zinc-500 uppercase">VOL ${token.volume || '0.09'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#050505] text-white flex flex-col w-full h-screen overflow-hidden p-2 pt-0 md:p-3 md:pt-0 font-sans">
      
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

      {/* Main 3-Column Kanban Grid */}
      <div className="flex-1 p-2 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden w-full mx-auto">
        
        {/* COLUMN 1: NEW */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider">New</h2>
              <span className="bg-[#0a0a0c] border border-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {filteredNew.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white text-xs font-bold">•••</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 scrollbar-hide">
            {filteredNew.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">
                No new tokens
              </div>
            ) : (
              filteredNew.map((token, idx) => (
                <TokenCard key={token.id || token.mintAddress || idx} token={token} />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: MIGRATING */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider">Migrating</h2>
              <span className="bg-[#0a0a0c] border border-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {filteredMigrating.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white text-xs font-bold">•••</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 scrollbar-hide">
            {filteredMigrating.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-zinc-500 font-medium">
                No tokens migrating
              </div>
            ) : (
              filteredMigrating.map((token, idx) => (
                <TokenCard key={token.id || token.mintAddress || idx} token={token} />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: MIGRATED */}
        <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider">Migrated</h2>
              <span className="bg-[#0a0a0c] border border-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {filteredMigrated.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white text-xs font-bold">•••</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 scrollbar-hide">
            {filteredMigrated.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-zinc-500 font-medium">
                No tokens migrated
              </div>
            ) : (
              filteredMigrated.map((token, idx) => (
                <TokenCard key={token.id || token.mintAddress || idx} token={token} />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}