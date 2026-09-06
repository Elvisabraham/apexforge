import React, { useState } from 'react';
import SidebarTokenRow from './SidebarTokenRow';
import { formatPhantomPrice } from '../utils/formatters';
import TokenChat from './TokenChat';
import TrackView from './TrackView';
import TokenCallouts from './TokenCallouts'; // Ensure you have this component
import TokenHolders from './TokenHolders'; // Ensure you have this component
import { 
  TrendingUp,
  Activity,
  Repeat2,
  MessageSquare,
  Heart,
  BarChart2,
  Share2,
  Check,
  ChevronLeft,
  Globe,
  X
} from 'lucide-react';

// Professional DEX Dollar Sign
const DexDollarIcon = ({ className = "w-4 h-4", strokeWidth = 2.5 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

// X (Twitter) Logo Icon
const XIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Telegram Icon
const TelegramIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

// Solana SVG Logo Component
const SolIcon = ({ className = "w-2.5 h-2.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="currentColor">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM332.4 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
  </svg>
);

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
  // Mobile States
  const [mobileActivityTab, setMobileActivityTab] = useState('callouts');
  const [showMobileMcap, setShowMobileMcap] = useState(true);
  const [isMobileTradeOpen, setIsMobileTradeOpen] = useState(false); // Local mobile drawer state
  
  // Desktop States
  const [leftTab, setLeftTab] = useState('Tokens');
  const [rightPanelMode, setRightPanelMode] = useState('swap'); 
  const [activeHubTab, setActiveHubTab] = useState('trades');
  const [tradesSubTab, setTradesSubTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Trade States
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  
  const [followedSymbols, setFollowedSymbols] = useState([]);
  const [copiedCA, setCopiedCA] = useState(false);

  const handleTabClick = (tab) => {
    setLeftTab(tab);
    if (tab === 'Track') {
      if (typeof handleSidebarNavigation === 'function') handleSidebarNavigation('track');
      else if (typeof setActivePage === 'function') setActivePage('track');
      else if (typeof setActiveRoute === 'function') setActiveRoute('track');
    }
  };

  const handleCopyCA = (address) => {
    navigator.clipboard.writeText(address || 'Cyknvgvyl97eW6tj...');
    setCopiedCA(true);
    setTimeout(() => setCopiedCA(false), 1500);
  };

  const executeTokenTrade = () => {
    handleExecuteTrade(tradeMode, tradeAmount, currentToken);
    setIsMobileTradeOpen(false);
  };

  const currentToken = selectedTokenData || globalTokens[0] || {
    name: 'Heieheue',
    symbol: 'NEIEHEJ',
    price: '0.0001',
    mcap: '10.0K',
    change24h: '+161.33%',
    isPositive: true,
    mintAddress: '4bUkBugu...',
    liquidity: '5.67K',
    supply: '1B',
    top10: '50.64%',
    vol24h: '729.55M',
    icon: '🔥'
  };

  const getTokenKey = (t) => (t?.symbol || t?.mintAddress || t?.address || t?.id || '').toLowerCase();
  const currentKey = getTokenKey(currentToken);
  const isFollowing = currentKey ? followedSymbols.some(s => s.toLowerCase() === currentKey) : false;

  const handleToggleFollow = (token) => {
    const key = getTokenKey(token);
    if (!key) return;
    setFollowedSymbols(prev => 
      prev.some(s => s.toLowerCase() === key) ? prev.filter(s => s.toLowerCase() !== key) : [...prev, key]
    );
  };

  const baseTokens = globalTokens && globalTokens.length > 0 ? globalTokens : [
    { symbol: 'VKHH', mcap: '$10.0K', change24h: '+0.0%', isPositive: true },
    { symbol: 'YDYDUUUT', mcap: '$10.0K', change24h: '+0.0%', isPositive: true },
    { symbol: 'JSHDHSUSV', mcap: '$10.0K', change24h: '+0.0%', isPositive: true },
  ];

  const displayedTokens = leftTab === 'Follows'
    ? baseTokens.filter(t => {
        const tKey = getTokenKey(t);
        return (tKey && followedSymbols.some(s => s.toLowerCase() === tKey)) || t.isFollowing || t.followed;
      })
    : baseTokens;

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white overflow-hidden select-none relative">
      
      {/* ===================================================================== */}
      {/* 1. MOBILE NATIVE VIEW */}
      {/* ===================================================================== */}
      <div className="flex lg:hidden flex-col w-full h-full bg-[#0a0b0e] relative">
        
        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-4">
          
          {/* Top Navbar */}
          <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0c0d10] sticky top-0 z-30 shadow-md">
            <button 
              onClick={() => {
                if (typeof handleSidebarNavigation === 'function') handleSidebarNavigation('home');
                else if (typeof setActivePage === 'function') setActivePage('home');
              }} 
              className="text-zinc-400 hover:text-white flex items-center gap-1 p-1 bg-[#121318] rounded-lg border border-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Portfolio</span>
              <span className="flex items-center text-xs font-mono font-black text-[#00f2a1]">
                <DexDollarIcon className="w-3 h-3 mr-[1px]" strokeWidth={3} />
                99.60
              </span>
            </div>
          </div>

          {/* Token Header Metadata (Interactive MCap/Price Toggle) */}
          <div className="p-4 bg-[#0c0d10] flex justify-between items-start gap-4">
              <div className="flex gap-3 items-center min-w-0">
                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xl shrink-0 shadow-inner">
                  {currentToken.imagePreview ? <img src={currentToken.imagePreview} className="w-full h-full object-cover" /> : currentToken.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white truncate max-w-[120px]">{currentToken.name || currentToken.symbol}</span>
                    <span className="text-[9px] bg-[#1c1d24] text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">{currentToken.symbol}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mt-1">
                    <span>1d ago</span>
                    <span>•</span>
                    <button onClick={() => handleCopyCA(currentToken.mintAddress)} className="flex items-center gap-1 hover:text-white relative">
                        {currentToken.mintAddress?.substring(0, 8)}...
                        {copiedCA && <span className="absolute -top-6 left-0 bg-[#00f2a1] text-black px-1.5 py-0.5 rounded shadow z-50">Copied</span>}
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                className="flex flex-col items-end text-right mt-1 shrink-0 cursor-pointer group"
                onClick={() => setShowMobileMcap(!showMobileMcap)}
              >
                <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5 group-hover:text-zinc-400 transition-colors">
                  <span>{showMobileMcap ? 'Market Cap' : 'Price'}</span>
                  <Repeat2 className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                </div>
                <span className="flex items-center text-lg font-black text-white transition-all">
                    <DexDollarIcon className="w-4 h-4 text-zinc-400 mr-[1px]" strokeWidth={3} />
                    {showMobileMcap 
                      ? String(currentToken.mcap || '10.0K').replace('$', '')
                      : String(currentToken.price || '0.0001').replace('$', '')
                    }
                </span>
                <span className={`text-xs font-black mt-0.5 ${currentToken.isPositive !== false ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {currentToken.change24h || '+161.33%'}
                </span>
              </div>
          </div>

          {/* Mobile Chart Block */}
          <div className="w-full h-[280px] bg-[#0e0f14] border-y border-white/5 relative flex flex-col shrink-0">
            <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                <div className="flex gap-1 bg-[#0a0b0e]/80 backdrop-blur border border-white/10 rounded p-1">
                  {['15m', '1h', '4h', '1d'].map((tf, i) => (
                    <button key={tf} className={`px-2 py-0.5 rounded text-[10px] font-bold ${i === 0 ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>{tf}</button>
                  ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center z-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(#089981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="text-4xl mb-2">📈</div>
                <span className="text-[10px] text-zinc-400 font-mono tracking-wider">REAL-TIME CHART EMBED</span>
            </div>
          </div>

          {/* Bonding Curve Section */}
          <div className="bg-[#121318] p-4 font-mono border-b border-white/5">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-zinc-400 font-semibold">Bonding Curve</span>
              <span className="text-[#00f2a1] font-bold">{currentToken?.bondingProgress ?? 72}%</span>
            </div>
            <div className="w-full bg-[#1c1d24] rounded-full h-1.5 overflow-hidden shadow-inner">
              <div 
                className="bg-[#00f2a1] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00f2a1]" 
                style={{ width: `${Math.min(currentToken?.bondingProgress ?? 72, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-zinc-500 mt-2">
              <span className="flex items-center">
                Graduate at <DexDollarIcon className="w-2.5 h-2.5 mx-0.5" strokeWidth={2}/> {currentToken?.targetMcap || '69k'} mcap
              </span>
              <span>{(currentToken?.bondingProgress ?? 72) >= 100 ? 'Graduated' : 'In Progress'}</span>
            </div>
          </div>

          {/* 3 Section Buttons for Activities (Callouts, Holders, About) */}
          <div className="flex border-b border-white/5 bg-[#0a0b0e] sticky top-[60px] z-20 shadow-md">
            {[
              { id: 'callouts', label: 'Callouts' },
              { id: 'holders', label: 'Holders' },
              { id: 'about', label: 'About' }
            ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMobileActivityTab(tab.id)}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-[3px] transition-colors ${
                    mobileActivityTab === tab.id ? 'border-[#00f2a1] text-white bg-white/5' : 'border-transparent text-zinc-500'
                  }`}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          {/* Activity Content Area */}
          <div className="flex-1 bg-[#0c0d10] p-4 min-h-[300px]">
            {mobileActivityTab === 'callouts' && (
              typeof TokenCallouts !== 'undefined' ? <TokenCallouts tokenSymbol={currentToken.symbol} /> : <div className="text-zinc-500 text-center font-mono text-xs py-10">CALLOUTS COMPONENT MISSING</div>
            )}
            {mobileActivityTab === 'holders' && (
              typeof TokenHolders !== 'undefined' ? <TokenHolders top10Percentage={currentToken.top10} /> : <div className="text-zinc-500 text-center font-mono text-xs py-10">HOLDERS COMPONENT MISSING</div>
            )}
            {mobileActivityTab === 'about' && (
              <div className="space-y-4">
                <div className="text-sm font-bold text-white mb-2">Coin Creator</div>
                <div className="flex items-center gap-3 bg-[#121318] p-3 rounded-lg border border-white/5">
                   <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-xl">👾</div>
                   <div className="flex-1">
                      <div className="text-sm font-bold text-white">0xf971...</div>
                      <div className="text-xs text-zinc-500 font-mono">0 Forged</div>
                   </div>
                   <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Follow</button>
                </div>
                <div className="mt-4">
                   <div className="text-sm font-bold text-white mb-2">Description</div>
                   <p className="text-xs text-zinc-400 leading-relaxed">
                     The launchpad for memecoins paired to ptokens. Built for the trenches.
                   </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                   <span className="bg-[#1c1d24] text-zinc-300 text-[10px] px-2 py-1 rounded border border-white/5 font-mono flex items-center gap-1"><Globe className="w-3 h-3"/> Website</span>
                   <span className="bg-[#1c1d24] text-zinc-300 text-[10px] px-2 py-1 rounded border border-white/5 font-mono flex items-center gap-1"><XIcon className="w-3 h-3"/> Twitter</span>
                   <span className="bg-[#1c1d24] text-zinc-300 text-[10px] px-2 py-1 rounded border border-white/5 font-mono flex items-center gap-1"><TelegramIcon className="w-3 h-3"/> Telegram</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ULTRA-COMPACT PINNED BOTTOM TRADE BUTTON */}
        <div className="shrink-0 bg-[#121318] border-t border-white/10 p-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),1rem)]">
          <button 
            onClick={() => setIsMobileTradeOpen(true)} 
            className="w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] bg-[#00f2a1] text-black shadow-[0_0_15px_rgba(0,242,161,0.3)] hover:opacity-90"
          >
            TRADE {currentToken?.symbol}
          </button>
        </div>

        {/* LOCAL MOBILE TRADE DRAWER (Bottom Sheet) */}
        <div className={`fixed inset-0 z-[100] lg:hidden flex items-end transition-opacity duration-300 ${isMobileTradeOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileTradeOpen(false)} />
          <div className={`w-full bg-[#121318] border-t border-white/10 rounded-t-3xl p-5 relative z-10 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out pb-[max(env(safe-area-inset-bottom),1.25rem)] ${isMobileTradeOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Trade {currentToken.symbol}</h3>
              <button onClick={() => setIsMobileTradeOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-1.5 rounded-full"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-lg mb-3 shadow-inner">
              <button onClick={() => setTradeMode('buy')} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow-sm' : 'text-zinc-500'}`}>Buy</button>
              <button onClick={() => setTradeMode('sell')} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-sm' : 'text-zinc-500'}`}>Sell</button>
            </div>
            <div className="bg-[#050505] border border-white/5 rounded-lg px-4 py-3 mb-3 flex items-center justify-between shadow-inner focus-within:border-[#00f2a1]/50">
              <div className="flex flex-col flex-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Amount</span>
                <input type="text" inputMode="decimal" placeholder="0.0" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value.replace(/[^0-9.]/g, ''))} className="bg-transparent text-2xl font-black text-white w-full outline-none font-mono tracking-tight" />
              </div>
              <span className="text-xs font-black text-white font-mono bg-[#1a1b22] px-3 py-1.5 rounded-md">SOL</span>
            </div>
            <div className="flex gap-2 mb-4">
              {['0.1', '0.5', '1', 'Max'].map(amt => (
                <button key={amt} onClick={() => setTradeAmount(amt === 'Max' ? '10' : amt)} className="flex-1 bg-[#1a1b22] border border-white/5 hover:bg-white/10 py-2 rounded-md text-[11px] font-black text-zinc-300 shadow-sm">{amt}</button>
              ))}
            </div>
            <button onClick={executeTokenTrade} className={`w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-[0.98] ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow-[0_0_15px_rgba(0,242,161,0.2)]' : 'bg-[#F23645] text-white shadow-[0_0_15px_rgba(242,54,69,0.2)]'}`}>
              {tradeMode === 'buy' ? 'PLACE BUY ORDER' : 'EXECUTE SELL'}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DESKTOP VIEW - DOLLAR SIGNS DEEP SCANNED & REPLACED */}
      {/* ===================================================================== */}
      <div className="hidden lg:grid grid-cols-12 h-full gap-2 p-2 w-full">
        {/* LEFT SIDEBAR */}
        <div className={`${isSidebarOpen ? 'col-span-4 xl:col-span-3' : 'hidden'} bg-[#121318] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden`}>
          <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] p-1.5 gap-1 shrink-0">
            {['Tokens', 'Follows', 'Track'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
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

          {/* Desktop Portfolio Balance */}
          <div className="p-2.5 border-t border-white/5 bg-[#0a0b0e] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-zinc-500 font-bold">Portfolio Balance</span>
            <span className="flex items-center text-xs font-mono font-black text-[#00f2a1]">
              <DexDollarIcon className="w-3 h-3 mr-[1px]" strokeWidth={3} />
              99.60
            </span>
          </div>
        </div>

        {/* CENTER COLUMN: CHART & HEADER STATS */}
        <div className={`${isSidebarOpen ? 'col-span-5 xl:col-span-6' : 'col-span-8 xl:col-span-9'} flex flex-col h-full gap-2 overflow-hidden transition-all duration-200`}>
          
          {/* Token Meta Header */}
          <div className="bg-[#121318] border border-white/5 rounded-xl p-2.5 flex items-center justify-between shrink-0 gap-4 overflow-hidden">
            <div className="flex items-center gap-2.5 shrink-0 pr-3 border-r border-white/5">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="-ml-2.5 -my-2.5 self-stretch w-5 bg-[#1c1d24] hover:bg-white/10 border-r border-white/5 rounded-l-xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors shrink-0"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>

              <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 ml-0.5">
                {currentToken.imagePreview ? <img src={currentToken.imagePreview} alt={currentToken.symbol} className="w-full h-full object-cover" /> : currentToken.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black text-white tracking-wide">{currentToken.name || currentToken.symbol}</h1>
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(currentToken)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                      isFollowing 
                        ? 'bg-[#00f2a1]/20 text-[#00f2a1]' 
                        : 'bg-[#1c1d24] hover:bg-white/20 text-zinc-300'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                  <span>1d</span><span>•</span>
                  <button onClick={() => handleCopyCA(currentToken.mintAddress)} className="flex items-center gap-1 hover:text-white relative">
                    <span className="truncate max-w-[85px]">{currentToken.mintAddress || 'Cyknvgvyl97eW6tj...'}</span>
                    <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    {copiedCA && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f2a1] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-50">Copied!</span>}
                  </button>
                  <span className="text-zinc-700">|</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <a href={currentToken.website || "#"} className="hover:text-white"><Globe className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.twitter || "#"} className="hover:text-white"><XIcon className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.telegram || "#"} className="hover:text-white"><TelegramIcon className="w-3.5 h-3.5"/></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Scrollable Right Ticker */}
            <div className="flex items-center gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] font-mono shrink whitespace-nowrap">
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Price</span>
                <span className="flex items-center justify-end text-sm font-black text-white">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {String(currentToken?.price || '0.05439').replace('$', '')}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Market Cap</span>
                <span className="flex items-center justify-end text-sm font-black text-white">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {String(currentToken.mcap || '10.88K').replace('$', '')}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">24h Change</span>
                <span className={`text-sm font-black ${currentToken.isPositive !== false ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {currentToken.change24h || '+161.33%'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Liquidity</span>
                <span className="flex items-center justify-end text-sm font-black text-white">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {String(currentToken.liquidity || '5.67K').replace('$', '')}
                </span>
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
                  <button key={tf} className={`px-2 py-0.5 rounded text-[11px] hover:text-white ${i === 0 ? 'bg-white/10 text-white font-bold' : ''}`}>{tf}</button>
                ))}
                <span className="h-3 w-[1px] bg-white/10 mx-1" />
                <button className="text-white font-bold text-[11px]">Price / MCap</button>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span>Show Outliers</span><span>•</span><span>Phantom</span>
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

        {/* RIGHT SIDEBAR (SWAP/TRADE) */}
        <div className="col-span-3 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] p-1.5 gap-1 shrink-0">
            <button
              onClick={() => setRightPanelMode('swap')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rightPanelMode === 'swap' ? 'bg-[#1c1d24] text-white shadow border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ⚡ Quick Swap
            </button>
            <button
              onClick={() => setRightPanelMode('hub')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rightPanelMode === 'hub' ? 'bg-[#1c1d24] text-white shadow border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              📊 Market Hub
            </button>
          </div>

          {rightPanelMode === 'swap' ? (
            <div className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="p-3 border-b border-white/5 bg-[#0a0b0e] shrink-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-zinc-500 font-bold">5m Vol</span>
                  <span className="flex items-center text-xs font-mono font-black text-white">
                    <DexDollarIcon className="w-3 h-3 text-zinc-400 mr-[1px]" strokeWidth={3} />
                    349.5K
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                  <span className="flex items-center text-[#089981]">1.12K • <DexDollarIcon className="w-2.5 h-2.5 mr-[1px]"/> 157.4K</span>
                  <span className="flex items-center text-[#F23645]">979 • <DexDollarIcon className="w-2.5 h-2.5 mr-[1px]"/> 192.1K</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full flex overflow-hidden">
                  <div className="bg-[#089981] h-full" style={{ width: '45%' }} />
                  <div className="bg-[#F23645] h-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div className="p-3 space-y-4">
                <div className="bg-[#121318] p-3 rounded-xl border border-white/5 font-mono">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-zinc-400 font-semibold">Bonding Curve</span>
                    <span className="text-[#00f2a1] font-bold">{currentToken?.bondingProgress ?? 72}%</span>
                  </div>
                  <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00f2a1] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00f2a1]" style={{ width: `${Math.min(currentToken?.bondingProgress ?? 72, 100)}%` }}/>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-zinc-500 mt-1.5">
                    <span className="flex items-center">
                      Graduate at <DexDollarIcon className="w-2.5 h-2.5 mx-0.5" strokeWidth={2}/> {currentToken?.targetMcap || '69k'} mcap
                    </span>
                    <span>{(currentToken?.bondingProgress ?? 72) >= 100 ? 'Graduated' : 'In Progress'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-lg flex-1">
                    <button onClick={() => { setTradeMode('buy'); }} className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow' : 'text-zinc-500 hover:text-white'}`}>Buy</button>
                    <button onClick={() => setTradeMode('sell')} className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Sell</button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1 px-1 uppercase tracking-wider">
                    <span>Amount to {tradeMode}</span>
                    <span>{tradeMode === 'buy' ? 'SOL' : currentToken.symbol}</span>
                  </div>
                  <div className="bg-[#0c0d10] border border-white/5 rounded-lg flex items-center px-3 py-2.5 focus-within:border-[#8145e6]/50">
                    <input type="text" placeholder="0" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} className="w-full bg-transparent outline-none text-xl font-mono font-black text-white placeholder-zinc-700" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {['0.1', '0.25', '0.5', '1', '5', 'Max'].map((val) => (
                    <button key={val} type="button" onClick={() => setTradeAmount(val === 'Max' ? '10' : val)} className="py-1.5 bg-[#1a1b22] hover:bg-white/10 rounded-md text-[11px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <span>{val}</span>{val !== 'Max' && <SolIcon className="w-2.5 h-2.5 text-zinc-400" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-1 text-[10px] font-mono text-zinc-500 pt-1">
                  <div className="flex justify-between"><span>Amount</span><span className="text-white font-bold">≈ 324.59M {currentToken.symbol}</span></div>
                  <div className="flex justify-between"><span>Holdings</span><span className="text-white font-bold">0 {currentToken.symbol}</span></div>
                </div>

                {/* DESKTOP TRADE EXECUTE BUTTON */}
                <button onClick={executeTokenTrade} className={`w-full py-3 rounded-xl font-black text-xs transition-transform active:scale-[0.98] ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black hover:bg-[#00d990]' : 'bg-[#F23645] text-white hover:bg-[#e02a39]'}`}>
                  {tradeMode === 'buy' ? 'PLACE BUY ORDER' : `SELL ${currentToken?.symbol}`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex overflow-x-auto border-b border-white/5 bg-[#0a0b0e] shrink-0 [&::-webkit-scrollbar]:hidden">
                {[
                  { id: 'trades', label: 'Trades' },
                  { id: 'chat', label: 'Chat' },
                  { id: 'positions', label: 'Positions' },
                  { id: 'top_traders', label: 'Traders' },
                  { id: 'holders', label: 'Holders' }
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveHubTab(tab.id)} className={`px-3 py-2 text-[11px] font-bold border-b-2 transition-colors whitespace-nowrap ${activeHubTab === tab.id ? 'border-[#089981] text-white bg-white/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>{tab.label}</button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-3 bg-[#0c0d10]">
                 <div className="h-full min-h-[200px] flex items-center justify-center text-xs text-zinc-500 font-mono border-t border-white/5">
                   {activeHubTab.toUpperCase()} CONTENT COMPONENT
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}