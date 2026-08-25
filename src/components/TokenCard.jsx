import React from 'react';

export function TokenCard({ token, onClick, columnType = 'new', onQuickBuy }) {
  const rawProgress = token?.progress ?? token?.bondingCurvePct ?? (columnType === 'migrated' ? 100 : 0);
  const curveProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));
  
  const top10Percent = Math.round(token?.top10 ?? token?.sniperPct ?? 0);
  const devPercent = Math.round(token?.devHold ?? token?.devPct ?? 0);
  const holderPercent = Math.round(token?.holderPct ?? 0);

  // Dynamic Color Thresholds
  const top10Color = top10Percent > 20 ? 'text-rose-500' : 'text-emerald-500';
  const devColor = devPercent > 5 ? 'text-rose-500' : 'text-emerald-500';
  const holderColor = holderPercent > 10 ? 'text-rose-500' : 'text-emerald-500';

  const formatMcap = (val) => {
    if (!val) return '$2.4K';
    const strVal = String(val).replace(/^\$+/, '');
    return `$${strVal}`;
  };

  // Squircle geometry math (56px scale)
  const rectSize = 52;
  const rx = 14; 
  const strokeWidth = 2.5;
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (curveProgress / 100) * perimeter;

  return (
    <div 
      onClick={() => onClick?.(token)}
      className="bg-[#121316] hover:bg-[#181a1f] p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer group shrink-0 w-full"
    >
      
      {/* Left Side: Avatar & Info */}
      <div className="flex items-center space-x-3 overflow-hidden">
        {/* Avatar Container */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform origin-center" viewBox="0 0 56 56">
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
              stroke="#089981"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={perimeter}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          </svg>

          <div className="w-11 h-11 rounded-xl bg-zinc-900 overflow-hidden flex items-center justify-center z-10 border border-white/5">
            {token?.imagePreview || token?.image ? (
              <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
            ) : (
              <span className="text-base font-black text-white tracking-wider">
                {token?.symbol ? token.symbol.slice(0, 2).toUpperCase() : 'AF'}
              </span>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs font-black text-white tracking-tight">{token?.symbol}</span>
            <span className="text-[11px] text-zinc-400 truncate">{token?.name}</span>
          </div>

          {/* Time, Search Icon, Holders Vector Icon, TX */}
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 font-mono">
            <span>{token?.timeAgo || '1s'}</span>
            
            <svg className="w-2.5 h-2.5 text-zinc-500 hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{token?.holders || 2}</span>
            </span>

            <span className="font-bold text-zinc-400">TX {token?.txCount || 1}</span>
          </div>

          {/* Inline Dynamic Detection Row */}
          <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono font-bold">
            {/* Top 10 */}
            <span className={`${top10Color} flex items-center gap-0.5`}>
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
              </svg>
              {top10Percent}%
            </span>

            {/* Dev Holding */}
            <span className={`${devColor} flex items-center gap-0.5`}>
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {devPercent}%
            </span>

            {/* Holder % */}
            <span className={`${holderColor} flex items-center gap-0.5`}>
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {holderPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Quick Buy & Market Cap with Price Change % */}
      <div className="flex flex-col items-end shrink-0 gap-1 font-mono">
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering card navigation
            onQuickBuy?.(token);
          }}
          className="flex items-center gap-1.5 bg-[#18191c] hover:bg-[#089981]/10 border border-zinc-800 hover:border-[#089981]/30 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-[#089981] transition-colors"
        >
          <span className="text-amber-400 text-xs">⚡</span>
          
          <svg className="w-3 h-3" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol_a)"/>
            <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol_b)"/>
            <path d="M332.1 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol_c)"/>
            <defs>
              <linearGradient id="sol_a" x1="360.9" y1="324" x2="145.4" y2="134.8" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3"/>
                <stop offset="1" stopColor="#DC1FFF"/>
              </linearGradient>
              <linearGradient id="sol_b" x1="360.9" y1="89.9" x2="145.4" y2="-99.3" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3"/>
                <stop offset="1" stopColor="#DC1FFF"/>
              </linearGradient>
              <linearGradient id="sol_c" x1="36.3" y1="102.7" x2="251.8" y2="291.9" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3"/>
                <stop offset="1" stopColor="#DC1FFF"/>
              </linearGradient>
            </defs>
          </svg>

          <span>{token?.buySol || '0.1'}</span>
        </button>

        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-[#089981]">MC {formatMcap(token?.mcap)}</span>
            
            <span className={`text-[10px] font-bold ${
              (token?.priceChange ?? token?.change24h ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {(token?.priceChange ?? token?.change24h ?? 0) >= 0 ? '+' : ''}
              {token?.priceChange ?? token?.change24h ?? '0'}%
            </span>
          </div>

          <span className="text-[9px] text-zinc-500 uppercase">VOL ${token?.volume || '0.09'}</span>
        </div>
      </div>
    </div>
  );
}

export default TokenCard;