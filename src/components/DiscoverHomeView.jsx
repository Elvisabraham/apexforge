import React, { useState, useRef, useEffect } from 'react';

// Reusable Token Card matching high-density layout
const TokenCard = ({ token }) => (
  <div className="bg-[#121216] hover:bg-[#1a1a20] p-2.5 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm shrink-0">
    <div className="flex items-center space-x-2.5 overflow-hidden">
      <div className="relative w-11 h-11 rounded-xl bg-black border border-zinc-700/80 flex items-center justify-center overflow-hidden shrink-0">
        {token.imagePreview || token.image ? (
          <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
        ) : (
          <span className="text-xs font-black text-gray-300">{token.symbol ? token.symbol.slice(0, 2).toUpperCase() : 'AF'}</span>
        )}
      </div>

      <div className="flex flex-col truncate">
        <div className="flex items-center space-x-1 truncate">
          <span className="font-bold text-xs text-gray-100 truncate">{token.name || 'DOWNAPE'}</span>
          <span className="text-[10px] text-zinc-400 truncate">${token.symbol || 'DownApe'}</span>
        </div>
        
        <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 mt-0.5">
          <span className="text-zinc-300 font-medium">{token.timeAgo || '12s'}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-gray-300 font-medium">TX {token.txCount || 495}</span>
        </div>

        <div className="flex items-center space-x-2 mt-1 text-[9px] font-mono">
          <span className="text-rose-400 font-semibold">🎯 {token.progress1 || '76%'}</span>
          <span className="text-emerald-400 font-semibold">💧 {token.progress2 || '0%'}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-end shrink-0 pl-2">
      <div className="flex items-center space-x-1 bg-[#089981]/15 border border-[#089981]/30 hover:bg-[#089981]/25 px-2 py-0.5 rounded-md text-[#089981] font-bold text-[10px] transition-colors mb-1">
        <span>⚡ 0.1</span>
      </div>
      <div className="text-[11px] text-[#089981] font-bold">
        MC <span className="text-gray-100">{token.mcap || '$41.40'}</span>
      </div>
      <div className="text-[9px] text-zinc-400">
        VOL <span className="text-zinc-300">{token.vol || '$982.65'}</span>
      </div>
    </div>
  </div>
);

export default function DiscoverHomeView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  const [leftTab, setLeftTab] = useState('Total'); 
  const [subTab, setSubTab] = useState('Activities'); 
  const [launchesFilter, setLaunchesFilter] = useState('Migrated'); 
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
      <div className="bg-[#121318] border-x border-b border-zinc-800/80 rounded-b-xl rounded-t-none border-t-0 p-3.5 flex flex-col justify-between h-full overflow-hidden">
        <div>
          <div className="flex items-center space-x-4 border-b border-zinc-800/60 pb-2.5 mb-3 text-xs font-medium text-zinc-400">
            {['Total', 'Tokens'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`transition-colors ${leftTab === tab ? 'text-white border-b-2 border-purple-500 pb-1 font-bold' : 'hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <div className="text-[11px] text-zinc-400 font-medium">Balance</div>
            <div className="text-2xl font-black text-white mt-0.5">$0.00</div>
            <div className="text-[10px] text-zinc-500 mt-2">P&L</div>
            <div className="text-xs font-semibold text-white mt-0.5">$0.00</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 border-t border-zinc-800/60 pt-3 overflow-hidden">
          <div className="flex items-center space-x-4 text-xs font-medium text-zinc-400 mb-3 shrink-0">
            {['Positions', 'Activities', 'Follows'].map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`transition-colors ${subTab === st ? 'text-white border-b-2 border-purple-500 pb-1 font-semibold' : 'hover:text-white'}`}
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
      <div className="bg-[#121318] border-x border-b border-zinc-800/80 rounded-b-xl rounded-t-none border-t-0 p-3 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-2.5 border-b border-zinc-800/60 pb-2 shrink-0">
          <span className="font-bold text-xs text-white">Launches</span>
          <div className="relative" ref={launchesRef}>
            <button
              onClick={() => setLaunchesDropdownOpen(!launchesDropdownOpen)}
              className="flex items-center space-x-1 text-[11px] font-medium text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700/50"
            >
              <span>{launchesFilter}</span>
              <span className={`text-[9px] transition-transform ${launchesDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {launchesDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-[#1a1b20] border border-zinc-700/80 rounded-lg shadow-xl py-1 z-50">
                {['New', 'Migrating', 'Migrated'].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setLaunchesFilter(item); setLaunchesDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1 text-[11px] ${launchesFilter === item ? 'text-purple-400 bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-0.5">
          {displayedTokens.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-zinc-600">No active launches.</div>
          ) : (
            displayedTokens.map((t) => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} />)
          )}
        </div>
      </div>

      {/* Column 3: Tokens Leaderboard */}
      <div className="bg-[#121318] border-x border-b border-zinc-800/80 rounded-b-xl rounded-t-none border-t-0 p-3 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-2.5 border-b border-zinc-800/60 pb-2 shrink-0">
          <span className="font-bold text-xs text-white">Tokens</span>
          <div className="relative" ref={timeframeRef}>
            <button
              onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
              className="flex items-center space-x-1 text-[11px] text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700/50"
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
                    className={`w-full text-left px-3 py-1 text-[11px] ${timeframe === tf ? 'text-purple-400 bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 text-xs pr-0.5">
          <div className="flex justify-between text-[10px] text-zinc-500 px-1 py-1 font-medium border-b border-zinc-800/40">
            <span># TOKEN</span>
            <span>MARKET CAP</span>
          </div>
          {[
            { rank: 1, name: 'CYBERLEEK', mc: '$17.9M' },
            { rank: 2, name: 'STONK', mc: '$10.2M' },
            { rank: 3, name: 'CC', mc: '$5M' },
            { rank: 4, name: 'CATE', mc: '$44.8M' },
            { rank: 5, name: 'JUP', mc: '$715.7M' },
            { rank: 6, name: 'PENGU', mc: '$580.8M' },
            { rank: 7, name: 'PUMP', mc: '$2B' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500 text-[10px] w-3">{item.rank}</span>
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