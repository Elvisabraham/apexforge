import React from 'react';

const VolumeRatioBar = ({ buysCount = 0, buysVol = 0, sellsCount = 0, sellsVol = 0 }) => {
  const totalVol = buysVol + sellsVol || 1;
  const buyPct = Math.min(Math.max((buysVol / totalVol) * 100, 0), 100);

  const formatVol = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-1.5 p-3 bg-[#0A0A0B] border border-white/10 rounded-xl mb-4">
      <div className="flex justify-between text-[11px] font-bold font-mono">
        <span className="text-[#089981]">{buysCount} • {formatVol(buysVol)}</span>
        <span className="text-[#F23645]">{sellsCount} • {formatVol(sellsVol)}</span>
      </div>
      <div className="h-1.5 w-full bg-[#F23645] rounded-full overflow-hidden flex">
        <div 
          style={{ width: `${buyPct}%` }} 
          className="h-full bg-[#089981] transition-all duration-300" 
        />
      </div>
    </div>
  );
};

export default VolumeRatioBar;