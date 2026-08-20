import React from 'react';

// Skeleton state for dynamic WebSocket feeds
const CardSkeleton = () => (
  <div className="bg-[#18181d]/40 p-2 rounded-xl border border-white/5 animate-pulse flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-2xl bg-white/10" />
      <div className="space-y-2">
        <div className="w-24 h-3 bg-white/10 rounded" />
        <div className="w-16 h-2 bg-white/10 rounded" />
      </div>
    </div>
    <div className="w-14 h-7 bg-white/10 rounded-xl" />
  </div>
);

const TokenCard = ({ token, columnType = 'new' }) => {
  // Bonding progress percentage
  const rawProgress = token?.progress ?? (columnType === 'migrated' ? 100 : columnType === 'migrating' ? 76 : 0);
  const curveProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));
  
  const top10Percent = Math.round(token?.top10 ?? 0);
  const devPercent = Math.round(token?.devHold ?? 0);

  // Active border stroke color mapping
  const strokeColor = columnType === 'migrated' ? '#3b82f6' : columnType === 'migrating' ? '#f59e0b' : '#00f2a1';

  return (
    <div className="bg-[#141418]/90 hover:bg-[#1a1a20] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer group shrink-0">
      
      {/* Left Side: Prominent Avatar & Token Metadata */}
      <div className="flex items-center space-x-3.5 overflow-hidden">
        
        {/* Expanded Avatar Container (64x64px) */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center p-1.5">
          
          {/* SVG canvas with expanded viewBox to prevent stroke clipping */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="-3 -3 70 70">
            {/* Dark background track */}
            <rect
              x="2"
              y="2"
              width="60"
              height="60"
              rx="16"
              className="text-zinc-800/80"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
            />
            {/* Dynamic bonding progress stroke locked to pathLength=100 */}
            <rect
              x="2"
              y="2"
              width="60"
              height="60"
              rx="16"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - curveProgress}
              className="transition-all duration-300"
            />
          </svg>

          {/* Token Image neatly centered inside the ring */}
          <div className="w-full h-full rounded-[13px] bg-zinc-900 overflow-hidden flex items-center justify-center z-10">
            {token?.imagePreview || token?.image ? (
              <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
            ) : (
              <span className="text-sm font-black text-white tracking-wider">
                {token?.symbol ? token.symbol.slice(0, 2).toUpperCase() : 'AF'}
              </span>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-between truncate py-0.5">
          {/* Ticker & Name */}
          <div className="flex items-center space-x-1.5 truncate">
            <span className="font-extrabold text-xs text-white truncate font-mono">
              {token?.symbol ? token.symbol.toUpperCase() : 'SOL'}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium truncate">
              {token?.name || token?.symbol || 'Loading...'}
            </span>
          </div>
          
          {/* Line 2: Created Time, Solscan, Holders, Spaced TX */}
          <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono mt-0.5">
            <span>{token?.timeAgo || token?.createdAgo || '1s'}</span>
            
            {/* Solscan Explorer Icon */}
            <a 
              href={token?.mintAddress ? `https://solscan.io/token/${token.mintAddress}` : '#'} 
              target="_blank" 
              rel="noreferrer" 
              title="Inspect CA on Solscan"
              className="hover:text-emerald-400 transition-colors"
            >
              <svg className="w-3 h-3 text-zinc-400 hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>

            <span className="text-zinc-500 text-[10px]">👥 {token?.holders || 2}</span>

            <span className="text-zinc-300 font-semibold">
              TX {token?.txCount ?? token?.transactions ?? 1}
            </span>
          </div>

          {/* Line 3: Metric Badges */}
          <div className="flex items-center space-x-2 text-[10px] font-mono mt-0.5">
            <div className="flex items-center space-x-0.5 text-orange-400 font-semibold">
              <span className="text-[8px]">🎯</span>
              <span>{curveProgress}%</span>
            </div>

            <div className="flex items-center space-x-0.5 text-teal-400 font-semibold">
              <span className="text-[8px]">📊</span>
              <span>{top10Percent}%</span>
            </div>

            <div className="flex items-center space-x-0.5 text-emerald-400 font-semibold">
              <span className="text-[8px]">💎</span>
              <span>{devPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Quick Buy Trigger & Market Cap / Volume */}
      <div className="flex flex-col items-end justify-between shrink-0 pl-2 self-stretch py-0.5">
        <button className="bg-[#1a2024]/90 hover:bg-[#222b31] active:scale-95 text-[#00f2a1] font-mono font-bold text-[11px] px-2.5 py-1 rounded-md border border-white/5 hover:border-[#00f2a1]/30 flex items-center space-x-1 transition-all shadow-sm">
          <span className="text-[#00f2a1] text-[10px]">⚡</span>
          
          <svg viewBox="0 0 397 311" className="w-[9px] h-[9px] text-zinc-400" fill="currentColor">
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
          </svg>

          <span className="text-emerald-400 font-bold text-[10px] font-mono">0.1</span>
        </button>

        <div className="text-right leading-tight mt-auto">
          <div className="text-[11px] font-bold text-[#089981]">
            MC {token?.mcap?.startsWith('$') ? token.mcap : `$${token?.mcap || '2.4K'}`}
          </div>
          <div className="text-[9px] text-zinc-400 font-mono">
            VOL ${token?.vol || '0.09'}
          </div>
        </div>
      </div>

    </div>
  );
};

    export default function LaunchesView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
    return (
      <div className="h-full w-full px-3 py-1 overflow-hidden flex flex-col bg-[#0a0a0c]">
      {/* 3-Column Layout with strict inner scrolling and zero outer page overflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 h-full w-full flex-1 min-h-0">
        
        {/* New Column */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
          {/* Column Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-[#121216]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white tracking-wide">New</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                {newTokens.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold p-1">
              •••
            </button>
          </div>

          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {newTokens.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No new tokens yet</div>
            ) : (
              newTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} />)
            )}
          </div>
        </div>

        {/* Migrating Column */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
          {/* Column Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-[#121216]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white tracking-wide">Migrating</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                {migratingTokens.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold p-1">
              •••
            </button>
          </div>

          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {migratingTokens.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No tokens migrating</div>
            ) : (
              migratingTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} />)
            )}
          </div>
        </div>

        {/* Migrated Column */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
          {/* Column Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-[#121216]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white tracking-wide">Migrated</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                {migratedTokens.length}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold p-1">
              •••
            </button>
          </div>

          <div className="p-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {migratedTokens.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No graduated tokens yet</div>
            ) : (
              migratedTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}