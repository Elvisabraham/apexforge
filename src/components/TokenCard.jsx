import React from 'react';

export const TokenCard = ({ token, columnType = 'new' }) => {
  const rawProgress = token?.progress ?? token?.bondingCurvePct ?? (columnType === 'migrated' ? 100 : 0);
  const curveProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));
  
  const top10Percent = Math.round(token?.top10 ?? 0);
  const devPercent = Math.round(token?.devHold ?? 0);

  // Strip extra '$' signs so strings like "$10.0K" don't become "$$10.0K"
  const formatMcap = (val) => {
    if (!val) return '$2.4K';
    const cleanVal = String(val).replace(/^\$+/, '');
    return `$${cleanVal}`;
  };

  // Squircle Path Metrics
  const rectSize = 44;
  const rx = 12; 
  const strokeWidth = 2.5;
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (curveProgress / 100) * perimeter;

  return (
    <div className="bg-[#121316] hover:bg-[#181a1f] p-2 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer group shrink-0 w-full">
      
      {/* Left Side: Avatar & Token Metadata */}
      <div className="flex items-center space-x-2.5 overflow-hidden">
        
        {/* Squircle Avatar */}
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
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

          <div className="w-8 h-8 rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center z-10">
            {token?.imagePreview || token?.image ? (
              <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
            ) : (
              <span className="text-[11px] font-black text-white tracking-wider">
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
              className="hover:text-[#089981] transition-colors"
            >
              <svg className="w-3 h-3 text-zinc-400 hover:text-[#089981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>

            <span className="text-zinc-500 text-[10px]">👥 {token?.holders || 2}</span>
            <span className="text-zinc-300 font-semibold">TX {token?.txCount ?? token?.transactions ?? 1}</span>
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
        <button className="bg-[#1a2024]/90 hover:bg-[#222b31] active:scale-95 text-[#089981] font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-white/5 hover:border-[#089981]/30 flex items-center space-x-1 transition-all shadow-sm">
          <span className="text-[#089981] text-[10px]">⚡</span>
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