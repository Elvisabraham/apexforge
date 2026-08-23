import React, { useState, useRef, useEffect } from 'react';

// Reusable Token Card styled to match Phantom's data density
const TokenCard = ({ token }) => (
  <div className="bg-[#121216] hover:bg-[#1a1a20] p-3 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm animate-slide-up shrink-0">
    
    {/* Left Side: Avatar & Details */}
    <div className="flex items-start space-x-3 overflow-hidden">
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black border border-zinc-700/80 flex items-center justify-center overflow-hidden shrink-0">
        {token.imagePreview || token.image ? (
          <img src={token.imagePreview || token.image} className="w-full h-full object-cover" alt="icon" />
        ) : (
          <span className="text-sm font-black text-gray-300">{token.symbol ? token.symbol.slice(0, 2).toUpperCase() : 'AF'}</span>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#089981] flex items-center justify-center border-2 border-[#121216]">
          <span className="text-[9px] text-black font-bold">✓</span>
        </div>
      </div>

      <div className="flex flex-col truncate">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="font-bold text-sm text-gray-100 truncate">{token.name || 'DOWNAPE'}</span>
          <span className="text-[11px] text-zinc-400 truncate">{token.symbol || 'DownApe'}</span>
          <span className="text-zinc-600">📋</span>
        </div>
        
        <div className="flex items-center space-x-2 mt-1 text-[11px] text-zinc-400">
          <span className="text-zinc-300 font-medium">{token.timeAgo || '1s'}</span>
          <span className="text-zinc-600">🔍</span>
          <span className="text-zinc-600">🌐</span>
          <span className="text-zinc-600">💬</span>
          <span className="text-zinc-500">·</span>
          <span className="text-gray-300 font-medium">TX {token.txCount || 6}</span>
        </div>

        <div className="flex items-center space-x-3 mt-1.5 text-[10px] font-mono">
          <span className="text-[#089981] flex items-center space-x-0.5">
            <span>🟢</span>
            <span>{token.progress1 || '50%'}</span>
          </span>
          <span className="text-zinc-500 flex items-center space-x-0.5">
            <span>🟢</span>
            <span>{token.progress2 || '0%'}</span>
          </span>
          <span className="text-amber-500 flex items-center space-x-0.5">
            <span>🔸</span>
            <span>{token.progress3 || '50%'}</span>
          </span>
        </div>
      </div>
    </div>

    {/* Right Column: Quick Buy Button, Market Cap & Volume */}
    <div className="flex flex-col items-end shrink-0 pl-3">
      <div className="flex items-center space-x-1 bg-[#089981]/15 border border-[#089981]/30 hover:bg-[#089981]/25 px-2.5 py-1 rounded-lg text-[#089981] font-semibold text-xs transition-colors mb-1">
        <span>⚡</span>
        <span>0.1</span>
      </div>
      
      <div className="text-xs text-[#089981] font-bold mt-0.5">
        MC <span className="text-gray-100">{token.mcap || '$4.4K'}</span>
      </div>

      <div className="text-[10px] text-zinc-400 mt-0.5">
        VOL <span className="text-zinc-300">{token.vol || '$6.62'}</span>
      </div>
    </div>
  </div>
);

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
      if (launchesRef.current && !launchesRef.current.contains(event.target)) {
        setLaunchesDropdownOpen(false);
      }
      if (timeframeRef.current && !timeframeRef.current.contains(event.target)) {
        setTimeframeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let displayedTokens = newTokens;
  if (launchesFilter === 'Migrating') displayedTokens = migratingTokens;
  if (launchesFilter === 'Migrated') displayedTokens = migratedTokens;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full h-full p-0 m-0 overflow-hidden text-white bg-[#050505]">
      
      {/* Column 1: Portfolio & Balance Card */}
      <div className="bg-[#141417] border-x border-b border-zinc-800/90 rounded-b-2xl rounded-t-none border-t-0 p-4 flex flex-col justify-between h-full shadow-lg overflow-hidden">
        <div>
          <div className="flex items-center space-x-4 border-b border-zinc-800/70 pb-3 mb-4 text-xs font-medium text-zinc-400">
            {['Total', 'Tokens', 'Perps'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`transition-colors ${leftTab === tab ? 'text-white border-b-2 border-purple-500 pb-1 font-semibold' : 'hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <div className="text-xs text-zinc-400 font-medium">Balance</div>
            <div className="text-2xl font-bold text-white mt-1">$0</div>
            <div className="text-xs text-zinc-400 mt-3">P&L</div>
            <div className="text-sm font-semibold text-white mt-0.5">$0</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 border-t border-zinc-800/70 pt-4 overflow-hidden">
          <div className="flex items-center space-x-4 text-xs font-medium text-zinc-400 mb-4 shrink-0">
            {['Positions', 'Activities', 'Follows'].map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`transition-colors ${subTab === st ? 'text-white border-b-2 border-purple-500 pb-1' : 'hover:text-white'}`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 text-center">
            No {subTab.toLowerCase()} yet.
          </div>
        </div>
      </div>

      {/* Column 2: Launches Feed with Phantom Dropdown & Full Token Cards */}
      <div className="bg-[#141417] border-x border-b border-zinc-800/90 rounded-b-2xl rounded-t-none border-t-0 p-4 flex flex-col h-full shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/70 pb-3 shrink-0">
          <div className="relative" ref={launchesRef}>
            <button
              onClick={() => setLaunchesDropdownOpen(!launchesDropdownOpen)}
              className="flex items-center space-x-1.5 font-bold text-sm text-gray-200 hover:text-white transition-colors focus:outline-none bg-zinc-800/60 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700/50"
            >
              <span>{launchesFilter}</span>
              <span className={`text-[10px] transition-transform duration-200 ${launchesDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {launchesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-36 bg-[#1e1e24] border border-zinc-700/80 rounded-xl shadow-2xl py-1.5 z-50">
                {['New', 'Migrating', 'Migrated'].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setLaunchesFilter(item); setLaunchesDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${launchesFilter === item ? 'text-purple-400 bg-zinc-800/80' : 'text-gray-300 hover:bg-zinc-800/40 hover:text-white'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs bg-zinc-800/80 text-zinc-400 px-2.5 py-0.5 rounded-full font-medium">{displayedTokens.length}</span>
        </div>

        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
          {displayedTokens.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No tokens found.</div>
          ) : (
            displayedTokens.map((t) => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} />)
          )}
        </div>
      </div>

      {/* Column 3: Tokens Table with Timeframe Dropdown */}
      <div className="bg-[#141417] border-x border-b border-zinc-800/90 rounded-b-2xl rounded-t-none border-t-0 p-4 flex flex-col h-full shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/70 pb-3 shrink-0">
          <span className="font-bold text-sm text-gray-200">Tokens</span>
          
          <div className="relative" ref={timeframeRef}>
            <button
              onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
              className="flex items-center space-x-1 text-xs text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/50 transition-colors focus:outline-none"
            >
              <span>{timeframe}</span>
              <span className={`text-[10px] transition-transform duration-200 ${timeframeDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {timeframeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-[#1e1e24] border border-zinc-700/80 rounded-xl shadow-2xl py-1.5 z-50">
                {['1h', '24h', '7d'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => { setTimeframe(tf); setTimeframeDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${timeframe === tf ? 'text-purple-400 bg-zinc-800/80' : 'text-gray-300 hover:bg-zinc-800/40 hover:text-white'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1 text-xs pr-1">
          <div className="flex justify-between text-zinc-500 px-2 py-1 font-medium border-b border-zinc-800/50">
            <span># Token</span>
            <span>Market Cap</span>
          </div>
          {[
            { rank: 1, name: 'ANSEM', mc: '$272.5M' },
            { rank: 2, name: 'EYE', mc: '$5M' },
            { rank: 3, name: 'Z500', mc: '$876.7K' },
            { rank: 4, name: 'BULLSHIT', mc: '$1.1M' },
            { rank: 5, name: 'CATE', mc: '$13.1M' },
            { rank: 6, name: 'Jimothy', mc: '$6.7M' },
            { rank: 7, name: 'LAYOOO', mc: '$2.6M' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-zinc-500 w-3">{item.rank}</span>
                <span className="font-semibold text-white">{item.name}</span>
              </div>
              <span className="text-emerald-400 font-medium">{item.mc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 4: Perps Table */}
      <div className="bg-[#141417] border-x border-b border-zinc-800/90 rounded-b-2xl rounded-t-none border-t-0 p-4 flex flex-col h-full shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/70 pb-3 shrink-0">
          <span className="font-bold text-sm text-gray-200">Perps</span>
        </div>
        <div className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1 text-xs pr-1">
          <div className="flex justify-between text-zinc-500 px-2 py-1 font-medium border-b border-zinc-800/50">
            <span># Symbol</span>
            <span>Price</span>
          </div>
          {[
            { rank: 1, symbol: 'BTC', leverage: '40x', price: '$64,354.00' },
            { rank: 2, symbol: 'SNDK', leverage: '10x', price: '$1,810.40' },
            { rank: 3, symbol: 'ETH', leverage: '25x', price: '$1,909.60' },
            { rank: 4, symbol: 'SKHX', leverage: '10x', price: '$1,208.60' },
            { rank: 5, symbol: 'SPCX', leverage: '20x', price: '$145.90' },
            { rank: 6, symbol: 'HYPE', leverage: '10x', price: '$59.35' },
          ].map((perp) => (
            <div key={perp.rank} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500 w-3">{perp.rank}</span>
                <span className="font-semibold text-white">{perp.symbol}</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{perp.leverage}</span>
              </div>
              <span className="text-emerald-400 font-medium">{perp.price}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}