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
  // 1. Bonding progress percentage evaluation
  const rawProgress = token?.progress ?? token?.bondingCurvePct ?? (columnType === 'migrated' ? 100 : 0);
  const curveProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));
  
  const top10Percent = Math.round(token?.top10 ?? 0);
  const devPercent = Math.round(token?.devHold ?? 0);

  // 2. Fix Double Dollar Sign ($$) formatting
  const formatMcap = (val) => {
    if (!val) return '$2.4K';
    const cleanVal = String(val).replace(/^\$+/, '');
    return `$${cleanVal}`;
  };

  // 3. Squircle Path Metrics for aligned SVG rendering
  const rectSize = 44;
  const rx = 12; 
  const strokeWidth = 2.5;
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (curveProgress / 100) * perimeter;

  return (
    <div className="bg-[#121316] hover:bg-[#181a1f] p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer group shrink-0 w-full">
      
      {/* Left Side: Avatar & Token Metadata */}
      <div className="flex items-center space-x-3 overflow-hidden">
        
        {/* Avatar Container with Squircle Bonding Curve Ring */}
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
            {/* Background Track Ring */}
            <rect
              x="2"
              y="2"
              width={rectSize}
              height={rectSize}
              rx={rx}
              className="text-zinc-800/80"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="none"
            />
            {/* Active Bonding Curve Stroke */}
            <rect
              x="2"
              y="2"
              width={rectSize}
              height={rectSize}
              rx={rx}
              stroke={curveProgress === 100 ? '#10b981' : '#089981'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={perimeter}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          </svg>

          {/* Token Inner Icon Box */}
          <div className="w-9 h-9 rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center z-10">
            {token?.imagePreview || token?.image ? (
              <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
            ) : (
              <span className="text-xs font-black text-white tracking-wider">
                {token?.symbol ? token.symbol.slice(0, 2).toUpperCase() : 'AF'}
              </span>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-between truncate py-0.5">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="font-extrabold text-xs text-white truncate font-mono">
              {token?.symbol ? token.symbol.toUpperCase() : 'SOL'}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium truncate">
              {token?.name || token?.symbol || 'Loading...'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono mt-0.5">
            <span>{token?.timeAgo || token?.createdAgo || '1s'}</span>
            
            <a 
              href={token?.mintAddress ? `https://solscan.io/token/${token.mintAddress}` : '#'} 
              target="_blank" 
              rel="noreferrer" 
              title="Inspect CA on Solscan"
              className="hover:text-[#089981] transition-colors"
            >
              <svg className="w-3 h-3 text-zinc-400 hover:text-[#089981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>

            <span className="text-zinc-500 text-[10px]">👥 {token?.holders || 2}</span>

            <span className="text-zinc-300 font-semibold">
              TX {token?.txCount ?? token?.transactions ?? 1}
            </span>
          </div>

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

      {/* Right Side: Quick Buy & Stats */}
      <div className="flex flex-col items-end justify-between shrink-0 pl-2 self-stretch py-0.5">
        <button className="bg-[#1a2024]/90 hover:bg-[#222b31] active:scale-95 text-[#089981] font-mono font-bold text-[11px] px-2.5 py-1 rounded-md border border-white/5 hover:border-[#089981]/30 flex items-center space-x-1 transition-all shadow-sm">
          <span className="text-[#089981] text-[10px]">⚡</span>
          
          <svg viewBox="0 0 397 311" className="w-[9px] h-[9px] text-zinc-400" fill="currentColor">
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
          </svg>

          <span className="text-[#089981] font-bold text-[10px] font-mono">0.1</span>
        </button>

        <div className="text-right leading-tight mt-auto">
          <div className="text-[11px] font-bold text-[#089981]">
            MC {formatMcap(token?.mcap)}
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
    <div className="w-full h-full p-0 m-0 bg-[#0c0d10] flex flex-col overflow-hidden">
      
      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full h-full flex-1 min-h-0 px-2 pb-2 pt-0">
        
        {/* COLUMN 1: NEW */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">New</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {newTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!newTokens || newTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No new tokens</div>
            ) : (
              newTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="new" />)
            )}
          </div>
        </div>

        {/* COLUMN 2: MIGRATING */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">Migrating</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {migratingTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!migratingTokens || migratingTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No tokens migrating</div>
            ) : (
              migratingTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="migrating" />)
            )}
          </div>
        </div>

        {/* COLUMN 3: MIGRATED */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">Migrated</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {migratedTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!migratedTokens || migratedTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No migrated tokens</div>
            ) : (
              migratedTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="migrated" />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}