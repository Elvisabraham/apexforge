import React, { useState } from 'react';
import SidebarTokenRow from './SidebarTokenRow';
import { formatPhantomPrice } from '../utils/formatters';
import TokenChat from './TokenChat';
import TrackView from './TrackView';
import TokenCallouts from './TokenCallouts';
import TokenHolders from './TokenHolders';
import TokenAbout from './TokenAbout';
import TokenChart from './TokenChart';
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

// Explorer/Search Icon
const SearchIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

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
  userTokenBalance = 0,
  isProcessing = false,
  formatWithCommas = (val) => val,
  calculateTokenYield = () => '0',
  handleExecuteTrade = () => {}
}) {
  // Mobile States
  const [mobileActivityTab, setMobileActivityTab] = useState('callouts');
  const [showMobileMcap, setShowMobileMcap] = useState(true);
  const [isMobileTradeOpen, setIsMobileTradeOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // Desktop States
  const [leftTab, setLeftTab] = useState('Tokens');
  const [rightPanelMode, setRightPanelMode] = useState('swap'); 
  const [activeHubTab, setActiveHubTab] = useState('trades');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartMode, setChartMode] = useState('price'); // 'price' or 'mcap'
  const [activeTimeframe, setActiveTimeframe] = useState('15m');

  // Trade States
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  
  const [followedSymbols, setFollowedSymbols] = useState([]);
  const [copiedCA, setCopiedCA] = useState(false);

  // Live Bonding Curve Math Engine
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
    icon: '🔥',
    solInCurve: 0
  };

  const cleanNumericAmount = parseFloat(tradeAmount.toString().replace(/,/g, '')) || 0;
  const currentVSol = 30 + (currentToken?.solInCurve || 0);
  const currentVTokens = (30 * 1000000000) / currentVSol;

  let estOutputText = '0.00';
  let estPriceImpact = '0.00';

  if (cleanNumericAmount > 0) {
    if (tradeMode === 'buy') {
      const netSol = cleanNumericAmount * 0.99;
      const newVSol = currentVSol + netSol;
      const newVTokens = (30 * 1000000000) / newVSol;
      const tokensOut = currentVTokens - newVTokens;
      
      estOutputText = `${(tokensOut / 1000000).toFixed(2)}M ${currentToken?.symbol || 'TKN'}`;
      estPriceImpact = ((netSol / newVSol) * 100).toFixed(2);
    } else {
      const tokensIn = cleanNumericAmount;
      const newVTokens = currentVTokens + tokensIn;
      const newVSol = (currentVSol * currentVTokens) / newVTokens;
      const solOut = (currentVSol - newVSol) * 0.99;

      estOutputText = `${solOut.toFixed(4)} SOL`;
      estPriceImpact = ((tokensIn / newVTokens) * 100).toFixed(2);
    }
  }

  const handleMaxClick = () => {
    if (tradeMode === 'buy') {
      const maxSol = Math.max(0, (userSolBalance || 0) - 0.005).toFixed(4);
      setTradeAmount(maxSol.toString());
    } else {
      setTradeAmount(userTokenBalance ? userTokenBalance.toString() : "0");
    }
  };

  const handleHalfClick = () => {
    if (tradeMode === 'buy') {
      const halfSol = Math.max(0, ((userSolBalance || 0) / 2)).toFixed(4);
      setTradeAmount(halfSol);
    } else {
      setTradeAmount(Math.floor((userTokenBalance || 0) / 2).toString());
    }
  };

  const executeTokenTrade = async () => {
    await handleExecuteTrade(tradeMode, tradeAmount, currentToken);
    setIsMobileTradeOpen(false);
    setTradeAmount('');
  };

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

    // ==========================================
  // UNIVERSAL DATA ENGINE (Syncs Header & Sidebar)
  // ==========================================
  const charSum = (currentToken?.symbol || 'TKN').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const mockPrice = ((charSum % 80) * 0.00012 + 0.00005).toFixed(5);
  const mockMcap = ((charSum % 90) + 10) + '.' + (charSum % 9) + 'K';
  const mockChangeNum = (charSum % 200) - 50;
  const mockLiq = ((charSum % 40) + 5) + '.' + (charSum % 9) + 'K';
  const mockTop10 = ((charSum % 30) + 40) + '.' + (charSum % 99) + '%';
  const mockTime = (charSum % 59) + 1 + (charSum % 2 === 0 ? 'm' : 'h'); // e.g. "12m" or "4h"

  const displayPrice = currentToken?.price?.replace('$', '') || mockPrice;
  const displayMcap = currentToken?.mcap?.replace('$', '') || mockMcap;
  const changeVal = currentToken?.change24h || `${mockChangeNum >= 0 ? '+' : ''}${mockChangeNum.toFixed(2)}%`;
  const isPositive = currentToken?.isPositive !== undefined ? currentToken.isPositive : mockChangeNum >= 0;
  const displayLiq = currentToken?.liquidity?.replace('$', '') || mockLiq;
  const displaySupply = currentToken?.supply || '1B';
  const displayTop10 = currentToken?.top10 || mockTop10;
  
  const rawAddress = currentToken?.mintAddress || `7hVVo${charSum}czBBsc2G9Xm`;
  const formattedAddress = rawAddress.length > 10 ? `${rawAddress.slice(0, 4)}...${rawAddress.slice(-4)}` : rawAddress;

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white overflow-hidden select-none relative">
      
      {/* ===================================================================== */}
      {/* 1. MOBILE NATIVE VIEW */}
      {/* ===================================================================== */}
      <div className="flex lg:hidden flex-col w-full h-full bg-[#0a0b0e] relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-4">
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
                {(userSolBalance || 99.60).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#0c0d10] flex justify-between items-start gap-4">
              <div className="flex gap-3 items-center min-w-0">
                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-[#121318] flex items-center justify-center text-xl shrink-0 shadow-inner">
                  {currentToken.imagePreview ? <img src={currentToken.imagePreview} className="w-full h-full object-cover" /> : (currentToken.icon || currentToken.symbol?.slice(0,2).toUpperCase())}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white truncate max-w-[120px]">{currentToken.name || currentToken.symbol}</span>
                    <span className="text-[9px] bg-[#1c1d24] text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">{currentToken.symbol}</span>
                  </div>
                  {/* FIXED TIME & CA */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium mt-1">
                    <span>{mockTime} ago</span>
                    <span>•</span>
                    <button onClick={() => handleCopyCA(rawAddress)} className="flex items-center gap-1 hover:text-white transition-colors relative">
                        <span className="tabular-nums tracking-tight">{formattedAddress}</span>
                        {copiedCA && <span className="absolute -top-6 left-0 bg-[#00f2a1] text-black px-1.5 py-0.5 rounded shadow z-50">Copied</span>}
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                className="flex flex-col items-end text-right mt-1 shrink-0 cursor-pointer group"
                onClick={() => setChartMode(chartMode === 'price' ? 'mcap' : 'price')}
              >
                <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5 group-hover:text-zinc-400 transition-colors">
                  <span>{chartMode === 'mcap' ? 'Market Cap' : 'Price'}</span>
                  <Repeat2 className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                </div>
                <span className="flex items-center text-lg font-black text-white transition-all tabular-nums tracking-tight">
                    <DexDollarIcon className="w-4 h-4 text-zinc-400 mr-[1px]" strokeWidth={3} />
                    {chartMode === 'mcap' ? displayMcap : displayPrice}
                </span>
                <span className={`text-xs font-black mt-0.5 tabular-nums tracking-tight ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {changeVal}
                </span>
              </div>
          </div>

          <div className="w-full h-[280px] bg-[#0e0f14] border-y border-white/5 relative flex flex-col shrink-0">
            <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">

               {/* Trench Timeframes */}
               <div className="flex items-center gap-1 bg-[#0a0b0e]/90 backdrop-blur border border-white/10 rounded-lg p-1 pointer-events-auto shadow-md">
                  {/* Now wired to activeTimeframe state just like desktop */}
                  {['1s', '1m', '5m', '15m', '1h', '4h'].map((tf) => (
                    <button 
                      key={tf} 
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        activeTimeframe === tf 
                          ? 'bg-[#1c1d24] text-white shadow-sm border border-white/10' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                  <span className="h-3 w-[1px] bg-white/10 mx-0.5" />
                  {/* Mobile Tap-to-Switch Button */}
                  <button
                    onClick={() => setChartMode(chartMode === 'price' ? 'mcap' : 'price')}
                    className="px-2 py-0.5 rounded text-[10px] font-black bg-white/10 text-[#00f2a1] hover:bg-white/15 transition-all flex items-center gap-1"
                  >
                    <span>{chartMode === 'price' ? 'Price' : 'MCap'}</span>
                    <span className="text-[9px] text-zinc-400">⟲</span>
                  </button>
                </div>
            </div>
            <div className="flex-1 w-full relative z-0">
               <TokenChart currentToken={currentToken} chartMode={chartMode} />
            </div>
          </div>

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

          <div className="flex-1 bg-[#0c0d10] p-4 min-h-[300px] flex flex-col">
            {mobileActivityTab === 'callouts' && typeof TokenCallouts !== 'undefined' && <TokenCallouts tokenSymbol={currentToken.symbol} />}
            {mobileActivityTab === 'holders' && typeof TokenHolders !== 'undefined' && <TokenHolders top10Percentage={currentToken.top10} />}
           {mobileActivityTab === 'about' && (
  <TokenAbout 
    currentToken={currentToken} 
    onOpenChat={() => setIsMobileChatOpen(true)} 
  />
)}
          </div>
        </div>

        <div className="shrink-0 bg-[#121318] border-t border-white/10 p-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),1rem)]">
          <button 
            onClick={() => setIsMobileTradeOpen(true)} 
            className="w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] bg-[#00f2a1] text-black shadow-[0_0_15px_rgba(0,242,161,0.3)] hover:opacity-90"
          >
            TRADE {currentToken?.symbol}
          </button>
        </div>

        {/* NATIVE LOCAL MOBILE DRAWER (Live AMM Math Injected) */}
        <div className={`fixed inset-0 z-[100] lg:hidden flex items-end transition-opacity duration-300 ${isMobileTradeOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileTradeOpen(false)} />
          <div className={`w-full bg-[#121318] border-t border-white/10 rounded-t-3xl p-5 relative z-10 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out pb-[max(env(safe-area-inset-bottom),1.25rem)] ${isMobileTradeOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-sm shrink-0 shadow-inner">
                  {currentToken.imagePreview ? <img src={currentToken.imagePreview} className="w-full h-full object-cover" /> : currentToken.icon}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{currentToken.symbol}</h3>
              </div>
              <button onClick={() => setIsMobileTradeOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-1.5 rounded-full"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-lg mb-3 shadow-inner">
              <button onClick={() => { setTradeMode('buy'); setTradeAmount(''); }} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow-sm' : 'text-zinc-500'}`}>Buy</button>
              <button onClick={() => { setTradeMode('sell'); setTradeAmount(''); }} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-sm' : 'text-zinc-500'}`}>Sell</button>
            </div>
            
            <div className="bg-[#050505] border border-white/5 rounded-lg px-4 py-3 mb-3 flex items-center justify-between shadow-inner focus-within:border-[#00f2a1]/50">
              <div className="flex flex-col flex-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Amount</span>
                <input type="text" inputMode="decimal" placeholder="0.0" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value.replace(/[^0-9.]/g, ''))} className="bg-transparent text-2xl font-black text-white w-full outline-none font-mono tracking-tight" />
              </div>
              <span className="text-xs font-black text-white font-mono bg-[#1a1b22] px-3 py-1.5 rounded-md">
                {tradeMode === 'buy' ? 'SOL' : currentToken.symbol}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                 Wallet: {tradeMode === 'buy' ? `${(userSolBalance || 0).toFixed(4)} SOL` : `0 ${currentToken.symbol}`}
               </span>
               <div className="flex gap-2">
                 <button onClick={handleHalfClick} className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-[10px] font-black text-zinc-300 shadow-sm uppercase">Half</button>
                 <button onClick={handleMaxClick} className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-[10px] font-black text-zinc-300 shadow-sm uppercase">Max</button>
               </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-[#0A0A0A] border border-white/5 rounded-xl mb-4 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">You Receive (Est.)</span>
                <span className={`text-xs font-black ${tradeMode === 'buy' ? 'text-[#089981]' : 'text-[#F23645]'}`}>≈ {estOutputText}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Impact</span>
                <span className="text-[10px] font-black text-zinc-400">~{estPriceImpact}%</span>
              </div>
            </div>
            
            {(userSolBalance || 0) < 0.005 && tradeMode === 'buy' ? (
              <button disabled className="w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed">
                Insufficient SOL for gas
              </button>
            ) : (
              <button 
                onClick={executeTokenTrade} 
                disabled={!cleanNumericAmount || isProcessing}
                className={`w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow-[0_0_15px_rgba(0,242,161,0.2)]' : 'bg-[#F23645] text-white shadow-[0_0_15px_rgba(242,54,69,0.2)]'}`}
              >
                {isProcessing ? 'Confirming...' : (tradeMode === 'buy' ? 'PLACE BUY ORDER' : 'EXECUTE SELL')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NATIVE LOCAL MOBILE CHAT DRAWER */}
      <div className={`fixed inset-0 z-[100] lg:hidden flex items-end transition-opacity duration-300 ${isMobileChatOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileChatOpen(false)} />
        <div className={`w-full h-[75vh] bg-[#121318] border-t border-white/10 rounded-t-3xl p-4 flex flex-col relative z-10 shadow-2xl transition-transform duration-300 ease-out ${isMobileChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 shrink-0" />
          <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2a1] animate-pulse" />
              {currentToken?.symbol} Trench Chat
            </h3>
            <button onClick={() => setIsMobileChatOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-1 rounded-full">
              <X className="w-4 h-4"/>
            </button>
          </div>
          <div className="flex-1 overflow-hidden pt-2">
            <TokenChat tokenSymbol={currentToken?.symbol} />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DESKTOP VIEW - LIVE AMM MATH INJECTED */}
      {/* ===================================================================== */}
      <div className="hidden lg:grid grid-cols-12 h-full gap-2 p-2 w-full">
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

          <div className="p-2.5 border-t border-white/5 bg-[#0a0b0e] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-zinc-500 font-bold">Portfolio Balance</span>
            <span className="flex items-center text-xs font-mono font-black text-[#00f2a1]">
              <DexDollarIcon className="w-3 h-3 mr-[1px]" strokeWidth={3} />
              {(userSolBalance || 99.60).toFixed(2)}
            </span>
          </div>
        </div>

        <div className={`${isSidebarOpen ? 'col-span-5 xl:col-span-6' : 'col-span-8 xl:col-span-9'} flex flex-col h-full gap-2 overflow-hidden transition-all duration-200`}>
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

              <div className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-sm font-black overflow-hidden shrink-0 ml-0.5 bg-gradient-to-br from-zinc-800 to-[#121318] text-white">
                {currentToken.imagePreview ? <img src={currentToken.imagePreview} alt={currentToken.symbol} className="w-full h-full object-cover" /> : (currentToken.icon || currentToken.symbol?.slice(0,2).toUpperCase())}
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
                {/* FIXED TIME, CA, & SOCIALS */}
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium mt-0.5">
                  <span>{mockTime}</span><span>•</span>
                  <button onClick={() => handleCopyCA(rawAddress)} className="flex items-center gap-1 hover:text-white transition-colors relative">
                    <span className="tabular-nums tracking-tight">{formattedAddress}</span>
                    {copiedCA && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f2a1] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-50">Copied!</span>}
                  </button>
                  <span className="text-zinc-700">|</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <a href={currentToken.website || "#"} className="hover:text-white transition-colors"><Globe className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.twitter || "#"} className="hover:text-white transition-colors"><XIcon className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.telegram || "#"} className="hover:text-white transition-colors"><TelegramIcon className="w-3.5 h-3.5"/></a>
                    <a href={`https://solscan.io/token/${rawAddress}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><SearchIcon className="w-3.5 h-3.5"/></a>
                  </div>
                </div>
              </div>
            </div>

            {/* FIXED METRICS: Real data + tabular-nums instead of font-mono */}
            <div className="flex items-center gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink whitespace-nowrap">
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Price</span>
                <span className="flex items-center justify-end text-sm font-black text-white tabular-nums tracking-tight">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {displayPrice}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Market Cap</span>
                <span className="flex items-center justify-end text-sm font-black text-white tabular-nums tracking-tight">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {displayMcap}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">24h Change</span>
                <span className={`text-sm font-black tabular-nums tracking-tight ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {changeVal}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Liquidity</span>
                <span className="flex items-center justify-end text-sm font-black text-white tabular-nums tracking-tight">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {displayLiq}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Supply</span>
                <span className="text-sm font-black text-white tabular-nums tracking-tight">{displaySupply}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Top 10</span>
                <span className="text-sm font-black text-amber-500 tabular-nums tracking-tight">{displayTop10}</span>
              </div>
            </div>
          </div>

         <div className="flex-1 min-h-0 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs text-zinc-400 font-medium shrink-0 bg-[#0a0b0e]">
              <div className="flex items-center gap-2">

                {/* Trench Timeframes */}
                <div className="flex items-center gap-1 bg-[#121318] p-0.5 rounded-lg border border-white/5 shadow-inner">
                  {['1s', '1m', '5m', '15m', '1h', '4h'].map((tf) => (
                    <button 
                      key={tf} 
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        activeTimeframe === tf 
                          ? 'bg-[#1c1d24] text-white shadow-sm border border-white/10' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <span className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

                {/* Desktop Dual Switch (Shows both Price and MCap at once) */}
                <div className="flex items-center bg-[#121318] p-0.5 rounded-lg border border-white/5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setChartMode('price')}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                      chartMode === 'price'
                        ? 'bg-[#00f2a1] text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('mcap')}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                      chartMode === 'mcap'
                        ? 'bg-[#00f2a1] text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    MCap
                  </button>
                </div>
              </div>

            </div>

            <div className="flex-1 min-h-0 w-full relative bg-[#0e0f14]">
               <TokenChart currentToken={currentToken} chartMode={chartMode} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (PERSISTENT BONDING CURVE + TABS) */}
        <div className="col-span-3 bg-[#121318] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
          
          <div className="p-3 border-b border-white/5 bg-[#0a0b0e] shrink-0 font-mono">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-zinc-400 font-semibold">Bonding Curve</span>
              <span className="text-[#00f2a1] font-bold">{currentToken?.bondingProgress ?? 72}%</span>
            </div>
            <div className="w-full bg-[#1c1d24] rounded-full h-1.5 overflow-hidden shadow-inner">
              <div 
                className="bg-[#00f2a1] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00f2a1]" 
                style={{ width: `${Math.min(currentToken?.bondingProgress ?? 72, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-zinc-500 mt-1.5">
              <span className="flex items-center">
                Graduate at <DexDollarIcon className="w-2.5 h-2.5 mx-0.5" strokeWidth={2}/> {currentToken?.targetMcap || '69k'} mcap
              </span>
              <span>{(currentToken?.bondingProgress ?? 72) >= 100 ? 'Graduated' : 'In Progress'}</span>
            </div>
          </div>

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
            <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-lg">
                <button onClick={() => { setTradeMode('buy'); setTradeAmount(''); }} className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow' : 'text-zinc-500 hover:text-white'}`}>Buy</button>
                <button onClick={() => { setTradeMode('sell'); setTradeAmount(''); }} className={`flex-1 py-1.5 text-xs font-black rounded-md transition-colors ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Sell</button>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1 px-1 uppercase tracking-wider">
                  <span>Amount to {tradeMode}</span>
                  <span>{tradeMode === 'buy' ? 'SOL' : currentToken.symbol}</span>
                </div>
                <div className="bg-[#0c0d10] border border-white/5 rounded-lg flex items-center px-3 py-2.5 focus-within:border-[#00f2a1]/50">
                  <input type="text" placeholder="0.0" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full bg-transparent outline-none text-xl font-mono font-black text-white placeholder-zinc-700" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                   Wallet: {tradeMode === 'buy' ? `${(userSolBalance || 0).toFixed(4)} SOL` : `0 ${currentToken.symbol}`}
                 </span>
                 <div className="flex gap-2">
                   <button onClick={handleHalfClick} className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 px-2 py-1 rounded-md text-[9px] font-black text-zinc-300 uppercase">Half</button>
                   <button onClick={handleMaxClick} className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 px-2 py-1 rounded-md text-[9px] font-black text-zinc-300 uppercase">Max</button>
                 </div>
              </div>

              <div className="flex flex-col gap-2 p-3 bg-[#0A0A0A] border border-white/5 rounded-xl shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">You Receive (Est.)</span>
                  <span className={`text-xs font-black ${tradeMode === 'buy' ? 'text-[#089981]' : 'text-[#F23645]'}`}>≈ {estOutputText}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Impact</span>
                  <span className="text-[10px] font-black text-zinc-400">~{estPriceImpact}%</span>
                </div>
              </div>

              {(userSolBalance || 0) < 0.005 && tradeMode === 'buy' ? (
                <button disabled className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed mt-auto">
                  Insufficient SOL
                </button>
              ) : (
                <button 
                  onClick={executeTokenTrade} 
                  disabled={!cleanNumericAmount || isProcessing}
                  className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-auto ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black hover:bg-[#00d990]' : 'bg-[#F23645] text-white hover:bg-[#e02a39]'}`}
                >
                  {isProcessing ? 'Confirming...' : (tradeMode === 'buy' ? 'PLACE BUY ORDER' : `SELL ${currentToken?.symbol}`)}
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* DESKTOP TABS (Strictly 4 Tabs) */}
              <div className="flex overflow-x-auto border-b border-white/5 bg-[#0a0b0e] shrink-0 [&::-webkit-scrollbar]:hidden">
                {[
                  { id: 'trades', label: 'Callouts' },
                  { id: 'holders', label: 'Holders' },
                  { id: 'chat', label: 'Chat' },
                  { id: 'about', label: 'About' }
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveHubTab(tab.id)} 
                    className={`flex-1 py-2.5 text-[11px] font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeHubTab === tab.id ? 'border-[#00f2a1] text-white bg-white/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* DESKTOP CONTENT RENDER */}
              <div className="flex-1 overflow-y-auto p-3 bg-[#0c0d10] custom-scrollbar">
                 {activeHubTab === 'trades' && typeof TokenCallouts !== 'undefined' && <TokenCallouts tokenSymbol={currentToken.symbol} />}
                 {activeHubTab === 'holders' && typeof TokenHolders !== 'undefined' && <TokenHolders top10Percentage={currentToken.top10} />}
                 {activeHubTab === 'chat' && typeof TokenChat !== 'undefined' && <TokenChat tokenSymbol={currentToken.symbol} />}
                 {activeHubTab === 'about' && typeof TokenAbout !== 'undefined' && <TokenAbout currentToken={currentToken} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}