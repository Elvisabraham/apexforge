import React from 'react';
import { Search, Globe, Users, Activity, TrendingUp, MoreHorizontal } from 'lucide-react';

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const SolanaIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M64.6 237.9c2.4-2.4-5.7-3.8-9.1-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.1 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol_grad_a)"/>
    <path d="M64.6 3.8C67 1.4 70.3 0 73.7 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.1 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol_grad_b)"/>
    <path d="M332.5 120.9c-2.4-2.4-5.7-3.8-9.1-3.8H5.9c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.1 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.6-62.7z" fill="url(#sol_grad_c)"/>
    <defs>
      <linearGradient id="sol_grad_a" x1="363.8" y1="311.7" x2="33.4" y2="234.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="sol_grad_b" x1="363.8" y1="77.6" x2="33.4" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="sol_grad_c" x1="33.4" y1="194.7" x2="363.8" y2="117.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export function TokenCard({ token = {}, onClick, onQuickBuy, isActive = false }) {
  const ticker = (token.symbol || 'YAYA').replace('$', '').toUpperCase();
  const name = (token.name || token.handle || 'yayayaya').replace('$', '');
  const progressVal = token.progress !== undefined ? parseInt(token.progress, 10) : parseInt(token.bondingCurvePct || '82', 10);

  const rectSize = 58;
  const rx = 16;
  const strokeWidth = 2.5; 
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (progressVal / 100) * perimeter;

  return (
    <div 
      onClick={() => onClick && onClick(token)}
      className="py-3.5 bg-black hover:bg-[#0c0d12] transition-colors cursor-pointer flex items-center justify-between gap-3 w-full border-b border-[#1c1d22] select-none"
    >
      <div className="relative shrink-0 w-[62px] h-[62px] flex items-center justify-center p-0.5">
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 64 64">
          <rect x="3" y="3" width={rectSize} height={rectSize} rx={rx} className="stroke-[#1c1d22]" strokeWidth={strokeWidth} fill="none" />
          <rect
            x="3"
            y="3"
            width={rectSize}
            height={rectSize}
            rx={rx}
            stroke="#00FFA3"
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
          />
        </svg>

        <div className="w-[52px] h-[52px] rounded-[13px] bg-gradient-to-br from-[#121318] to-[#1a1c23] flex items-center justify-center font-black text-white text-[14px] shadow-inner overflow-hidden z-10 border border-white/5">
          {token.image || token.imagePreview ? (
            <img src={token.image || token.imagePreview} alt={ticker} className="w-full h-full object-cover" />
          ) : (
            <span>{token.icon || ticker.slice(0, 2)}</span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <h4 className="text-xs font-black text-white truncate leading-none">
            {ticker}
          </h4>
          <span className="text-[11px] text-[#089981] font-mono font-bold truncate leading-none">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <div className="flex items-center gap-1">
            <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
              <Search className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-neutral-500 font-mono font-bold leading-none">
              {token.time || token.timeAgo || '1s'}
            </span>
          </div>

          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <XIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <TelegramIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono pt-0.5">
          <span className="flex items-center gap-1 text-neutral-300">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{token.holders || 14}</span>
          </span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{token.txCount || '42'} TX</span>
          </span>
          <span className="flex items-center gap-1 text-[#00FFA3] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progressVal}%</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-1">
        <div className="text-right font-mono">
          <p className="text-xs font-bold">
            <span className="text-[10px] text-neutral-500 mr-1 uppercase">MC</span>
            {/* FIXED: Changed MC color from #00FFA3 to white */}
            <span className="text-white">{token.mc || token.marketCap || '$18.4K'}</span>
          </p>
          <p className="text-[10px] text-neutral-500 uppercase">
            <span className="mr-1">VOL</span>
            <span className="text-neutral-300">{token.vol || token.volume || '$12.4K'}</span>
          </p>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickBuy && onQuickBuy(token);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
            isActive 
              ? 'bg-[#089981] text-black border-[#089981] scale-95 shadow-md shadow-[#089981]/20' 
              : 'bg-[#089981]/10 hover:bg-[#089981]/20 border-[#089981]/40 active:scale-95'
          }`}
        >
          <SolanaIcon className="w-3.5 h-3.5" />
          <span className="text-[#089981]">{token.sol || token.buySol || '0.1'}</span>
        </button>
      </div>
    </div>
  );
}

export default function LaunchesView({ 
  newTokens = [], 
  migratingTokens = [], 
  migratedTokens = [], 
  onTokenClick, 
  onQuickBuy 
}) {
  
  // FIXED: Standardized all SOL amounts to 0.1
  const defaultNew = [
    { id: 1, symbol: 'FRESH', name: 'fresh token', mc: '$5.2K', vol: '$1.1K', sol: '0.1', progress: 2, holders: 4, txCount: 12, time: '2s' },
    { id: 2, symbol: 'BABY', name: 'baby coin', mc: '$6.8K', vol: '$2.4K', sol: '0.1', progress: 8, holders: 9, txCount: 28, time: '14s' },
    { id: 3, symbol: 'NEWBIE', name: 'newbie', mc: '$8.1K', vol: '$3.5K', sol: '0.1', progress: 15, holders: 14, txCount: 45, time: '45s' },
    { id: 4, symbol: 'START', name: 'starting up', mc: '$10.5K', vol: '$5.2K', sol: '0.1', progress: 22, holders: 21, txCount: 60, time: '1m' },
    { id: 12, symbol: 'ALPHA', name: 'alpha test', mc: '$11.1K', vol: '$6.2K', sol: '0.1', progress: 25, holders: 28, txCount: 82, time: '2m' }
  ];

  const defaultMigrating = [
    { id: 5, symbol: 'YAYA', name: 'yayayaya', mc: '$45.4K', vol: '$32.4K', sol: '0.1', progress: 82, holders: 64, txCount: 242, time: '5m' },
    { id: 6, symbol: 'HHHH', name: 'hduhx', mc: '$51.2K', vol: '$38.9K', sol: '0.1', progress: 88, holders: 78, txCount: 310, time: '8m' },
    { id: 7, symbol: 'KMDFKEML', name: 'jefl,lg', mc: '$58.7K', vol: '$45.1K', sol: '0.1', progress: 94, holders: 92, txCount: 405, time: '12m' },
    { id: 8, symbol: 'JUHSJUOADS', name: 'kzmxszl', mc: '$62.1K', vol: '$50.2K', sol: '0.1', progress: 98, holders: 115, txCount: 520, time: '15m' },
    { id: 9, symbol: 'UJHIOIRJD', name: 'jxvoifkdk', mc: '$63.8K', vol: '$55.4K', sol: '0.1', progress: 99, holders: 128, txCount: 612, time: '18m' }
  ];

  const defaultMigrated = [
    { id: 10, symbol: 'JAKMC', name: 'kdvl', mc: '$69.0K', vol: '$80.4K', sol: '0.1', progress: 100, holders: 150, txCount: 842, time: '1h' },
    { id: 11, symbol: 'SENDIT', name: 'send it', mc: '$120.5K', vol: '$150.2K', sol: '0.1', progress: 100, holders: 340, txCount: 1520, time: '2h' }
  ];

  const col1 = newTokens.length ? newTokens : defaultNew;
  const col2 = migratingTokens.length ? migratingTokens : defaultMigrating;
  const col3 = migratedTokens.length ? migratedTokens : defaultMigrated;

  return (
    <div className="w-[calc(100%+3rem)] h-[calc(100%+3rem)] -m-6 bg-black flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full flex-1 min-h-0 divide-y md:divide-y-0 md:divide-x divide-[#1c1d22]">
        
        {/* COLUMN 1: NEW */}
        <div className="flex flex-col h-full bg-black overflow-hidden min-h-0">
          <div className="bg-black pl-8 pr-4 pt-6 shrink-0">
            <div className="flex justify-between items-center pb-3 border-b border-[#1c1d22]">
              <h3 className="font-bold text-sm text-white tracking-wide">New</h3>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black pl-8 pr-4 pb-8">
            {col1.map((token, idx) => (
              <TokenCard 
                key={token.id || idx} 
                token={token} 
                onClick={onTokenClick} 
                onQuickBuy={onQuickBuy} 
              />
            ))}
          </div>
        </div>

        {/* COLUMN 2: MIGRATING */}
        <div className="flex flex-col h-full bg-black overflow-hidden min-h-0">
          <div className="bg-black px-4 pt-6 shrink-0">
            <div className="flex justify-between items-center pb-3 border-b border-[#1c1d22]">
              <h3 className="font-bold text-sm text-white tracking-wide">Migrating</h3>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black px-4 pb-8">
            {col2.length > 0 ? (
              col2.map((token, idx) => (
                <TokenCard 
                  key={token.id || idx} 
                  token={token} 
                  onClick={onTokenClick} 
                  onQuickBuy={onQuickBuy} 
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-[#4a4d57] text-xs font-medium">
                No tokens migrating
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: MIGRATED */}
        <div className="flex flex-col h-full bg-black overflow-hidden min-h-0">
          <div className="bg-black pl-4 pr-8 pt-6 shrink-0">
            <div className="flex justify-between items-center pb-3 border-b border-[#1c1d22]">
              <h3 className="font-bold text-sm text-white tracking-wide">Migrated</h3>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black pl-4 pr-8 pb-8">
            {col3.map((token, idx) => (
              <TokenCard 
                key={token.id || idx} 
                token={token} 
                onClick={onTokenClick} 
                onQuickBuy={onQuickBuy} 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}