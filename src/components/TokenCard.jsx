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

// Authentic Official Solana Gradient SVG Logo
const SolanaIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.1-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.1 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol_grad_a)"/>
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
  const progressVal = parseInt(token.progress || token.bondingCurvePct || '82', 10);

  // Enlarged Avatar & Tight Squircle Math
  const rectSize = 58;
  const rx = 16;
  const strokeWidth = 2.5; // Thin but crisp line
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (progressVal / 100) * perimeter;

  return (
    <div 
      onClick={() => onClick && onClick(token)}
      className="p-3 bg-black hover:bg-[#0c0d12] transition-colors cursor-pointer flex items-center justify-between gap-3 w-full border-b border-[#1c1d22] select-none"
    >
      {/* 1. ENLARGED SQUIRCLE AVATAR */}
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

        {/* Scaled-up avatar strictly hugging the curve */}
        <div className="w-[52px] h-[52px] rounded-[13px] bg-gradient-to-br from-[#121318] to-[#1a1c23] flex items-center justify-center font-black text-white text-[14px] shadow-inner overflow-hidden z-10 border border-white/5">
          {token.image || token.imagePreview ? (
            <img src={token.image || token.imagePreview} alt={ticker} className="w-full h-full object-cover" />
          ) : (
            <span>{token.icon || ticker.slice(0, 2)}</span>
          )}
        </div>
      </div>

      {/* 2. MIDDLE DETAILS */}
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

      {/* 3. RIGHT MARKET CAP & MUTED BUY BUTTON */}
      <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-1">
        <div className="text-right font-mono">
          <p className="text-xs font-bold text-[#00FFA3]">{token.mc || token.marketCap || '$18.4K'}</p>
          <p className="text-[10px] text-neutral-500 uppercase">VOL {token.vol || token.volume || '$12.4K'}</p>
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

// --- 3 COLUMN VIEW WITH DEMARCATION LINES ---
export default function LaunchesView({ 
  newTokens = [], 
  migratingTokens = [], 
  migratedTokens = [], 
  onTokenClick, 
  onQuickBuy 
}) {
  const defaultNew = [
    { id: 1, symbol: 'YAYA', name: 'yayayaya', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 24, holders: 14, txCount: 42, time: '1s' },
    { id: 2, symbol: 'HHHH', name: 'hduhx', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 32, holders: 18, txCount: 65, time: '4s' },
    { id: 3, symbol: 'KMDFKEML', name: 'jefl,lg', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 41, holders: 29, txCount: 88, time: '12s' },
    { id: 4, symbol: 'JUHSJUOADS', name: 'kzmxszl', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 48, holders: 34, txCount: 94, time: '18s' },
    { id: 5, symbol: 'UJHIOIRJD', name: 'jxvoifkdk', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 52, holders: 42, txCount: 112, time: '25s' }
  ];

  const defaultMigrating = [
    { id: 6, symbol: 'WORM', name: 'The Mindshare Worm', mc: '$1.0M', vol: '$2.3K', sol: '0.1', progress: 98, holders: 83, txCount: 115, time: '6m' },
    { id: 7, symbol: 'SAPLING', name: 'Sapling Coin', mc: '$27.5K', vol: '$12.0K', sol: '0.1', progress: 92, holders: 27, txCount: 396, time: '2m' }
  ];

  const defaultMigrated = [
    { id: 11, symbol: 'SDUDE', name: 'SOLDUDE', mc: '$50.68', vol: '$2.4K', sol: '0.1', progress: 100, holders: 7, txCount: 510, time: '23s' },
    { id: 14, symbol: 'JAKMC', name: 'kdvl', mc: '$18.4K', vol: '$12.4K', sol: '0.1', progress: 100, holders: 14, txCount: 42, time: '1s' }
  ];

  const col1 = newTokens.length ? newTokens : defaultNew;
  const col2 = migratingTokens.length ? migratingTokens : [];
  const col3 = migratedTokens.length ? migratedTokens : defaultMigrated;

  return (
    <div className="w-full h-full bg-black p-4 flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full bg-black border border-[#1c1d22] rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#1c1d22]">
        
        {/* COLUMN 1: NEW */}
        <div className="flex flex-col h-full bg-black overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-black border-b border-[#1c1d22] shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">New</h3>
              <span className="bg-[#121318] border border-[#1c1d22] text-neutral-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                {col1.length}
              </span>
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
            {col1.map((token, idx) => (
              <TokenCard key={token.id || idx} token={token} onClick={onTokenClick} onQuickBuy={onQuickBuy} />
            ))}
          </div>
        </div>

        {/* COLUMN 2: MIGRATING */}
        <div className="flex flex-col h-full bg-black overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-black border-b border-[#1c1d22] shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Migrating</h3>
              <span className="bg-[#121318] border border-[#1c1d22] text-neutral-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                {col2.length}
              </span>
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black flex items-center justify-center p-4">
            {col2.length > 0 ? (
              col2.map((token, idx) => (
                <TokenCard key={token.id || idx} token={token} onClick={onTokenClick} onQuickBuy={onQuickBuy} />
              ))
            ) : (
              <div className="text-neutral-600 text-xs font-medium">No tokens migrating</div>
            )}
          </div>
        </div>

        {/* COLUMN 3: MIGRATED */}
        <div className="flex flex-col h-full bg-black overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-black border-b border-[#1c1d22] shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Migrated</h3>
              <span className="bg-[#121318] border border-[#1c1d22] text-neutral-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                {col3.length}
              </span>
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
            {col3.map((token, idx) => (
              <TokenCard key={token.id || idx} token={token} onClick={onTokenClick} onQuickBuy={onQuickBuy} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}