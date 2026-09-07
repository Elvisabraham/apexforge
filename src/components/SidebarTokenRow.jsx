import React from 'react';

// Fake mini trendline (Sparkline) to make the row look data-rich
const Sparkline = ({ isPositive }) => (
  <svg 
    className={`w-10 h-5 mr-3 opacity-60 ${isPositive ? 'text-[#00f2a1]' : 'text-[#F23645]'}`} 
    viewBox="0 0 50 20" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {isPositive ? (
      <path d="M0,15 Q5,15 10,10 T20,12 T30,5 T40,8 T50,2" />
    ) : (
      <path d="M0,5 Q5,5 10,10 T20,8 T30,15 T40,12 T50,18" />
    )}
  </svg>
);

const SidebarTokenRow = ({ token, isActive, onSelect }) => {
  if (!token) return null;

  // Safely extract and format data just like your old code
  const changeVal = token.change24h || token.change || '0.00%';
  const changeNum = parseFloat(String(changeVal).replace('%', '')) || 0;
  const isPositive = token.isPositive !== undefined ? token.isPositive : changeNum >= 0;
  
  const displayMcap = token.mcap || token.marketCap || token.marketCapFormatted || '$0.00';
  const displayPrice = token.price?.includes('$') ? token.price : `$${token.price || '0.00'}`;

  return (
    <button
      onClick={() => onSelect && onSelect(token)}
      className={`w-full flex items-center justify-between p-3 border-b border-white/5 transition-all group relative cursor-pointer ${
        isActive 
          ? 'bg-[#1c1d24] border-l-[3px] border-l-[#00f2a1]' 
          : 'bg-transparent border-l-[3px] border-l-transparent hover:bg-white/5'
      }`}
    >
      {/* Left side: Avatar + Ticker + Mcap */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        
        {/* Avatar with hover glow effect */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 overflow-hidden transition-colors ${
          isActive 
            ? 'bg-[#00f2a1]/10 border border-[#00f2a1]/30 text-[#00f2a1]' 
            : 'bg-gradient-to-br from-zinc-800 to-[#121318] border border-white/10 text-white group-hover:border-[#00f2a1]/30'
        }`}>
          {token.logo || token.imagePreview ? (
            <img src={token.logo || token.imagePreview} alt={token.symbol} className="w-full h-full object-cover rounded-full" />
          ) : (
            token.icon || <span className="text-[10px]">{token.symbol?.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        {/* Ticker & Secondary Metric Stacking */}
        <div className="flex flex-col items-start min-w-0">
          <span className={`text-sm font-black truncate uppercase transition-colors ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
            {token.symbol}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono truncate">
            MCap: {displayMcap}
          </span>
        </div>
      </div>

      {/* Right side: Sparkline + Price + Change% */}
      <div className="flex items-center shrink-0 pl-2">
        <Sparkline isPositive={isPositive} />
        
        <div className="flex flex-col items-end min-w-[55px]">
          <span className="text-[12px] font-mono font-bold text-white tracking-tight text-right">
            {displayPrice}
          </span>
          <span className={`text-[10px] font-black font-mono text-right ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            {isPositive && !String(changeVal).startsWith('+') ? '+' : ''}{changeVal}
          </span>
        </div>
      </div>
    </button>
  );
};

export default SidebarTokenRow;