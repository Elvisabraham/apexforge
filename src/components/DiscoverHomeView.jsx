import React, { useState, useRef, useEffect } from 'react';
import { TokenCard } from './TokenCard';

export default function DiscoverHomeView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  const [leftTab, setLeftTab] = useState('Total'); 
  const [subTab, setSubTab] = useState('Positions'); 
  const [launchesFilter, setLaunchesFilter] = useState('New'); 
  const [launchesDropdownOpen, setLaunchesDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('24h'); 
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);

  const launchesRef = useRef(null);
  const timeframeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (launchesRef.current && !launchesRef.current.contains(event.target)) setLaunchesDropdownOpen(false);
      if (timeframeRef.current && !timeframeRef.current.contains(event.target)) setTimeframeDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let displayedTokens = newTokens;
  if (launchesFilter === 'Migrating') displayedTokens = migratingTokens;
  if (launchesFilter === 'Migrated') displayedTokens = migratedTokens;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full h-full p-0 m-0 overflow-hidden text-white bg-[#050505]">
      
      {/* Column 1: Portfolio & Balance */}
      <div className="bg-[#121318] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between h-full overflow-hidden">
        <div>
          <div className="flex items-center space-x-4 border-b border-zinc-800/60 pb-3 mb-4 text-xs font-medium text-zinc-400">
            {['Total', 'Tokens'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`transition-colors ${leftTab === tab ? 'text-white border-b-2 border-[#089981] pb-1 font-bold' : 'hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <div className="text-[11px] text-zinc-400 font-medium tracking-wide">BALANCE</div>
            <div className="text-3xl font-black text-white mt-1">$0</div>
            <div className="text-[11px] text-zinc-500 mt-3 font-medium">P&L <span className="text-white">$0</span></div>
          </div>
        </div>

        <div className="flex flex-col flex-1 border-t border-zinc-800/60 pt-3 overflow-hidden">
          <div className="flex items-center space-x-4 text-xs font-medium text-zinc-400 mb-3 shrink-0">
            {['Positions', 'Activities', 'Follows'].map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`transition-colors ${subTab === st ? 'text-white border-b-2 border-[#089981] pb-1 font-bold' : 'hover:text-white'}`}
              >
                {st}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center text-xs text-zinc-600 text-center">
            No {subTab.toLowerCase()} recorded.
          </div>
        </div>
      </div>

      {/* Column 2: Launches Feed */}
      <div className="bg-[#121318] border border-zinc-800/80 rounded-xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2.5 shrink-0">
          <span className="font-bold text-xs text-white uppercase tracking-wider">Launches</span>
          
          <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800/80 text-[11px]">
            {['New', 'Migrating', 'Migrated'].map((filter) => (
              <button
                key={filter}
                onClick={() => setLaunchesFilter(filter)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${launchesFilter === filter ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

<div className="space-y-2.5 overflow-y-auto custom-scrollbar flex-1 pr-0.5">
  {displayedTokens.length === 0 ? (
    <div className="flex items-center justify-center h-32 text-xs text-zinc-600">No active launches.</div>
  ) : (
    displayedTokens.map((t) => (
      <TokenCard 
        key={t.id || t.mintAddress || Math.random()} 
        token={t} 
        columnType={launchesFilter.toLowerCase()} 
      />
    ))
  )}
</div>
</div>

      {/* Column 3: Top Tokens Leaderboard */}
      <div className="bg-[#121318] border border-zinc-800/80 rounded-xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2.5 shrink-0">
          <span className="font-bold text-xs text-white uppercase tracking-wider">Tokens</span>
          <div className="relative" ref={timeframeRef}>
            <button
              onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
              className="flex items-center space-x-1 text-[11px] text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700/50"
            >
              <span>{timeframe}</span>
              <span className={`text-[9px] transition-transform ${timeframeDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {timeframeDropdownOpen && (
              <div className="absolute right-0 mt-1 w-20 bg-[#1a1b20] border border-zinc-700/80 rounded-lg shadow-xl py-1 z-50">
                {['1h', '24h', '7d'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => { setTimeframe(tf); setTimeframeDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1 text-[11px] ${timeframe === tf ? 'text-[#089981] bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 text-xs pr-0.5">
          <div className="flex justify-between text-[10px] text-zinc-500 px-2 py-1.5 font-medium border-b border-zinc-800/40 uppercase tracking-wider">
            <span># TOKEN</span>
            <span>MARKET CAP</span>
          </div>
          {[
            { rank: 1, name: 'ANSEM', mc: '$272.5M' },
            { rank: 2, name: 'EYE', mc: '$5M' },
            { rank: 3, name: 'Z500', mc: '$876.7K' },
            { rank: 4, name: 'BULLSHIT', mc: '$1.1M' },
            { rank: 5, name: 'CATE', mc: '$13.1M' },
            { rank: 6, name: 'JIMOTHY', mc: '$6.6M' },
            { rank: 7, name: 'LAYOOO', mc: '$2.4M' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <span className="text-zinc-500 text-[11px] w-3 font-mono">{item.rank}</span>
                <span className="font-semibold text-white text-xs">{item.name}</span>
              </div>
              <span className="text-emerald-400 font-medium text-xs">{item.mc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}