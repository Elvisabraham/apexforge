import React from 'react';

const SidebarTokenRow = ({ token, isActive, onSelect }) => {
  if (!token) return null;

  const changeVal = token.change24h || token.change || '0%';
  const changeNum = parseFloat(String(changeVal).replace('%', '')) || 0;
  const isPositive = token.isPositive !== undefined ? token.isPositive : changeNum >= 0;
  const displayMcap = token.mcap || token.marketCap || token.marketCapFormatted || '$0.00';

  return (
    <div 
      onClick={() => onSelect && onSelect(token)}
      className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-all ${
        isActive ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      {/* Left side: Avatar + Symbol */}
      <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
        <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
          {token.logo || token.imagePreview ? (
            <img src={token.logo || token.imagePreview} alt={token.symbol} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-black text-white">{token.symbol?.slice(0, 2)}</span>
          )}
        </div>
        <span className="text-xs font-bold text-white uppercase truncate">{token.symbol}</span>
      </div>
      
      {/* Right side: MCap & % Change aligned */}
      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
        <span className="text-zinc-100 font-bold text-right min-w-[50px]">
          {displayMcap}
        </span>
        <span className={`font-bold text-right min-w-[48px] ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
          {isPositive && !String(changeVal).startsWith('+') ? '+' : ''}{changeVal}
        </span>
      </div>
    </div>
  );
};

export default SidebarTokenRow;