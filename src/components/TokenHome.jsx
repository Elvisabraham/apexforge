import React, { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, AreaSeries } from 'lightweight-charts';

export default function TokenHome({ token, onBack, onTradeClick, onOpenProfile, onOpenChat, onOpenLiveModal }) {
  const chartContainerRef = useRef(null);
  const [chartTimeframe, setChartTimeframe] = useState('1d');
  const [chartType, setChartType] = useState('area'); 
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReported, setIsReported] = useState(false);
  
  // Modals & Filters
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [tradeFilter, setTradeFilter] = useState('all'); // 'all' | 'buys' | 'sells' | 'whales'
  
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [reportReason, setReportReason] = useState('');
  
  const [isFollowing, setIsFollowing] = useState(false);

  // Copy States
  const [headerCopied, setHeaderCopied] = useState(false);
  const [bodyCopied, setBodyCopied] = useState(false);

  // 🚀 SAFETY REDIRECT EFFECT: Auto-exit with 500ms Rescue Timer
  useEffect(() => {
    const isInvalid = !token || !token.name || token.name === 'Unknown Token' || (!token.symbol && !token.id);
    if (isInvalid) {
      // Clear stuck fallback state from localStorage
      localStorage.removeItem('apex_mock_state_TKN');
      localStorage.removeItem('apex_mock_state_TKN_trades');
      localStorage.removeItem('apex_active_token');
      localStorage.removeItem('apex_current_view');

      // Try smooth SPA exit first
      if (typeof onBack === 'function') {
        onBack();
      }

      // If the app is frozen and this component hasn't unmounted after 500ms, force a hard exit to the root origin!
      const rescueTimer = setTimeout(() => {
        window.location.href = window.location.origin;
      }, 500);

      return () => clearTimeout(rescueTimer); // Clears the timer if the smooth exit works
    }
  }, [token, onBack]);

  // 🚀 EARLY NULL GUARD: Prevents rendering the "Unknown Token" ghost UI
  if (!token || (!token.name && !token.symbol && !token.id) || token.name === 'Unknown Token') {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#0A0A0B] text-white p-6 text-center z-[200] absolute inset-0">
        <div className="w-8 h-8 border-2 border-[#089981] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Returning to Home Feed...</p>
      </div>
    );
  }

  // DATA ENGINE
  const rawProgress = token?.progress || 0;
  const initialMcap = parseFloat((token?.mcap || token?.marketCap || '$10.0K').replace(/[^0-9.]/g, ''));
  const isActuallyGraduated = token?.isGraduated === true || rawProgress >= 100 || initialMcap >= 69;

  const displayToken = {
    name: token?.name || token?.token || 'Token',
    symbol: token?.symbol || 'TKN',
    change: token?.change || '+0.0%',
    icon: token?.icon || '🪙',
    imagePreview: token?.imagePreview || token?.image || null, 
    mintAddress: token?.mintAddress || '8AVmX9aQwZoonSolanaNet11oHEZforge',
    description: token?.description || `A community-driven asset deployed fairly on the Apex Forge platform. Smart contract initialized.`,
    links: { twitter: token?.links?.twitter || '', telegram: token?.links?.telegram || '', website: token?.links?.website || '' },
    creator: 'ApexDeployer_0x1',
    holders: '1,204',
    supply: '1.0B',
    createdTime: 'Just now',
    isGraduated: isActuallyGraduated,
    progress: rawProgress
  };

  const localCacheKey = `apex_mock_state_${displayToken.symbol}`;
  const initialBasePrice = parseFloat(token?.price || '0.0000100');

  const [curveState, setCurveState] = useState(() => {
    const cached = localStorage.getItem(localCacheKey);
    if (cached) return JSON.parse(cached).curveState;
    return { price: initialBasePrice, mcap: initialMcap, progress: displayToken.progress, solInCurve: (displayToken.progress / 100) * 85 };
  });

  const [userBalanceSol, setUserBalanceSol] = useState(() => {
    const cached = localStorage.getItem(localCacheKey);
    if (cached) return JSON.parse(cached).userBalanceSol;
    return 4.50; 
  });

  const [userTokenBalance, setUserTokenBalance] = useState(() => {
    const cached = localStorage.getItem(localCacheKey);
    if (cached) return JSON.parse(cached).userTokenBalance;
    return 0;
  });

  // Persistent Trades Logic
  const [recentTrades, setRecentTrades] = useState(() => {
    const cachedTrades = localStorage.getItem(`${localCacheKey}_trades`);
    if (cachedTrades) return JSON.parse(cachedTrades);
    return [
      { id: 1, type: 'buy', amountToken: '25.0M', amountSol: '1.85', price: `$${initialBasePrice.toFixed(7)}`, time: '5m ago', user: 'Whale_0x', txHash: '5K2a...9x1Z' },
      { id: 2, type: 'sell', amountToken: '12.4M', amountSol: '0.85', price: `$${initialBasePrice.toFixed(7)}`, time: '28m ago', user: 'sold', txHash: '3F1b...8y2Y' },
      { id: 3, type: 'buy', amountToken: '2.1M', amountSol: '0.15', price: `$${initialBasePrice.toFixed(7)}`, time: '31m ago', user: 'bought', txHash: '9L4c...1z3W' },
      { id: 4, type: 'buy', amountToken: '18.0M', amountSol: '1.25', price: `$${(initialBasePrice * 0.98).toFixed(7)}`, time: '45m ago', user: 'AlphaTrader', txHash: '2M8d...4w5V' },
      { id: 5, type: 'sell', amountToken: '1.2M', amountSol: '0.08', price: `$${(initialBasePrice * 0.95).toFixed(7)}`, time: '1h ago', user: 'sold', txHash: '7P3e...6v7U' },
      { id: 6, type: 'buy', amountToken: '15.0M', amountSol: '1.10', price: `$${(initialBasePrice * 0.92).toFixed(7)}`, time: '2h ago', user: 'bought', txHash: '4R9f...2u8T' },
    ];
  });

  useEffect(() => {
    if (displayToken.symbol !== 'TKN') {
      localStorage.setItem(localCacheKey, JSON.stringify({ curveState, userBalanceSol, userTokenBalance }));
    }
  }, [curveState, userBalanceSol, userTokenBalance, localCacheKey, displayToken.symbol]);

  useEffect(() => {
    if (displayToken.symbol !== 'TKN') {
      localStorage.setItem(`${localCacheKey}_trades`, JSON.stringify(recentTrades));
    }
  }, [recentTrades, localCacheKey, displayToken.symbol]);

  const dynamicPriceImpact = tradeAmount && parseFloat(tradeAmount) > 0 
    ? (parseFloat(tradeAmount) * (tradeMode === 'buy' ? 0.12 : 0.08)).toFixed(2) 
    : '0.00';

  const isPositive = displayToken.change.includes('+') || parseFloat(displayToken.change) >= 0;
  const trendColorHex = isPositive ? '#089981' : '#F23645'; 
  const trendBgColor = isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'; 
  const trendTextColor = isPositive ? 'text-[#089981]' : 'text-[#F23645]';

  const timeframeLabels = { '15m': 'Past 15 mins', '1h': 'Past hour', '4h': 'Past 4 hours', '1d': 'Today', 'MAX': 'All time' };

  const getShortCA = (address) => {
    if (!address || typeof address !== 'string') return '8AVm...forge';
    return `${address.slice(0, 4)}...${address.slice(-5)}`;
  };
  const shortCA = getShortCA(displayToken.mintAddress);

  const formatProPrice = (val) => {
    if (!val && val !== 0) return '';
    const str = val.toString();
    if (str.startsWith('$')) return <><span className="font-bold mr-[2px]">$</span>{str.slice(1)}</>;
    return str;
  };

  const handleExecuteTrade = () => {
    const amount = parseFloat(tradeAmount);
    if (!amount || amount <= 0) return;
    
    const randomTxHash = `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`;

    if (tradeMode === 'buy') {
      if (amount > userBalanceSol) return;

      const platformFeePercent = displayToken.isGraduated ? 0.005 : 0; 
      const feeAmount = amount * platformFeePercent;
      const netSolAmount = amount - feeAmount;

      const currentPrice = curveState.price;
      const tokensReceived = (netSolAmount / currentPrice) / 1000000; 

      let newProgress = curveState.progress;
      let newSolInCurve = curveState.solInCurve;
      
      if (!displayToken.isGraduated) {
        newSolInCurve = curveState.solInCurve + netSolAmount;
        newProgress = Math.min(100, (newSolInCurve / 85) * 100); 
      }

      const pricePumpFactor = 1 + (netSolAmount * 0.05); 
      const newPrice = currentPrice * pricePumpFactor;
      const newMcap = curveState.mcap * pricePumpFactor;

      setUserBalanceSol(prev => prev - amount);
      setUserTokenBalance(prev => prev + (tokensReceived * 1000000));
      setCurveState({ price: newPrice, mcap: newMcap, progress: newProgress.toFixed(1), solInCurve: newSolInCurve });

      setRecentTrades(prev => [{
        id: Date.now(), 
        type: 'buy', 
        amountToken: `${tokensReceived.toFixed(1)}M`, 
        amountSol: netSolAmount.toFixed(2), 
        price: `$${newPrice.toFixed(7)}`, 
        time: 'Just now', 
        user: 'You',
        txHash: randomTxHash
      }, ...prev].slice(0, 50));

      if (displayToken.isGraduated) {
          alert(`Jupiter API BUY Executed on Raydium! \n\nFee collected for Treasury: ${feeAmount.toFixed(4)} SOL (0.5%)`);
      }

    } else if (tradeMode === 'sell') {
      const tokenQuantity = amount * 1000000;
      if (tokenQuantity > userTokenBalance) return;

      const currentPrice = curveState.price;
      const grossSolReceived = (tokenQuantity * currentPrice);
      
      const platformFeePercent = displayToken.isGraduated ? 0.005 : 0; 
      const feeAmount = grossSolReceived * platformFeePercent;
      const netSolReceived = grossSolReceived - feeAmount;

      let newProgress = curveState.progress;
      let newSolInCurve = curveState.solInCurve;

      if (!displayToken.isGraduated) {
        newSolInCurve = Math.max(0, curveState.solInCurve - grossSolReceived);
        newProgress = Math.max(0, (newSolInCurve / 85) * 100); 
      }

      const priceDumpFactor = 1 - (grossSolReceived * 0.05); 
      const newPrice = Math.max(0.0000001, currentPrice * priceDumpFactor);
      const newMcap = Math.max(1, curveState.mcap * priceDumpFactor);

      setUserTokenBalance(prev => prev - tokenQuantity);
      setUserBalanceSol(prev => prev + netSolReceived);
      setCurveState({ price: newPrice, mcap: newMcap, progress: newProgress.toFixed(1), solInCurve: newSolInCurve });

      setRecentTrades(prev => [{
        id: Date.now(), 
        type: 'sell', 
        amountToken: `${amount.toFixed(1)}M`, 
        amountSol: netSolReceived.toFixed(2), 
        price: `$${newPrice.toFixed(7)}`, 
        time: 'Just now', 
        user: 'You',
        txHash: randomTxHash
      }, ...prev].slice(0, 50));

      if (displayToken.isGraduated) {
          alert(`Jupiter API SELL Executed on Raydium! \n\nFee collected for Treasury: ${feeAmount.toFixed(4)} SOL (0.5%)`);
      }
    }

    setIsBuyModalOpen(false);
    setTradeAmount('');
  };

  const handleCopyCA = (source) => {
    navigator.clipboard.writeText(displayToken.mintAddress);
    if (source === 'header') {
      setHeaderCopied(true);
      setTimeout(() => setHeaderCopied(false), 2000);
    } else {
      setBodyCopied(true);
      setTimeout(() => setBodyCopied(false), 2000);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://apexforge.app/token/${displayToken.mintAddress}`);
    alert("Token link copied to clipboard!");
    setIsShareOpen(false);
  };

  const executeNativeShare = async () => {
    const shareData = { title: `${displayToken.name} on Apex Forge`, text: `Check out ${displayToken.name} (${displayToken.symbol}). Market Cap: $${curveState.mcap.toFixed(2)}K 🚀`, url: `https://apexforge.app/token/${displayToken.mintAddress}` };
    if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.log('Share cancelled or failed.', err); } } else { handleCopyShareLink(); }
  };

  const executeDownload = () => {
    alert(`Screenshot saved to 'ApexForge' album in your gallery!`);
    setIsShareOpen(false);
  };

  const submitReport = () => {
    if(!reportReason) return alert("Please select a valid reason for the report.");
    alert("Report securely submitted to ApexAI moderation team. Thank you.");
    setIsReported(true);
    setIsReportModalOpen(false);
  };

  const getFilteredTrades = () => {
    return recentTrades.filter(trade => {
      const isWhale = parseFloat(trade.amountSol) >= 1.0;
      if (tradeFilter === 'buys') return trade.type === 'buy';
      if (tradeFilter === 'sells') return trade.type === 'sell';
      if (tradeFilter === 'whales') return isWhale;
      return true;
    });
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const showGrid = chartType === 'candle';

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: 'solid', color: '#0A0A0B' }, textColor: '#D1D5DB', attributionLogo: false },
      grid: { vertLines: { color: '#1E2028', style: 0, visible: showGrid }, horzLines: { color: '#1E2028', style: 0, visible: showGrid } },
      width: chartContainerRef.current.clientWidth,
      height: 320, 
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1E2028' },
      rightPriceScale: { borderColor: '#1E2028', visible: true }, 
    });

    let series;
    if (chartType === 'candle') {
      series = chart.addSeries(CandlestickSeries, { upColor: '#089981', downColor: '#F23645', borderVisible: false, wickUpColor: '#089981', wickDownColor: '#F23645' });
    } else {
      series = chart.addSeries(AreaSeries, { lineColor: trendColorHex, topColor: isPositive ? 'rgba(8, 153, 129, 0.15)' : 'rgba(242, 54, 69, 0.15)', bottomColor: isPositive ? 'rgba(8, 153, 129, 0.00)' : 'rgba(242, 54, 69, 0.00)', lineWidth: 2, crosshairMarkerRadius: 5 });
    }

    const generateChartData = () => {
      let data = [];
      let time = Math.floor(Date.now() / 1000) - 3600; 
      let basePrice = curveState.price; 
      for (let i = 0; i < 40; i++) {
        let volatility = basePrice * 0.1;
        let open = basePrice + (Math.random() - 0.4) * volatility;
        let close = isPositive ? open + (Math.random() - 0.2) * volatility : open + (Math.random() - 0.8) * volatility; 
        let high = Math.max(open, close) + Math.random() * (volatility * 0.2);
        let low = Math.min(open, close) - Math.random() * (volatility * 0.2);
        chartType === 'candle' ? data.push({ time: time + (i * 90), open, high, low, close }) : data.push({ time: time + (i * 90), value: close });
        basePrice = close;
      }
      const finalPoint = chartType === 'candle' ? { time: time + (40 * 90), open: basePrice, high: Math.max(basePrice, curveState.price), low: Math.min(basePrice, curveState.price), close: curveState.price } : { time: time + (40 * 90), value: curveState.price };
      data.push(finalPoint);
      return data;
    };

    series.setData(generateChartData());
    chart.timeScale().fitContent();

    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [chartTimeframe, chartType, curveState.price, trendColorHex, isPositive]);

  const formatLink = (url) => url.startsWith('http') ? url : `https://${url}`;

  return (
    <div className="flex flex-col w-full min-h-screen h-[100dvh] bg-[#0A0A0B] text-white font-sans animate-fadeIn overflow-hidden relative">
      
      <style>{`
        * { -webkit-tap-highlight-color: transparent !important; }
        @keyframes slideUpNative { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        .animate-slideUpNative { animation: slideUpNative 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- UNMOVABLE HEADER --- */}
      <header className="flex-none z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 py-3 border-b border-white/[0.04] flex items-center justify-between relative">
        <div className="flex items-center gap-3 min-w-0">
          
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              
              localStorage.removeItem('apex_mock_state_TKN');
              localStorage.removeItem('apex_mock_state_TKN_trades');
              localStorage.removeItem('apex_active_token');

              if (typeof onBack === 'function') {
                onBack();
              } else {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.hash = '';
                }
              }
            }} 
            className="flex items-center justify-center transition-colors hover:text-zinc-300 active:scale-90 p-4 -ml-4 pr-5 shrink-0 relative z-[100] cursor-pointer"
          >
            <svg className="w-7 h-7 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="w-10 h-10 bg-[#1A1A24] border border-white/10 rounded-full flex items-center justify-center text-xl shrink-0 overflow-hidden shadow-inner">
            {displayToken.imagePreview ? <img src={displayToken.imagePreview} className="w-full h-full object-cover" alt="icon" /> : <span className="select-none">{displayToken.icon}</span>}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
               <span className="text-lg font-black text-white leading-tight tracking-wide truncate">{displayToken.name}</span>
               {displayToken.isGraduated && <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black shrink-0">Graduated</span>}
            </div>
            
            <div onClick={() => handleCopyCA('header')} className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-400 mt-0.5 cursor-pointer hover:text-white transition-colors">
              <span className="font-mono tracking-tight">{displayToken.symbol}</span><span className="text-zinc-600">|</span><span className="font-mono tracking-tight">{shortCA}</span>
              {headerCopied ? <span className="text-[#089981] text-[10px] font-black tracking-wider ml-1">COPIED</span> : <svg className="w-3.5 h-3.5 shrink-0 opacity-70 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"></path></svg>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsShareOpen(true)} className="text-white hover:text-zinc-300 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" /></svg></button>
          <button onClick={() => setIsFavorited(!isFavorited)} className="transition-colors"><svg className={`w-6 h-6 ${isFavorited ? 'text-amber-400 fill-amber-400' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></button>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="flex flex-col w-full pb-32">
          
          <div className="flex flex-col px-4 pt-4 pb-2">
            <span className="text-[44px] font-black tracking-tighter leading-none">{formatProPrice(`$${curveState.price.toFixed(7)}`)}</span>
            <span className={`${trendTextColor} font-bold text-sm mt-1.5 tracking-wide flex items-center gap-1`}>{isPositive ? '▲' : '▼'} {formatProPrice(displayToken.change)} <span className="text-[#787B86] font-medium ml-1">{timeframeLabels[chartTimeframe]}</span></span>
          </div>

          <div className="w-full relative bg-[#0A0A0B] border-y border-white/[0.05]">
             <div className="absolute top-2 right-14 z-20 flex flex-col items-end pointer-events-none">
               <span className="text-sm font-black text-white/50 tracking-widest">{displayToken.symbol}</span>
               <span className="text-[10px] font-bold text-white/40">MC: ${curveState.mcap.toFixed(2)}K</span>
             </div>
             <div ref={chartContainerRef} className="w-full h-full" />
          </div>

          <div className="flex items-center px-4 py-3 border-b border-white/[0.05] bg-[#0A0A0B] overflow-x-auto no-scrollbar">
             <div className="flex items-center gap-1.5">
               {['15m', '1h', '4h', '1d', 'MAX'].map(tf => (
                 <button key={tf} onClick={() => setChartTimeframe(tf)} className={`text-[12px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors shrink-0 ${chartTimeframe === tf ? `bg-[#2B2B43] text-white shadow-sm` : 'text-zinc-500 hover:text-white bg-transparent'}`}>{tf}</button>
               ))}
               <div className="w-px h-5 bg-white/10 mx-2 shrink-0"></div>
               <button onClick={() => setChartType(chartType === 'candle' ? 'area' : 'candle')} className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center p-1.5 bg-white/5 rounded-md shrink-0">
                  {chartType === 'candle' ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v2h2v12H7v2H5v-2H3V6h2V4h2zm8 4v2h2v6h-2v2h-2v-2h-2v-6h2V8h2z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>}
               </button>
             </div>
          </div>

          <div className="flex items-center justify-between px-4 py-4 bg-[#121212]/50 border-b border-white/[0.05] mb-2">
            <div className="flex items-center gap-3">
              <div onClick={() => onOpenProfile(displayToken.creator)} className="relative cursor-pointer group">
                <div className="w-11 h-11 bg-black rounded-full border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[#089981]/50 transition-all shadow-inner">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayToken.creator}`} className="w-full h-full object-cover" alt="Creator" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Creator</span>
                <div className="flex items-center gap-2">
                  <span onClick={() => onOpenProfile(displayToken.creator)} className="text-sm font-bold text-white hover:text-[#089981] transition-colors cursor-pointer">{displayToken.creator}</span>
                  <button onClick={() => setIsFollowing(!isFollowing)} className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-white/10 text-white border border-transparent' : 'bg-transparent text-[#089981] border border-[#089981]/30 hover:bg-[#089981]/10'}`}>{isFollowing ? 'Following' : 'Follow'}</button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={userTokenBalance > 0 ? onOpenChat : () => alert('You must hold this token to enter the trench chat!')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${userTokenBalance > 0 ? 'bg-[#089981] text-black hover:bg-[#06806b] hover:shadow-[0_4px_12px_rgba(8,153,129,0.15)] active:scale-95' : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'}`}
            >
              {userTokenBalance > 0 ? <>💬 Enter Chat</> : <>🔒 Buy to Chat</>}
            </button>
          </div>

          <div className="flex flex-col px-4 pt-4 gap-6">

            {!displayToken.isGraduated && (
              <div className="flex flex-col w-full animate-fadeIn bg-[#121212] border border-white/5 p-4 rounded-2xl shadow-inner">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bonding Curve Progress</span>
                    <span className="text-sm font-bold text-zinc-300 mt-1">Race to Raydium</span>
                  </div>
                  <span className="text-lg font-black text-[#089981]">{curveState.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/5 relative">
                   <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#089981]/50 to-[#00FF66] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,102,0.5)]" style={{ width: `${curveState.progress}%` }} />
                </div>
                <p className="text-[10px] text-zinc-500 font-medium mt-3 text-right font-mono">
                  {curveState.solInCurve.toFixed(2)} / 85.00 SOL Filled
                </p>
              </div>
            )}

            {/* BALANCE */}
            <div className="flex flex-col w-full">
              <h2 className="text-xl font-black mb-4">Your Position</h2>
              <div className="flex justify-between items-start mb-5 bg-[#121212] border border-white/5 p-4 rounded-2xl shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Value</span>
                  <span className="text-2xl font-black text-white font-mono">{formatProPrice(`$${((userTokenBalance / 1000000) * curveState.price).toFixed(2)}`)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Balance ({displayToken.symbol})</span>
                  <span className="text-2xl font-black text-[#089981] font-mono">{userTokenBalance > 0 ? `${(userTokenBalance / 1000000).toFixed(2)}M` : '0'}</span>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setIsDepositOpen(true)} className="flex-1 py-3.5 rounded-xl border border-white/10 bg-[#1A1A24] hover:bg-white/10 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Deposit
                </button>
                <button onClick={() => setIsAlertsOpen(true)} className="flex-1 py-3.5 rounded-xl border border-white/10 bg-[#1A1A24] hover:bg-white/10 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> Alerts
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-white/5 my-2"></div>

            <div className="flex flex-col w-full">
              <h2 className="text-xl font-black mb-3">About {displayToken.symbol}</h2>
              <p className="text-[13px] font-medium text-zinc-400 leading-relaxed mb-5 whitespace-pre-wrap">{displayToken.description}</p>
              
              <div className="flex flex-wrap gap-2">

                {displayToken.links.twitter && <a href={formatLink(displayToken.links.twitter)} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-[#121212] border border-white/5 text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5 hover:bg-white/10 transition-colors shadow-inner"><span className="font-black text-sm text-zinc-500">𝕏</span> Twitter</a>}
                {displayToken.links.telegram && <a href={formatLink(displayToken.links.telegram)} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-[#121212] border border-white/5 text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5 hover:bg-white/10 transition-colors shadow-inner"><span className="text-zinc-500">✈</span> Telegram</a>}
                {displayToken.links.website && <a href={formatLink(displayToken.links.website)} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-[#121212] border border-white/5 text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5 hover:bg-white/10 transition-colors shadow-inner"><span className="text-zinc-500">🌐</span> Website</a>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 border-t border-white/[0.05] pt-6">
              <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl flex flex-col shadow-inner">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Market Cap</span>
                <span className="text-sm font-mono font-bold text-white mt-1.5">{formatProPrice(`$${curveState.mcap.toFixed(2)}K`)}</span>
              </div>
              <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl flex flex-col shadow-inner">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Volume (24h)</span>
                <span className="text-sm font-mono font-bold text-white mt-1.5">$409.90</span>
              </div>
              <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl flex flex-col shadow-inner">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Holders</span>
                <span className="text-sm font-mono font-bold text-white mt-1.5">{displayToken.holders}</span>
              </div>
              <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl flex flex-col shadow-inner">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Circulating Supply</span>
                <span className="text-sm font-mono font-bold text-white mt-1.5">{displayToken.supply}</span>
              </div>
            </div>

            {/* RECENT TRADES */}
            <div className="flex flex-col w-full mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black">Recent Trades</h2>
                <div className="flex items-center gap-1.5 bg-[#e81cff]/10 px-2 py-1 rounded border border-[#e81cff]/20">
                  <span className="w-1.5 h-1.5 bg-[#e81cff] rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase text-[#e81cff] tracking-widest">Live</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {recentTrades.slice(0, 5).map((trade) => {
                  const isWhale = parseFloat(trade.amountSol) >= 1.0;
                  return (
                    <div key={trade.id} className={`flex justify-between items-center p-3 rounded-xl transition-all ${isWhale ? 'bg-gradient-to-r from-[#089981]/10 to-[#121212] border border-[#089981]/30 shadow-[0_4px_12px_rgba(8,153,129,0.1)]' : 'bg-[#121212]/60 border border-white/[0.03]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${trade.type === 'buy' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#F23645]/20 text-[#F23645]'}`}>
                          {trade.type}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[13px] text-white">
                              {trade.user}
                            </span>
                            {trade.user === 'You' && <span className="bg-white/10 text-zinc-400 text-[8px] px-1 py-0.5 rounded font-black uppercase">Me</span>}
                            {isWhale && <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">🐋 WHALE</span>}
                          </div>
                          <span className="text-[11px] font-mono text-[#787B86] mt-0.5">{trade.amountToken} TKN</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-[12px] font-mono font-bold text-white">◎ {trade.amountSol}</span>
                          <span className={`text-[10px] font-mono mt-0.5 ${trade.type === 'buy' ? 'text-[#089981]' : 'text-zinc-500'}`}>{trade.time}</span>
                        </div>
                        <a 
                          href={`https://solscan.io/tx/${trade.txHash || '5K2a'}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-zinc-500 hover:text-white bg-white/5 rounded-lg transition-colors shrink-0"
                          title="Verify on Solscan"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {recentTrades.length > 5 && (
                <button onClick={() => setShowAllTrades(true)} className="w-full mt-3 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors shadow-sm">
                  View All {recentTrades.length} Trades & Filters
                </button>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/[0.05]">
              <button onClick={() => setIsReportModalOpen(true)} className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 py-2 px-4 rounded-full border ${isReported ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-white/10 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30'}`}>
                🚩 {isReported ? 'Flagged for Auditing' : 'Report Token'}
              </button>
              <p className="text-center text-[10px] text-zinc-600 font-medium leading-relaxed max-w-sm">
                Apex Forge acts strictly as a decentralized non-custodial software launcher suite. Cryptographic assets are inherently exposed to extreme market volatility.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* --- ALL TRADES MODAL --- */}
      {showAllTrades && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setShowAllTrades(false)}></div>
          <div className="bg-[#050505] border-t border-white/10 rounded-t-3xl w-full max-w-xl h-[85vh] p-6 relative z-10 animate-slideUpNative flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Transaction Ledger</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">Live On-Chain Telemetry</p>
              </div>
              <button onClick={() => setShowAllTrades(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Trades' },
                { id: 'buys', label: '🟢 Buys Only' },
                { id: 'sells', label: '🔴 Sells Only' },
                { id: 'whales', label: '🐋 Whales (≥1 SOL)' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTradeFilter(f.id)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${tradeFilter === f.id ? 'bg-[#089981] text-white border-[#089981]' : 'bg-[#121212] text-zinc-400 border-white/5 hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-2">
              {getFilteredTrades().length === 0 ? (
                <div className="text-center py-12 text-zinc-600 text-xs font-bold uppercase tracking-widest">No matching transactions found</div>
              ) : (
                getFilteredTrades().map((trade) => {
                  const isWhale = parseFloat(trade.amountSol) >= 1.0;
                  return (
                    <div key={trade.id} className={`bg-[#121212] border p-3 rounded-xl flex justify-between items-center ${isWhale ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${trade.type === 'buy' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#F23645]/20 text-[#F23645]'}`}>
                          {trade.type}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[13px] text-white">{trade.user}</span>
                            {trade.user === 'You' && <span className="bg-white/10 text-zinc-400 text-[8px] px-1 py-0.5 rounded font-black uppercase">Me</span>}
                            {isWhale && <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">🐋 WHALE</span>}
                          </div>
                          <span className="text-[11px] font-mono text-[#787B86] mt-0.5">{trade.amountToken} TKN</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-[12px] font-mono font-bold text-white">◎ {trade.amountSol}</span>
                          <span className={`text-[10px] font-mono mt-0.5 ${trade.type === 'buy' ? 'text-[#089981]' : 'text-zinc-500'}`}>{trade.time}</span>
                        </div>
                        <a 
                          href={`https://solscan.io/tx/${trade.txHash || '5K2a'}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-zinc-500 hover:text-white bg-white/5 rounded-lg transition-colors shrink-0"
                          title="Verify on Solscan"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- DEPOSIT MODAL --- */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsDepositOpen(false)}></div>
          <div className="bg-[#1C1C1E] border-t border-white/10 rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col items-center">
             <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
             <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Deposit SOL</h3>
             <p className="text-[11px] font-medium text-zinc-400 mb-6 text-center">Scan QR or copy your address to fund your wallet.</p>
             <div className="bg-white p-2 rounded-xl mb-6">
                <svg className="w-40 h-40 text-black" viewBox="0 0 100 100" shapeRendering="crispEdges">
                   <path d="M0 0h30v30H0zm10 10h10v10H10zM70 0h30v30H70zm10 10h10v10H80zM0 70h30v30H0zm10 10h10v10H10z" fill="currentColor" />
                   <path d="M35 5h5v5h-5zm10 0h15v5H45zm0 10h5v10h-5zm10-5h5v5h-5zm0 10h10v5H55zm-20 5h10v5H35zm0 10h5v5h-5zm10 5h5v5h-5zm20-20h5v5h-5zm5 5h5v10h-5zm5 10h5v5h-5zm-15 5h10v5H70zm10 5h15v5H80zm5 5h5v5h-5zm-50 5h5v5h-5zm10 0h5v5h-5zm10 0h15v5H50z" fill="currentColor" />
                </svg>
             </div>
             <div className="bg-[#0A0A0B] border border-white/10 w-full p-4 rounded-xl flex justify-between items-center mb-6">
                <span className="font-mono text-xs text-white truncate">FzVQv...9xCuH</span>
                <button onClick={() => { navigator.clipboard.writeText('FzVQv...9xCuH'); alert('Address Copied!'); }} className="text-[#089981] font-black text-[10px] uppercase tracking-widest bg-[#089981]/10 px-3 py-1.5 rounded">Copy</button>
             </div>
             <button onClick={() => setIsDepositOpen(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400">Done</button>
          </div>
        </div>
      )}

      {/* --- ALERTS MODAL --- */}
      {isAlertsOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsAlertsOpen(false)}></div>
          <div className="bg-[#1C1C1E] border-t border-white/10 rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col">
             <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
             <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 text-center">Set Price Alert</h3>
             <p className="text-[11px] font-medium text-zinc-400 mb-6 text-center">Get notified instantly when {displayToken.symbol} hits your target.</p>
             <div className="bg-[#0A0A0B] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
                <span className="text-xl font-bold text-white">$</span>
                <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} placeholder={curveState.price.toFixed(7)} className="bg-transparent text-right text-3xl font-black text-white w-full focus:outline-none placeholder-zinc-700" />
             </div>
             <button onClick={() => { alert(`Alert set for $${alertPrice}!`); setIsAlertsOpen(false); }} disabled={!alertPrice} className="w-full py-4 bg-[#089981] hover:bg-[#06806b] disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-sm">Confirm Target</button>
          </div>
        </div>
      )}

      {/* --- REPORT MODAL --- */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="bg-[#1C1C1E] border-t border-rose-500/30 rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col">
             <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
             <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">🚩 Report {displayToken.symbol}</h3>
             <p className="text-[11px] font-medium text-zinc-400 mb-6">Select a violation reason. False reporting will result in a global wallet ban.</p>
             <div className="flex flex-col gap-3 mb-6">
                {['Suspected Scam / Rug Pull', 'Impersonating Official Brand', 'Explicit / Offensive Content', 'Other Violation'].map(reason => (
                  <button key={reason} onClick={() => setReportReason(reason)} className={`w-full py-4 px-5 rounded-xl border text-left text-xs font-black tracking-widest uppercase transition-all ${reportReason === reason ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/10 bg-[#0A0A0B] text-zinc-400 hover:border-white/30'}`}>{reason}</button>
                ))}
             </div>
             <button onClick={submitReport} className="w-full py-4 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_12px_rgba(242,54,69,0.2)]">Submit to Moderation</button>
          </div>
        </div>
      )}

      {/* --- LIVE STREAM MODAL --- */}
      {onOpenLiveModal && (
        <LiveModal 
          isOpen={true} 
          onClose={() => {}} 
          token={displayToken} 
        />
      )}

      {/* --- NATIVE SHARE MODAL --- */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsShareOpen(false)}></div>
          
          <div className="bg-[#1C1C1E] border-t border-white/10 rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col">
             <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
             
             <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 flex flex-col mb-8 shadow-2xl relative overflow-hidden">
               <div className={`absolute -top-12 -right-12 w-40 h-40 ${trendBgColor} opacity-20 rounded-full blur-3xl pointer-events-none`}></div>
               <div className={`absolute -bottom-12 -left-12 w-40 h-40 ${trendBgColor} opacity-10 rounded-full blur-3xl pointer-events-none`}></div>
               
               <div className="flex justify-between items-start w-full z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-[#1A1A24] border border-white/5 rounded-full flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                       {displayToken.imagePreview ? <img src={displayToken.imagePreview} className="w-full h-full object-cover" alt="icon"/> : <span>{displayToken.icon}</span>}
                     </div>
                     <div className="flex flex-col">
                        <span className="font-black text-white text-lg leading-tight">{displayToken.name}</span>
                        <span className="text-xs text-zinc-400 font-mono mt-0.5">{displayToken.symbol}</span>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className={`text-[9px] font-black ${trendTextColor} uppercase tracking-widest mb-0.5`}>Market Cap</span>
                     <span className="text-2xl font-black text-white tracking-wide">{formatProPrice(`$${curveState.mcap.toFixed(2)}K`)}</span>
                  </div>
               </div>

               <div className="flex flex-col mt-6 z-10">
                  <span className="text-4xl font-black text-white tracking-tighter">{formatProPrice(`$${curveState.price.toFixed(7)}`)}</span>
                  <span className={`text-sm font-bold ${trendTextColor} mt-1 tracking-wide`}>{isPositive ? '▲' : '▼'} {displayToken.change}</span>
               </div>

               <div className="flex justify-between items-end mt-6 pt-4 border-t border-white/10 z-10">
                  <div className="flex items-center gap-2">
                     <div className="relative w-6 h-6 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                           <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
                           <path d="M 50 45 C 35 70, 35 85, 50 85 C 65 85, 70, 50 45 Z" fill="#089981" />
                        </svg>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-sm font-black tracking-widest text-white uppercase mt-0.5 leading-none">Apex Forge</span>
                       <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Scan to Trade</span>
                     </div>
                  </div>
                  
                  <div className="bg-white p-1.5 rounded-lg shadow-lg shrink-0 flex items-center justify-center border border-white/20 w-14 h-14">
                    <svg className="w-full h-full text-black" viewBox="0 0 100 100" shapeRendering="crispEdges">
                      <path d="M0 0h30v30H0zm10 10h10v10H10zM70 0h30v30H70zm10 10h10v10H80zM0 70h30v30H0zm10 10h10v10H10z" fill="currentColor" />
                      <path d="M35 5h5v5h-5zm10 0h15v5H45zm0 10h5v10h-5zm10-5h5v5h-5zm0 10h10v5H55zm-20 5h10v5H35zm0 10h5v5h-5zm10 5h5v5h-5zm20-20h5v5h-5zm5 5h5v10h-5zm5 10h5v5h-5zm-15 5h10v5H70zm10 5h15v5H80zm5 5h5v5h-5zm-50 5h5v5h-5zm10 0h5v5h-5zm10 0h15v5H50z" fill="currentColor" />
                      <rect x="42" y="42" width="16" height="16" rx="4" fill="#089981" />
                    </svg>
                  </div>
               </div>
             </div>

             <div className="flex gap-4 px-2">
               <div className="flex flex-col items-center gap-2">
                 <button onClick={handleCopyShareLink} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                 </button>
                 <span className="text-[10px] font-bold text-zinc-400">Copy link</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <button onClick={executeNativeShare} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" /></svg>
                 </button>
                 <span className="text-[10px] font-bold text-zinc-400">Share</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <button onClick={executeDownload} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 </button>
                 <span className="text-[10px] font-bold text-zinc-400">Download</span>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* --- SWAP/BUY/SELL MODAL --- */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsBuyModalOpen(false)}></div>
          
          <div className={`bg-[#1C1C1E] border-t ${displayToken.isGraduated ? 'border-amber-500/30' : (tradeMode === 'buy' ? 'border-[#089981]/30' : 'border-[#F23645]/30')} rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col transition-colors duration-300`}>
             
             <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Trade {displayToken.symbol}
                    {displayToken.isGraduated && <span className="bg-amber-500/10 text-amber-500 text-[8px] px-1.5 py-0.5 rounded uppercase border border-amber-500/20">DEX Swap</span>}
                  </h3>
                  {displayToken.isGraduated && <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Jupiter Aggregator Routing</span>}
                </div>
                <button onClick={() => setIsBuyModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
             </div>

             <div className="flex p-1 bg-black/40 rounded-xl mb-6 border border-white/5 shadow-inner">
               <button onClick={() => { setTradeMode('buy'); setTradeAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'buy' ? 'bg-[#089981] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Buy</button>
               <button onClick={() => { setTradeMode('sell'); setTradeAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Sell</button>
             </div>

             <div className={`bg-black/40 border border-white/5 focus-within:border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all mb-2`}>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                  {tradeMode === 'buy' ? (
                    <><img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="w-4 h-4" alt="SOL"/><span className="text-xs font-black text-white">SOL</span></>
                  ) : (
                    <><div className="w-4 h-4 rounded-full bg-black overflow-hidden flex items-center justify-center text-[8px]">{displayToken.imagePreview ? <img src={displayToken.imagePreview} className="w-full h-full object-cover" alt="TKN"/> : displayToken.icon}</div><span className="text-xs font-black text-white">{displayToken.symbol}</span></>
                  )}
                </div>
                <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" className="bg-transparent text-right text-3xl font-black text-white w-full focus:outline-none placeholder-zinc-700" />
             </div>

             <div className="flex justify-between items-center px-1 mb-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Balance: {tradeMode === 'buy' ? `${userBalanceSol.toFixed(2)} SOL` : `${(userTokenBalance / 1000000).toFixed(2)}M ${displayToken.symbol}`}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setTradeAmount(tradeMode === 'buy' ? (userBalanceSol * 0.5).toFixed(2) : ((userTokenBalance * 0.5) / 1000000).toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Half</button>
                  <button onClick={() => setTradeAmount(tradeMode === 'buy' ? userBalanceSol.toFixed(2) : (userTokenBalance / 1000000).toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Max</button>
                </div>
             </div>

             <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] border border-white/5 rounded-xl mb-6 shadow-inner">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase">You Receive (Est.)</span>
                 <span className={`text-sm font-black ${displayToken.isGraduated ? 'text-amber-500' : (tradeMode === 'buy' ? 'text-[#089981]' : 'text-[#00FF66]')}`}>
                   {tradeAmount && parseFloat(tradeAmount) > 0 ? (
                     tradeMode === 'buy' 
                       ? `${(((parseFloat(tradeAmount) * (displayToken.isGraduated ? 0.995 : 1)) / curveState.price) / 1000000).toFixed(2)}M ${displayToken.symbol}`
                       : `${((parseFloat(tradeAmount) * 1000000 * curveState.price) * (displayToken.isGraduated ? 0.995 : 1)).toFixed(4)} SOL`
                   ) : '0.00'}
                 </span>
               </div>
               
               {displayToken.isGraduated ? (
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-zinc-500 uppercase">Routing & Fees</span>
                   <span className="text-[10px] font-black text-zinc-300 flex items-center gap-1">Raydium LP <span className="text-zinc-600">|</span> 0.5%</span>
                 </div>
               ) : (
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Impact</span>
                   <span className="text-[10px] font-black text-zinc-300">~{dynamicPriceImpact}%</span>
                 </div>
               )}
             </div>

             <button 
                onClick={handleExecuteTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                className={`w-full ${displayToken.isGraduated ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-[0_4px_12px_rgba(245,158,11,0.15)]' : (tradeMode === 'buy' ? 'bg-[#089981] hover:bg-[#06806b] shadow-[0_4px_12px_rgba(8,153,129,0.15)]' : 'bg-[#F23645] hover:bg-rose-600 shadow-[0_4px_12px_rgba(242,54,69,0.15)]')} disabled:opacity-50 text-white font-black text-sm py-4 rounded-2xl tracking-[0.2em] uppercase transition-all active:scale-95 flex items-center justify-center gap-2`}
             >
               Confirm {tradeMode} ⚡
             </button>
          </div>
        </div>
      )}

      {/* --- UNMOVABLE BOTTOM BUY MAT --- */}
      <div className="flex-none bg-[#0E0E14] z-30 pt-4 pb-24 md:pb-6 px-4 border-t border-white/[0.05] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <button 
            onClick={() => { setTradeMode('buy'); setIsBuyModalOpen(true); }} 
            className={`w-full ${displayToken.isGraduated ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_4px_12px_rgba(245,158,11,0.15)]' : 'bg-[#089981] hover:opacity-90 text-white shadow-[0_4px_12px_rgba(8,153,129,0.15)]'} font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-widest`}
          >
            {displayToken.isGraduated ? 'Trade on DEX ⚡' : 'Trade Token'}
          </button>
          
          {displayToken.isGraduated ? (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-amber-500 text-[10px]">🔒</span>
              <span className="text-[11px] font-bold text-zinc-400 tracking-wide">Liquidity pool burned & locked on Raydium.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-amber-500 text-[10px]">⚠️</span>
              <span className="text-[11px] font-medium text-amber-500/90 tracking-wide">This coin is new and may be volatile.</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}