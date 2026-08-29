import React, { useState } from 'react';
import SidebarTokenRow from './SidebarTokenRow';
import { formatPhantomPrice } from '../utils/formatters';
import TokenChat from './TokenChat';
import TrackView from './TrackView';
import SwapModal from './SwapModal';

export default function TokenHome({
  setActivePage,
  handleSidebarNavigation,
  setActiveRoute,
  selectedTokenData,
  setSelectedTokenData,
  globalTokens = [],
  userSolBalance = 0,
  formatWithCommas = (val) => val,
  calculateTokenYield = () => '0',
  handleExecuteTrade = () => {}
}) {
  const [leftTab, setLeftTab] = useState('Tokens');
  const [rightPanelMode, setRightPanelMode] = useState('swap'); // 'swap' | 'hub'
  const [activeHubTab, setActiveHubTab] = useState('trades');
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [isSynthesizingToken, setIsSynthesizingToken] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [isSellPercentageMode, setIsSellPercentageMode] = useState(false);
  const [followedSymbols, setFollowedSymbols] = useState([]);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const [copiedCA, setCopiedCA] = useState(false);

 const [tradesSubTab, setTradesSubTab] = useState('all');

 const [isSidebarOpen, setIsSidebarOpen] = useState(true);

 const handleTabClick = (tab) => {
    setLeftTab(tab);
    if (tab === 'Track') {
      if (typeof handleSidebarNavigation === 'function') {
        handleSidebarNavigation('track');
      } else if (typeof setActivePage === 'function') {
        setActivePage('track');
      } else if (typeof setActiveRoute === 'function') {
        setActiveRoute('track');
      }
    }
  };

const handleCopyCA = (address) => {
  navigator.clipboard.writeText(address || 'Cyknvgvyl97eW6tj...');
  setCopiedCA(true);
  setTimeout(() => setCopiedCA(false), 1500);
};

  const currentToken = selectedTokenData || globalTokens[0] || {
    name: 'PSMOKE',
    symbol: 'PSMOKE',
    price: '$0.05439',
    mcap: '$10.88K',
    change24h: '+161.33%',
    isPositive: true,
    mintAddress: '15trade.phantom.com...',
    liquidity: '$5.67K',
    supply: '2B',
    top10: '50.64%',
    vol24h: '$729.55M',
    icon: '💨'
  };

// Helper to safely extract a normalized token key
  const getTokenKey = (t) => (t?.symbol || t?.mintAddress || t?.address || t?.id || '').toLowerCase();

// Check if active token is inside followedSymbols
  const currentKey = getTokenKey(currentToken);
  const isFollowing = currentKey ? followedSymbols.some(s => s.toLowerCase() === currentKey) : false;

  // Toggle follow status
  const handleToggleFollow = (token) => {
    const key = getTokenKey(token);
    if (!key) return;
    setFollowedSymbols(prev => 
      prev.some(s => s.toLowerCase() === key)
        ? prev.filter(s => s.toLowerCase() !== key)
        : [...prev, key]
    );
  };

  const baseTokens = globalTokens && globalTokens.length > 0 ? globalTokens : [
    { symbol: 'PSTACIA', mcap: '$8.54M', change24h: '+51.14%', isPositive: true },
    { symbol: 'JUP', mcap: '$729.55M', change24h: '+2.3%', isPositive: true },
    { symbol: 'ALCH', mcap: '$30.45M', change24h: '+13.84%', isPositive: true },
    { symbol: 'PYTH', mcap: '$433.23M', change24h: '+1.34%', isPositive: true },
    { symbol: 'META', mcap: '$151.76M', change24h: '-7.19%', isPositive: false },
    { symbol: 'XOSIS', mcap: '$2.63M', change24h: '+191.49%', isPositive: true },
    { symbol: 'XST', mcap: '$11.78M', change24h: '-6.93%', isPositive: false },
    { symbol: 'Martians', mcap: '$2.72M', change24h: '+3.83%', isPositive: true },
    { symbol: 'JIMTHY', mcap: '$13.71M', change24h: '-19.12%', isPositive: false }
  ];

  // Filter tokens (case-insensitive check)
  const displayedTokens = leftTab === 'Follows'
    ? baseTokens.filter(t => {
        const tKey = getTokenKey(t);
        return (tKey && followedSymbols.some(s => s.toLowerCase() === tKey)) || t.isFollowing || t.followed;
      })
    : baseTokens;

    const SolIcon = ({ className = "w-2.5 h-2.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="currentColor">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM332.4 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
  </svg>
);

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white grid grid-cols-12 gap-2 p-2 overflow-hidden select-none">
      
     {/* ==================== LEFT SIDEBAR ==================== */}
     <div className={`${isSidebarOpen ? 'col-span-12 lg:col-span-4 xl:col-span-3' : 'hidden'} bg-[#121318] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden`}>
      <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] p-1.5 gap-1 shrink-0">
      {['Tokens', 'Follows', 'Track'].map((tab) => (
  <button
    key={tab}
    type="button"
    onClick={() => {
  setLeftTab(tab);
  if (tab === 'Track') {
    if (typeof handleSidebarNavigation === 'function') handleSidebarNavigation('track');
    else if (typeof setActivePage === 'function') setActivePage('track');
    else if (typeof setActiveRoute === 'function') setActiveRoute('track');
  }
}}
    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
      leftTab === tab
        ? 'bg-[#1c1d24] text-white shadow'
        : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {tab}
  </button>
))}
    </div>

        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  {displayedTokens.length === 0 && leftTab === 'Follows' ? (
    <div className="p-8 text-center text-xs font-semibold text-zinc-500">
      No followed tokens yet
    </div>
  ) : (
    displayedTokens.map((item, idx) => (
      <SidebarTokenRow
        key={item.id || item.address || item.symbol || idx}
        token={item}
        isActive={(selectedTokenData?.symbol || currentToken?.symbol) === item.symbol}
        onSelect={(token) => setSelectedTokenData && setSelectedTokenData(token)}
      />
    ))
  )}
</div>

        <div className="p-2.5 border-t border-white/5 bg-[#0a0b0e] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-500 font-bold">Portfolio Balance</span>
          <span className="text-xs font-mono font-black text-[#00f2a1]">$99.60</span>
        </div>
      </div>

     {/* ==================== CENTER COLUMN: CHART & HEADER STATS ==================== */}
      <div className={`col-span-12 ${
        isSidebarOpen 
          ? 'lg:col-span-5 xl:col-span-6' 
          : 'lg:col-span-8 xl:col-span-9'
      } flex flex-col h-full gap-2 overflow-hidden transition-all duration-200`}>
        
        {/* Token Meta Header */}
<div className="bg-[#121318] border border-white/5 rounded-xl p-2.5 flex items-center justify-between shrink-0 gap-4 overflow-hidden">
  
  {/* Left: Flush Wall Toggle + Token Info + Copyable CA */}
<div className="flex items-center gap-2.5 shrink-0 pr-3 border-r border-white/5">
  
  {/* Tiny Wall-Attached Toggle Button */}
  <button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="-ml-2.5 -my-2.5 self-stretch w-5 bg-[#1c1d24] hover:bg-white/10 border-r border-white/5 rounded-l-xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors shrink-0"
    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
  >
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2.5" 
        d={isSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
      />
    </svg>
  </button>

  {/* Token Avatar */}
  <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 ml-0.5">
    {currentToken.imagePreview ? (
      <img src={currentToken.imagePreview} alt={currentToken.symbol} className="w-full h-full object-cover" />
    ) : (
      currentToken.icon || '🪙'
    )}
  </div>
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-black text-white tracking-wide">{currentToken.name || currentToken.symbol}</h1>
        <button
  type="button"
  onClick={() => handleToggleFollow(currentToken)}
  className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
    isFollowing 
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
      : 'bg-[#1c1d24] hover:bg-white/20 text-zinc-300'
     }`}
    >
    {isFollowing ? '✓ Following' : '+ Follow'}
    </button>
      </div>

      {/* Sub-row: Timeframe, Copyable CA & Real SVG Socials */}
      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
        <span>1d</span>
        <span>•</span>
        
        {/* Clickable Contract Address with Copy Icon */}
        <button 
          onClick={() => handleCopyCA(currentToken.mintAddress)}
          className="flex items-center gap-1 hover:text-white transition-colors group relative"
          title="Copy Contract Address"
        >
          <span className="truncate max-w-[85px]">{currentToken.mintAddress || 'Cyknvgvyl97eW6tj...'}</span>
          <svg className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copiedCA && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f2a1] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
              Copied!
            </span>
          )}
        </button>

        <span className="text-zinc-700">|</span>

        {/* Real SVG Social Links Icons */}
        <div className="flex items-center gap-2 text-zinc-400">
          <a href={currentToken.website || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Website">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round5" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </a>
          <a href={currentToken.twitter || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Twitter / X">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href={currentToken.telegram || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Telegram">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* Scrollable Right Ticker: Large & Clean Numbers */}
  <div className="flex items-center gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] font-mono shrink whitespace-nowrap">
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Price</span>
      <span className="text-sm font-black text-white">{formatPhantomPrice(currentToken?.price || 0.05439)}</span>
    </div>
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Market Cap</span>
      <span className="text-sm font-black text-white">{currentToken.mcap || '$10.88K'}</span>
    </div>
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">24h Change</span>
      <span className={`text-sm font-black ${currentToken.isPositive !== false ? 'text-[#089981]' : 'text-[#F23645]'}`}>
        {currentToken.change24h || '+161.33%'}
      </span>
    </div>
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Liquidity</span>
      <span className="text-sm font-black text-white">{currentToken.liquidity || '$5.67K'}</span>
    </div>
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Supply</span>
      <span className="text-sm font-black text-white">{currentToken.supply || '2B'}</span>
    </div>
    <div className="text-right shrink-0">
      <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Top 10</span>
      <span className="text-sm font-black text-amber-500">{currentToken.top10 || '50.64%'}</span>
    </div>
  </div>

</div>

        {/* TradingView Container */}
        <div className="flex-1 min-h-0 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden relative">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs text-zinc-400 font-medium shrink-0 bg-[#0a0b0e]">
            <div className="flex items-center gap-2">
              {['15m', '1h', '4h', '1d'].map((tf, i) => (
                <button key={tf} className={`px-2 py-0.5 rounded text-[11px] hover:text-white ${i === 0 ? 'bg-white/10 text-white font-bold' : ''}`}>
                  {tf}
                </button>
              ))}
              <span className="h-3 w-[1px] bg-white/10 mx-1" />
              <button className="text-white font-bold text-[11px]">Price / MCap</button>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span>Show Outliers</span>
              <span>•</span>
              <span>Phantom</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full relative bg-[#0e0f14] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#089981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="z-10 text-center">
              <div className="text-4xl mb-2">📈</div>
              <span className="text-xs text-zinc-400 font-mono tracking-wider uppercase">TRADINGVIEW REAL-TIME CHART WIDGET EMBED</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5 bg-[#0a0b0e] text-[10px] font-mono text-zinc-500 shrink-0">
            <div className="flex items-center gap-3">
              {['5y', '1y', '6m', '3m', '1m', '5d', '1d'].map((range, i) => (
                <span key={range} className={`cursor-pointer hover:text-white ${i === 6 ? 'text-zinc-300' : ''}`}>{range}</span>
              ))}
            </div>
            <span>13:16:04 (UTC+1)</span>
          </div>
        </div>

      </div>

      {/* ==================== RIGHT SIDEBAR ==================== */}
      {/* RIGHT SIDEBAR */}
<div className="col-span-12 lg:col-span-3 xl:col-span-3 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Switcher Tabs */}
        <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setRightPanelMode('swap')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              rightPanelMode === 'swap' 
                ? 'bg-[#1c1d24] text-white shadow border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            ⚡ Quick Swap
          </button>
          <button
            onClick={() => setRightPanelMode('hub')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              rightPanelMode === 'hub' 
                ? 'bg-[#1c1d24] text-white shadow border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            📊 Market Hub
          </button>
        </div>

        {rightPanelMode === 'swap' ? (
          <div className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* 5m Volume Header Bar */}
            <div className="p-3 border-b border-white/5 bg-[#0a0b0e] shrink-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-zinc-500 font-bold">5m Vol</span>
                <span className="text-xs font-mono font-black text-white">$349.5K</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-[#089981]">1.12K • $157.4K</span>
                <span className="text-[#F23645]">979 • $192.1K</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full flex overflow-hidden">
                <div className="bg-[#089981] h-full" style={{ width: '45%' }} />
                <div className="bg-[#F23645] h-full" style={{ width: '55%' }} />
              </div>
            </div>

            {/* Trading Controls Area */}
            <div className="p-3 space-y-4">
              
{/* Bonding Curve Card */}
        <div className="bg-[#121318] p-3 rounded-xl border border-white/5 font-mono">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-zinc-400 font-semibold">Bonding Curve</span>
            <span className="text-[#00f2a1] font-bold">{currentToken?.bondingProgress ?? 72}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#00f2a1] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00f2a1]" 
              style={{ width: `${Math.min(currentToken?.bondingProgress ?? 72, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-500 mt-1.5">
            <span>Graduate at ${currentToken?.targetMcap || '69k'} mcap</span>
            <span>{(currentToken?.bondingProgress ?? 72) >= 100 ? 'Graduated' : 'In Progress'}</span>
          </div>
        </div>

              {/* Buy / Sell Tabs */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-lg flex-1">
                  <button
                    onClick={() => { setTradeMode('buy'); setIsSellPercentageMode(false); }}
                    className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${
                      tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeMode('sell')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${
                      tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {tradeMode === 'sell' && (
                  <button 
                    onClick={() => setIsSellPercentageMode(!isSellPercentageMode)}
                    className="ml-2 p-2 bg-[#1a1b22] rounded-lg text-zinc-400 hover:text-white text-xs"
                    title="Toggle Percentage Mode"
                  >
                    ≡
                  </button>
                )}
              </div>

              {/* Amount Input Block */}
              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1 px-1 uppercase tracking-wider">
                  <span>Amount to {tradeMode}</span>
                  <span>{tradeMode === 'buy' ? 'SOL' : currentToken.symbol}</span>
                </div>
                <div className="bg-[#0c0d10] border border-white/5 rounded-lg flex items-center px-3 py-2.5 focus-within:border-[#8145e6]/50">
                  <input
                    type="text"
                    placeholder="0"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-transparent outline-none text-xl font-mono font-black text-white placeholder-zinc-700"
                  />
                </div>
              </div>

             {/* Quick Amount Selector Buttons */}
{!isSellPercentageMode ? (
  <div className="grid grid-cols-3 gap-1.5">
    {['0.1', '0.25', '0.5', '1', '5', 'Max'].map((val) => (
      <button
        key={val}
        type="button"
        onClick={() => setTradeAmount(val === 'Max' ? '10' : val)}
        className="py-1.5 bg-[#1a1b22] hover:bg-white/10 rounded-md text-[11px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
      >
        <span>{val}</span>
        {val !== 'Max' && <SolIcon className="w-2.5 h-2.5 text-zinc-400" />}
      </button>
    ))}
  </div>
) : (
  <div className="grid grid-cols-4 gap-1.5">
    {['10%', '25%', '50%', '100%'].map((val) => (
      <button
        key={val}
        type="button"
        onClick={() => setTradeAmount(val)}
        className="py-1.5 bg-[#1a1b22] hover:bg-white/10 rounded-md text-[11px] font-bold text-zinc-400 hover:text-white transition-colors font-mono cursor-pointer"
      >
        {val}
      </button>
    ))}
  </div>
)}

              {/* Summary Stats */}
              <div className="space-y-1 text-[10px] font-mono text-zinc-500 pt-1">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="text-white font-bold">≈ 324.59M {currentToken.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Holdings</span>
                  <span className="text-white font-bold">0 {currentToken.symbol}</span>
                </div>
              </div>

              {/* Action Trigger Button */}
        <button
      onClick={() => setIsSwapModalOpen(true)}
      className={`w-full py-3 rounded-xl font-black text-xs transition-transform active:scale-[0.98] ${
      tradeMode === 'buy' 
      ? 'bg-[#00f2a1] text-black hover:bg-[#00d990]' 
      : 'bg-[#F23645] text-white hover:bg-[#e02a39]'
      }`}
      >
      {tradeMode === 'buy' ? 'Add SOL for fees' : `SELL ${currentToken?.symbol}`}
       </button>

              {/* Fee Details Dropdown */}
              <div className="border-t border-white/5 pt-2">
                <div 
                  onClick={() => setShowFeeDetails(!showFeeDetails)}
                  className="flex justify-between items-center text-[10px] text-zinc-500 font-bold cursor-pointer hover:text-zinc-300"
                >
                  <span>$0.12 + 0.85% fee</span>
                  <span className="text-[9px]">Details {showFeeDetails ? '▴' : '▾'}</span>
                </div>

                {showFeeDetails && (
                  <div className="mt-2 p-2 bg-[#0c0d10] border border-white/5 rounded-lg space-y-1.5 text-[10px] font-mono text-zinc-400">
                    <div className="flex justify-between">
                      <span>Rate</span>
                      <span className="text-white">1 SOL = 13.59M {currentToken.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slippage</span>
                      <span className="text-amber-400 font-bold">Auto - 7.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Impact</span>
                      <span className="text-[#F23645] font-bold">79.83% (Very high)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solana Network Fee</span>
                      <span className="text-white">$0.12</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Your Position Module */}
              <div className="border-t border-white/5 pt-3">
                <div className="text-[11px] font-bold text-white mb-2">Your Position</div>
                <div className="grid grid-cols-4 gap-1 text-center bg-[#0c0d10] p-2 border border-white/5 rounded-lg font-mono text-[10px]">
                  <div>
                    <span className="block text-zinc-500 text-[8px] uppercase">Bought</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 text-[8px] uppercase">Holding</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 text-[8px] uppercase">Sold</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 text-[8px] uppercase">P&L</span>
                    <span className="text-zinc-500 font-bold">0 (0%)</span>
                  </div>
                </div>
              </div>

             {/* Token Info Security Grid */}
              <div className="border-t border-white/5 pt-3 pb-2">
                <div className="text-[11px] font-bold text-white mb-2">Token Info</div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">Top 10 H</span>
                    <span className="text-amber-500 font-bold">{currentToken.top10 || '50.64%'}</span>
                  </div>
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">Dev H</span>
                    <span className="text-white font-bold">0%</span>
                  </div>
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">Snipers H</span>
                    <span className="text-[#F23645] font-bold">202.57%</span>
                  </div>
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">Bundled H</span>
                    <span className="text-white font-bold">0%</span>
                  </div>
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">LP Burned</span>
                    <span className="text-[#089981] font-bold">100%</span>
                  </div>
                  <div className="bg-[#0c0d10] p-1.5 border border-white/5 rounded">
                    <span className="block text-zinc-500 text-[9px]">Mutable</span>
                    <span className="text-zinc-500 font-bold">Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MARKET HUB VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex overflow-x-auto border-b border-white/5 bg-[#0a0b0e] shrink-0 [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'trades', label: 'Trades' },
                { id: 'chat', label: 'Chat' },
                { id: 'positions', label: 'Positions' },
                { id: 'top_traders', label: 'Traders' },
                { id: 'holders', label: 'Holders' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveHubTab(tab.id)}
                  className={`px-3 py-2 text-[11px] font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeHubTab === tab.id
                      ? 'border-[#089981] text-white bg-white/5' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 bg-[#0c0d10] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
              {activeHubTab === 'trades' ? (
                <div className="flex flex-col h-full">
                  {/* Trades Sub-Header (All Trades vs My Trades) */}
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/5 shrink-0">
                    <button
                      onClick={() => setTradesSubTab('all')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        tradesSubTab === 'all'
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      All Trades
                    </button>
                    <button
                      onClick={() => setTradesSubTab('my')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        tradesSubTab === 'my'
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      My Trades
                    </button>
                  </div>

                  {/* Dynamic Trade Content */}
                  <div className="flex-1 overflow-y-auto">
                    {tradesSubTab === 'all' ? (
                      <div className="h-full min-h-[180px] flex items-center justify-center text-xs text-zinc-500 font-mono border border-white/5 border-dashed rounded-lg">
                        ALL TRADES CONTENT COMPONENT
                      </div>
                    ) : (
                      <div className="h-full min-h-[180px] flex items-center justify-center text-xs text-zinc-500 font-mono border-t border-white/5">
                        MY TRADES CONTENT COMPONENT
                      </div>
                    )}
                  </div>
                </div>
              ) : activeHubTab === 'chat' ? (
                <TokenChat tokenSymbol={currentToken.symbol} />
              ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-xs text-zinc-500 font-mono border-t border-white/5">
                {activeHubTab.toUpperCase()} CONTENT COMPONENT
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Desktop Trade Execution Modal Overlay */}
    <SwapModal 
      isOpen={isSwapModalOpen} 
      onClose={() => setIsSwapModalOpen(false)} 
      currentToken={currentToken} 
    />
  </div>
);
}