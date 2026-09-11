import React, { useState, useEffect } from 'react';
import SidebarTokenRow from './SidebarTokenRow';
import { formatPhantomPrice } from '../utils/formatters';
import TokenChat from './TokenChat';
import TrackView from './TrackView';
import TokenCallouts from './TokenCallouts';
import TokenHolders from './TokenHolders';
import TokenAbout from './TokenAbout';
import TokenChart from './TokenChart';
import TokenTrades from './TokenTrades';
import ShareModal from './ShareModal';
import TokenMyTrades from './TokenMyTrades';
import TokenTopTraders from './TokenTopTraders';
import TradeWidget from './TradeWidget';
import { supabase } from '../supabaseClient';
import { useTrade } from '../hooks/useTrade';
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
// 1. The original flat icon (for clean white/grey text)
const SolIcon = ({ className = "w-2.5 h-2.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="currentColor">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
  </svg>
);

// 2. The gradient icon (specifically for the preset buttons)
const SolGradientIcon = ({ className = "w-2.5 h-2.5" }) => (
  <svg className={className} viewBox="0 0 351 304" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path d="M68.8093 9.40058C73.1895 1.83609 81.3323 0 89.9678 0H339.636C348.877 0 354.218 10.4284 348.71 17.8447L282.88 106.632C278.475 112.574 270.835 115.011 263.266 115.011H12.0125C2.6953 115.011 -2.63945 104.381 2.94697 96.9538L68.8093 9.40058Z" fill="url(#solana-gradient)"/>
    <path d="M282.882 197.368C278.475 191.426 270.835 188.989 263.268 188.989H12.0125C2.6953 188.989 -2.63945 199.619 2.94697 207.046L68.8095 294.599C73.1897 302.164 81.3325 304 89.968 304H339.638C348.878 304 354.219 293.572 348.711 286.155L282.882 197.368Z" fill="url(#solana-gradient)"/>
    <path d="M348.711 115.011C354.219 107.595 348.878 97.1661 339.638 97.1661H89.968C81.3325 97.1661 73.1897 99.0022 68.8095 106.567L2.94697 194.12C-2.63945 201.547 2.6953 212.177 12.0125 212.177H263.268C270.835 212.177 278.475 209.74 282.882 203.798L348.711 115.011Z" fill="url(#solana-gradient)"/>
  </svg>
);

// Copy Icon
const CopyIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
 
  // Desktop States
  const [leftTab, setLeftTab] = useState('Tokens');
  const [rightPanelMode, setRightPanelMode] = useState('swap'); 
  const [activeHubTab, setActiveHubTab] = useState('callouts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartMode, setChartMode] = useState('price'); // 'price' or 'mcap'
  const [activeTimeframe, setActiveTimeframe] = useState('15m');

// Mainnet Chart Data States
const [historicalTrades, setHistoricalTrades] = useState([]);
const [liveTrade, setLiveTrade] = useState(null);

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

// =========================================================================
// 🚀 SUPABASE OHLC CHART ENGINE
// =========================================================================
useEffect(() => {
  if (!currentToken) return;

  const fetchAndBuildChartData = async () => {
    try {
      // 1. Fetch real historical trades from your DB
      const { data: trades, error } = await supabase
        .from('trades')
        .select('*')
        // Checks both mintAddress and address depending on your token object structure
        .eq('token_mint', currentToken?.mintAddress || currentToken?.address || currentToken?.mint)
        .order('created_at', { ascending: true }); // Oldest first to draw left-to-right

      if (error) throw error;
      
      if (!trades || trades.length === 0) {
        setHistoricalTrades([]);
        return;
      }

      // 2. Aggregate raw trades into 1-minute Candles (OHLC)
      const ohlcMap = {};

      trades.forEach(trade => {
        const tradeTime = new Date(trade.created_at).getTime() / 1000;
        const minuteTimestamp = Math.floor(tradeTime / 60) * 60; // Round down to nearest minute
        
        const price = Number(trade.price || trade.usd_price || 0); // Adjust to match your DB column
        const volume = Number(trade.sol_amount || 0); // Adjust to match your DB column

        if (!ohlcMap[minuteTimestamp]) {
          ohlcMap[minuteTimestamp] = {
            time: minuteTimestamp,
            open: price,
            high: price,
            low: price,
            close: price,
            volume: volume
          };
        } else {
          ohlcMap[minuteTimestamp].high = Math.max(ohlcMap[minuteTimestamp].high, price);
          ohlcMap[minuteTimestamp].low = Math.min(ohlcMap[minuteTimestamp].low, price);
          ohlcMap[minuteTimestamp].close = price;
          ohlcMap[minuteTimestamp].volume += volume;
        }
      });

      // 3. Convert map to sorted array and feed the chart
      const formattedHistory = Object.values(ohlcMap).sort((a, b) => a.time - b.time);
      setHistoricalTrades(formattedHistory);

    } catch (err) {
      console.error("Error building chart history:", err);
    }
  };

  fetchAndBuildChartData();
}, [currentToken]); // Re-runs instantly if the user clicks a different token

// =========================================================================
// 🚀 SUPABASE REAL-TIME WEBSOCKET (LIVE TRADES)
// =========================================================================
useEffect(() => {
  if (!currentToken) return;

  const mintAddress = currentToken?.mintAddress || currentToken?.address || currentToken?.mint;

  // Subscribe to real-time inserts on the 'trades' table
  const channel = supabase
    .channel(`live-trades-${mintAddress}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'trades',
        filter: `token_mint=eq.${mintAddress}`
      },
      (payload) => {
        console.log('🚨 NEW LIVE TRADE DETECTED!', payload.new);
        
        // Instantly pass the new trade to the chart's live tick prop
        setLiveTrade({
          price: Number(payload.new.price || payload.new.usd_price || 0),
          volume: Number(payload.new.sol_amount || 0)
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel); // Clean up the connection when leaving the token page
  };
}, [currentToken]);

// 🚀 TRADE EXECUTION HOOK & HANDLER
  const { executeTradeOnChain, isProcessing } = useTrade();

  const handleTradeSubmit = async () => {
    const mint = currentToken?.mintAddress || currentToken?.address || currentToken?.mint;
    return await executeTradeOnChain(
      tradeMode,
      tradeAmount,
      mint,
      currentToken?.creatorAddress,
      null,
      currentToken?.isGraduated,
      currentToken?.solInCurve || 0
    );
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
  const mockVol = ((charSum % 85) + 15) + '.' + (charSum % 9) + 'K'; // NEW: Volume
  const mockTop10 = ((charSum % 30) + 40) + '.' + (charSum % 99) + '%';
  const mockTime = (charSum % 59) + 1 + (charSum % 2 === 0 ? 'm' : 'h');

  const displayPrice = currentToken?.price?.replace('$', '') || mockPrice;
  const displayMcap = currentToken?.mcap?.replace('$', '') || mockMcap;
  const changeVal = currentToken?.change24h || `${mockChangeNum >= 0 ? '+' : ''}${mockChangeNum.toFixed(2)}%`;
  const isPositive = currentToken?.isPositive !== undefined ? currentToken.isPositive : mockChangeNum >= 0;
  const displayLiq = currentToken?.liquidity?.replace('$', '') || mockLiq;
  const displayVol = currentToken?.vol24h?.replace('$', '') || mockVol; // NEW: Volume
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
          <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0c0d10] sticky top-0 z-30">
            {/* Back Button */}
            <button
              onClick={() => {
                if (typeof handleSidebarNavigation === 'function') handleSidebarNavigation('home');
                else if (typeof setActivePage === 'function') setActivePage('home');
              }}
              className="text-zinc-400 hover:text-white flex items-center gap-1 p-1 bg-[#13141a] rounded-lg border border-white/5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Right Side: Portfolio Balance + Share/Star Icons */}
            <div className="flex items-center gap-3">
              {/* 🚀 MOBILE ACTIVE TOKEN BAG */}
            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors cursor-pointer">
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Bag:</span>
              
              {/* USD Value First with Custom Icon */}
              <span className="flex items-center text-xs font-black text-[#00f2a1]">
                <DexDollarIcon className="w-3 h-3 mr-[1px]" strokeWidth={3} />
                {((typeof userTokenBalance !== 'undefined' ? userTokenBalance : 0) * (typeof curveState !== 'undefined' ? curveState?.price || 0 : 0)).toFixed(2)}
              </span>

              {/* Quantity & Dynamic Symbol Second */}
              <span className="text-xs font-black text-white">
                ({(typeof userTokenBalance !== 'undefined' ? userTokenBalance : 0).toLocaleString()} 
                <span className="text-zinc-400 ml-1">{currentToken?.symbol || 'TKN'}</span>)
              </span>
            </div>

              {/* Share & Favorite Buttons in Top Bar */}
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-1.5 bg-[#171820] hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Share Card"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                </button>
                
                <button 
                  onClick={() => handleToggleFollow(currentToken)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isFollowing ? 'bg-[#00f2a1]/20 text-[#00f2a1]' : 'bg-[#171820] hover:bg-white/10 text-zinc-400 hover:text-white'}`}
                  title="Favorite Token"
                >
                  <svg className="w-3.5 h-3.5" fill={isFollowing ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.18-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </button>
              </div>
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

                {/* FIXED TIME, CA, & MOBILE SOCIALS (For Screenshots) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] text-zinc-500 font-medium mt-1">
                    <div className="flex items-center gap-1.5">
                      <span>{mockTime}</span>
                      <span>•</span>
                      <button onClick={() => handleCopyCA(rawAddress)} className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors relative group">
                          <span className="tabular-nums tracking-tight group-hover:text-[#00f2a1] transition-colors">{formattedAddress}</span>
                          <CopyIcon className="w-2.5 h-2.5 group-hover:text-[#00f2a1] transition-colors" />
                          {copiedCA && <span className="absolute -top-6 left-0 bg-[#00f2a1] text-black px-1.5 py-0.5 rounded shadow z-50">Copied</span>}
                      </button>
                    </div>
                    
                    {/* Socials - Visible right on the main chart view! */}
                    <span className="text-zinc-700 hidden sm:inline">|</span>
                    <div className="flex items-center gap-2.5 text-zinc-400 ml-0.5">
                      <a href={currentToken.website || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.website && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><Globe className="w-3 h-3"/></a>
                      <a href={currentToken.twitter || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.twitter && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><XIcon className="w-3 h-3"/></a>
                      <a href={currentToken.telegram || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.telegram && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><TelegramIcon className="w-3 h-3"/></a>
                      <a href={`https://solscan.io/token/${rawAddress}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-pointer"><SearchIcon className="w-3 h-3"/></a>
                    </div>
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
              <TokenChart 
              currentToken={currentToken} 
              chartMode={chartMode}
              historicalData={historicalTrades} 
              liveTradeTick={liveTrade} 
              />
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

           {/* ========================================================================= */}
          {/* ACTIVITY TABS */}
          {/* ========================================================================= */}
          <div className="flex border-b border-white/5 bg-[#0a0b0e] sticky top-[60px] z-20 shadow-md">
            {[
              { id: 'callouts', label: 'Callouts' },  // 🚀 MOVED TO FIRST
              { id: 'trades', label: 'Trades' },      // 🚀 MOVED TO SECOND
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

          {/* TAB CONTENT */}
          <div className="flex-1 bg-[#0c0d10] p-4 min-h-[300px] flex flex-col">
            {mobileActivityTab === 'trades' && <TokenTrades currentToken={currentToken} />}
            {mobileActivityTab === 'callouts' && <TokenCallouts tokenSymbol={currentToken?.symbol} />}
            {mobileActivityTab === 'holders' && <TokenHolders top10Percentage={displayTop10} />}
            {mobileActivityTab === 'about' && (
              <TokenAbout 
                currentToken={currentToken} 
                onOpenChat={() => setIsMobileChatOpen(true)} 
              />
            )}
          </div>
        </div> {/* <--- RESTORED: THIS CLOSES THE MAIN PAGE CONTAINER FROM LINE 258 */}

        {/* ========================================================================= */}
        {/* BOTTOM TRADE BUTTON */}
        {/* ========================================================================= */}
        <div className="shrink-0 bg-[#121318] border-t border-white/10 p-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),1rem)]">
          <button 
            onClick={() => setIsMobileTradeOpen(true)} 
            className="w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] bg-[#00f2a1] text-black shadow-[0_0_15px_rgba(0,242,161,0.3)] hover:opacity-90"
          >
            TRADE {currentToken?.symbol}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. NATIVE LOCAL MOBILE TRADE DRAWER (iOS Swipe-to-Dismiss Enabled)       */}
        {/* ========================================================================= */}
        <div className={`fixed inset-0 z-[100] lg:hidden flex items-end transition-opacity duration-300 ${isMobileTradeOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileTradeOpen(false)} />
          <div 
            id="mobile-trade-drawer"
            className={`w-full bg-[#121318] border-t border-white/10 rounded-t-3xl p-5 relative z-10 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out pb-[max(env(safe-area-inset-bottom),1.25rem)] ${isMobileTradeOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {/* DRAG HANDLE */}
            <div 
              className="w-full flex flex-col items-center pb-5 cursor-grab active:cursor-grabbing shrink-0 relative z-50 lg:hidden"
              onTouchStart={(e) => {
                const drawer = document.getElementById('mobile-trade-drawer');
                if (!drawer) return;
                drawer.dataset.startY = e.touches[0].clientY;
                drawer.style.transitionDuration = '0ms'; 
              }}
              onTouchMove={(e) => {
                const drawer = document.getElementById('mobile-trade-drawer');
                if (!drawer) return;
                const startY = parseFloat(drawer.dataset.startY);
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                if (deltaY > 0) {
                  drawer.style.transform = `translateY(${deltaY}px)`;
                }
              }}
              onTouchEnd={(e) => {
                const drawer = document.getElementById('mobile-trade-drawer');
                if (!drawer) return;
                const startY = parseFloat(drawer.dataset.startY);
                const endY = e.changedTouches[0].clientY;
                const deltaY = endY - startY;
                drawer.style.transitionDuration = '300ms'; 
                if (deltaY > 120) {
                  drawer.style.transform = ''; 
                  setIsMobileTradeOpen(false);
                } else {
                  drawer.style.transform = 'translateY(0px)';
                  setTimeout(() => { if (drawer) drawer.style.transform = ''; }, 300);
                }
              }}
            >
              <div className="absolute -top-4 left-0 w-full h-12" />
              <div className="w-12 h-1.5 bg-white/20 rounded-full relative pointer-events-none" />
            </div>
            
            {/* DRAWER HEADER */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-sm shrink-0 shadow-inner">
                  {currentToken?.imagePreview ? <img src={currentToken.imagePreview} className="w-full h-full object-cover" /> : currentToken?.icon}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">TRADE {currentToken?.symbol}</h3>
              </div>
              <button onClick={() => setIsMobileTradeOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-1.5 rounded-full"><X className="w-4 h-4"/></button>
            </div>
            
            {/* 🚀 UNIVERSAL PRO TRADE WIDGET INJECTED HERE */}
            <div className="w-full">
              <TradeWidget 
  displayToken={currentToken}
  tradeMode={tradeMode}
  setTradeMode={setTradeMode}
  tradeAmount={tradeAmount}
  setTradeAmount={setTradeAmount}
  userBalanceSol={typeof userSolBalance !== 'undefined' ? userSolBalance : 0}
  userTokenBalance={typeof userTokenBalance !== 'undefined' ? userTokenBalance : 0}
  handleExecuteTrade={handleTradeSubmit}
  isProcessing={isProcessing}
  curveState={currentToken}
/>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. NATIVE LOCAL MOBILE CHAT DRAWER */}
        {/* ========================================================================= */}
        <div className={`fixed inset-0 z-[200] lg:hidden transition-opacity duration-300 ${isMobileChatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileChatOpen(false)} />
          <div 
            id="mobile-chat-drawer"
            className={`absolute bottom-0 left-0 w-full h-[100dvh] bg-[#0c0d10] rounded-t-3xl pt-2 pb-0 flex flex-col z-10 transition-transform duration-300 ${isMobileChatOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {/* DRAG HANDLE */}
            <div 
              className="w-full flex flex-col items-center py-2 pb-4 cursor-grab active:cursor-grabbing shrink-0 relative z-50"
              onTouchStart={(e) => {
                const drawer = document.getElementById('mobile-chat-drawer');
                if (!drawer) return;
                drawer.dataset.startY = e.touches[0].clientY;
                drawer.style.transitionDuration = '0ms'; 
              }}
              onTouchMove={(e) => {
                const drawer = document.getElementById('mobile-chat-drawer');
                if (!drawer) return;
                const startY = parseFloat(drawer.dataset.startY);
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                if (deltaY > 0) {
                  drawer.style.transform = `translateY(${deltaY}px)`;
                }
              }}
              onTouchEnd={(e) => {
                const drawer = document.getElementById('mobile-chat-drawer');
                if (!drawer) return;
                const startY = parseFloat(drawer.dataset.startY);
                const endY = e.changedTouches[0].clientY;
                const deltaY = endY - startY;
                drawer.style.transitionDuration = '300ms'; 
                if (deltaY > 150) {
                  drawer.style.transform = ''; 
                  setIsMobileChatOpen(false);
                } else {
                  drawer.style.transform = 'translateY(0px)';
                  setTimeout(() => { if (drawer) drawer.style.transform = ''; }, 300);
                }
              }}
            >
              <div className="absolute top-0 left-0 w-full h-12" />
              <div className="w-16 h-1.5 bg-white/20 rounded-full relative pointer-events-none" />
            </div>

            <div className="flex-1 w-full overflow-hidden flex flex-col rounded-t-2xl bg-[#050505]">
              <TokenChat 
                token={currentToken} 
                onBack={() => setIsMobileChatOpen(false)} 
                userBalance={userSolBalance} 
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHARE MODAL OVERLAY */}
        {/* ========================================================================= */}
        {isShareModalOpen && (
          <ShareModal currentToken={currentToken} onClose={() => setIsShareModalOpen(false)} />
        )}

     {/* RESTORED: THESE CLOSING TAGS FIX YOUR ENTIRE PAGE CRASH */}
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

            {/* DESKTOP ACTIVE TOKEN BAG */}
          <div className="p-3 border-t border-white/5 bg-[#0a0b0e] flex justify-between items-center shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-10">
            <div className="flex flex-col">
             <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-1">
              My Bag
              </span>
              {/* 🚀 USD Value First */}
              <span className="flex items-center text-sm font-black text-[#00f2a1]">
                <DexDollarIcon className="w-3.5 h-3.5 mr-[2px]" strokeWidth={3} />
                {((typeof userTokenBalance !== 'undefined' ? userTokenBalance : 0) * (typeof curveState !== 'undefined' ? curveState?.price || 0 : 0)).toFixed(2)}
              </span>
            </div>
            
            {/* Token Quantity & Image Second */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {(typeof userTokenBalance !== 'undefined' ? userTokenBalance : 0).toLocaleString()} {currentToken?.symbol || 'TKN'}
              </span>
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                {currentToken?.image ? (
                  <img src={currentToken.image} alt="token" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[8px]">🪙</span>
                )}
              </div>
            </div>
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
                  <span>{mockTime}</span>
                  <span>•</span>
                  <button onClick={() => handleCopyCA(rawAddress)} className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors relative group">
                    <span className="tabular-nums tracking-tight group-hover:text-[#00f2a1] transition-colors">{formattedAddress}</span>
                    <CopyIcon className="w-2.5 h-2.5 group-hover:text-[#00f2a1] transition-colors" />
                    {copiedCA && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f2a1] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-50">Copied!</span>}
                  </button>
                  <span className="text-zinc-700 mx-1">|</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <a href={currentToken.website || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.website && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><Globe className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.twitter || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.twitter && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><XIcon className="w-3.5 h-3.5"/></a>
                    <a href={currentToken.telegram || "#"} target="_blank" rel="noreferrer" onClick={(e) => !currentToken.telegram && e.preventDefault()} className="hover:text-white transition-colors cursor-pointer"><TelegramIcon className="w-3.5 h-3.5"/></a>
                    <a href={`https://solscan.io/token/${rawAddress}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-pointer"><SearchIcon className="w-3.5 h-3.5"/></a>
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
              {/* NEW: 24H Volume */}
              <div className="text-right shrink-0">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">24h Vol</span>
                <span className="flex items-center justify-end text-sm font-black text-white tabular-nums tracking-tight">
                  <DexDollarIcon className="w-3.5 h-3.5 text-zinc-400 mr-[1px]" strokeWidth={3} />
                  {displayVol}
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

         {/* ======================================================= */}
          {/* SCROLLABLE MIDDLE SECTION (CHART + TABS) */}
          {/* ======================================================= */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
               {/* 1. CHART CONTAINER (Perfect height to keep tabs above the fold) */}
              <div className="h-[50vh] min-h-[380px] shrink-0 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden relative">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs text-zinc-400 font-medium shrink-0 bg-[#0a0b0e]">
                <div className="flex items-center gap-2">
                  
                  {/* Trench Timeframes */}
                  <div className="flex items-center gap-1 bg-[#121318] p-0.5 rounded-lg border border-white/5 shadow-inner">
                    {['1s', '1m', '5m', '15m', '1h', '4h'].map((tf) => (
                      <button 
                        key={tf} 
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
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

                  {/* Desktop Dual Switch */}
                  <div className="flex items-center bg-[#121318] p-0.5 rounded-lg border border-white/5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setChartMode('price')}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        chartMode === 'price' ? 'bg-[#00f2a1] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode('mcap')}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        chartMode === 'mcap' ? 'bg-[#00f2a1] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      MCap
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 w-full relative bg-[#0e0f14]">
                <TokenChart 
                currentToken={currentToken} 
                chartMode={chartMode}
                historicalData={historicalTrades} 
                liveTradeTick={liveTrade} 
                />
              </div>
            </div>

            {/* 2. MARKET HUB TABS CARD (Sits naturally below the chart) */}
            <div className="min-h-[600px] shrink-0 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden">
               {/* Expanded Tab Navigation */}
          <div className="flex items-center justify-around w-full border-b border-white/5 bg-[#0a0b0e] shrink-0 overflow-x-auto scrollbar-hide px-2">
            {[
              { id: 'callouts', label: 'Callouts' },
              { id: 'trades', label: 'Trades' },
              { id: 'my_trades', label: 'My Trades' },
              { id: 'top_traders', label: 'Top Traders' },
              { id: 'holders', label: 'Holders' },
              { id: 'about', label: 'About' },
              { id: 'chat', label: 'Chat' } 
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveHubTab(tab.id)}
                className={`py-3.5 px-3 text-[10px] xl:text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap relative shrink-0 ${
                  activeHubTab === tab.id
                    ? 'text-[#00f2a1]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
                {activeHubTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f2a1] shadow-[0_0_8px_rgba(0,242,161,0.5)]" />
                )}
              </button>
            ))}
          </div>

              {/* Tab Content Rendering */}
              <div className="flex-1 overflow-y-auto bg-[#0c0d10] custom-scrollbar">
                {activeHubTab === 'trades' && typeof TokenTrades !== 'undefined' && <TokenTrades currentToken={currentToken} />}
                {activeHubTab === 'my_trades' && typeof TokenMyTrades !== 'undefined' && <TokenMyTrades currentToken={currentToken} />}
                {activeHubTab === 'top_traders' && typeof TokenTopTraders !== 'undefined' && <TokenTopTraders currentToken={currentToken} />}
                {activeHubTab === 'callouts' && typeof TokenCallouts !== 'undefined' && <TokenCallouts tokenSymbol={currentToken?.symbol} />}
                {activeHubTab === 'holders' && typeof TokenHolders !== 'undefined' && <TokenHolders top10Percentage={displayTop10} />}
                {activeHubTab === 'about' && typeof TokenAbout !== 'undefined' && <TokenAbout currentToken={currentToken} />}
                
                {/* NEW CHAT TAB RENDER */}
                {activeHubTab === 'chat' && typeof TokenChat !== 'undefined' && (
                  <TokenChat 
                    token={currentToken} 
                    userBalance={userSolBalance} 
                  />
                )}
              </div>
            </div>

          </div>
        </div>

    {/* ===================================================================== */}
        {/* RIGHT SIDEBAR (DEDICATED EXECUTION ZONE) */}
        {/* ===================================================================== */}
        <div className="col-span-3 bg-[#121318] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
          
          {/* BONDING CURVE (Fixed Top) */}
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

          {/* SCROLLABLE SWAP WIDGET (Button is now unpinned inside here) */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1 bg-[#1a1b22] p-1 rounded-xl shrink-0">
              <button 
                type="button"
                onClick={() => { setTradeMode('buy'); setTradeAmount(''); }} 
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-colors cursor-pointer ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black shadow' : 'text-zinc-500 hover:text-white'}`}
              >
                Buy
              </button>
              <button 
                type="button"
                onClick={() => { setTradeMode('sell'); setTradeAmount(''); }} 
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-colors cursor-pointer ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow' : 'text-zinc-500 hover:text-white'}`}
              >
                Sell
              </button>
            </div>

            <div className="shrink-0">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1.5 px-1 uppercase tracking-wider">
                <span>Amount</span>
              </div>
              
              {/* Clean Input Field (Forced standard font to kill the slashed zero) */}
              <div className="bg-[#0c0d10] border border-white/5 rounded-xl flex items-center px-4 py-3.5 focus-within:border-[#00f2a1]/50 transition-colors shadow-inner">
                <input 
                  type="text" 
                  placeholder="0.0" 
                  value={tradeAmount} 
                  onChange={(e) => setTradeAmount(e.target.value.replace(/[^0-9.]/g, ''))} 
                  className="w-full bg-transparent outline-none text-2xl font-black text-white placeholder-zinc-700 font-sans normal-nums" 
                />
                <div className="flex items-center gap-2 pl-4 border-l border-white/10 shrink-0">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-black/50 overflow-hidden shrink-0">
                    {/* Flat icon perfectly colored white */}
                    {tradeMode === 'buy' ? <SolIcon className="w-3 h-3 text-white" /> : <img src={currentToken.imagePreview} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <span className="text-sm font-black text-white">{tradeMode === 'buy' ? 'SOL' : currentToken.symbol}</span>
                </div>
              </div>

              {/* THE 6-BUTTON PRESET GRID */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[0.1, 0.25, 0.5, 1, 5].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTradeAmount(amt.toString())}
                    className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 hover:border-white/20 py-2.5 rounded-lg text-[11px] font-black text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {amt} 
                    {/* Changed from green to clean solid grey */}
                    <SolIcon className="w-2.5 h-2.5 text-zinc-400" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="bg-[#1a1b22] border border-white/5 hover:bg-white/10 hover:border-white/20 py-2.5 rounded-lg text-[11px] font-black text-zinc-300 transition-colors cursor-pointer shadow-sm"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Wallet Row */}
            <div className="flex justify-between items-center px-1 shrink-0 mt-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Wallet Balance
              </span>
              <span className="text-[11px] font-black text-white flex items-center gap-1">
                {tradeMode === 'buy' ? (
                  /* Changed to text-white to completely remove the green */
                  <><SolIcon className="w-3 h-3 text-white" /> {(userSolBalance || 0).toFixed(4)}</>
                ) : (
                  `0 ${currentToken.symbol}`
                )}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3.5 bg-[#0A0A0A] border border-white/5 rounded-xl shadow-inner shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">You Receive (Est.)</span>
                <span className={`text-xs font-black ${tradeMode === 'buy' ? 'text-[#00f2a1]' : 'text-[#F23645]'}`}>≈ {estOutputText}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Impact</span>
                <span className="text-[10px] font-black text-zinc-400">~{estPriceImpact}%</span>
              </div>
            </div>

            {/* ACTION BUTTON (Unpinned, Slimmer, placed naturally at the end) */}
            <div className="pt-2 shrink-0 mb-4">
              {(userSolBalance || 0) < 0.005 && tradeMode === 'buy' ? (
                <button disabled className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-sm">
                  Insufficient SOL
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={executeTokenTrade} 
                  disabled={!cleanNumericAmount || isProcessing} 
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer ${tradeMode === 'buy' ? 'bg-[#00f2a1] text-black hover:bg-[#00d990]' : 'bg-[#F23645] text-white hover:bg-[#e02a39]'}`}
                >
                  {isProcessing ? 'Confirming...' : (tradeMode === 'buy' ? 'PLACE BUY ORDER' : `SELL ${currentToken?.symbol}`)}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}