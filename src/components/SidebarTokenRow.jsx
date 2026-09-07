import React from 'react';

// Tiny fake sparkline to make it look incredibly pro
const Sparkline = ({ isPositive }) => (
  <svg 
    className={`w-12 h-6 mr-3 opacity-60 ${isPositive !== false ? 'text-[#00f2a1]' : 'text-[#F23645]'}`} 
    viewBox="0 0 50 20" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {isPositive !== false ? (
      <path d="M0,15 Q5,15 10,10 T20,12 T30,5 T40,8 T50,2" />
    ) : (
      <path d="M0,5 Q5,5 10,10 T20,8 T30,15 T40,12 T50,18" />
    )}
  </svg>
);

export default function SidebarTokenRow({ token, isActive, onSelect }) {
  const isPositive = token.isPositive !== false; // Default to true if undefined

  return (
    <button
      onClick={() => onSelect(token)}
      className={`w-full flex items-center justify-between p-3 border-b border-white/5 transition-all group relative ${
        isActive 
          ? 'bg-[#1c1d24] border-l-[3px] border-l-[#00f2a1]' 
          : 'bg-transparent border-l-[3px] border-l-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar with hover glow */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
          isActive 
            ? 'bg-[#00f2a1]/10 border border-[#00f2a1]/30 text-[#00f2a1]' 
            : 'bg-gradient-to-br from-zinc-800 to-[#121318] border border-white/10 text-white group-hover:border-[#00f2a1]/30'
        }`}>
          {token.imagePreview ? (
            <img src={token.imagePreview} alt={token.symbol} className="w-full h-full object-cover rounded-full" />
          ) : (
            token.icon || token.symbol.substring(0, 2).toUpperCase()
          )}
        </div>

        {/* Ticker & Sub-metric */}
        <div className="flex flex-col items-start min-w-0">
          <span className={`text-sm font-black truncate transition-colors ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
            {token.symbol}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono truncate">
            Vol: {token.vol24h || '1.2M'}
          </span>
        </div>
      </div>

      {/* Sparkline & Price Block */}
      <div className="flex items-center shrink-0 pl-2">
        <Sparkline isPositive={isPositive} />
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-mono font-bold text-white tracking-tight">
            {token.price?.includes('$') ? token.price : `$${token.price || '0.00'}`}
          </span>
          <span className={`text-[10px] font-black font-mono ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            {token.change24h || '+0.00%'}
          </span>
        </div>
      </div>
    </button>
  );
}