import React, { useState, useRef, useEffect } from 'react';

export default function TokenChat({ token, onBack, userBalance, userProfile }) {
  const messagesEndRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [activeReactionId, setActiveReactionId] = useState(null);

  // 🚀 INLINE TRADE MODAL STATE
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');

  // Identity Context
  const myName = userProfile?.username || '@User';
  const myAvatar = userProfile?.avatar;
  const tokenSymbol = token?.symbol || 'TKN';

  // 🚀 PERMANENT MEMORY CACHE (Synced with TokenHome)
  const rawProgress = token?.progress || 0;
  const initialMcap = parseFloat((token?.mcap || token?.marketCap || '$10.0K').replace(/[^0-9.]/g, ''));
  const isActuallyGraduated = token?.isGraduated === true || rawProgress >= 100 || initialMcap >= 69;

  const displayToken = {
    name: token?.name || token?.token || 'Unknown Token',
    symbol: token?.symbol || 'TKN',
    change: token?.change || '+0.0%',
    icon: token?.icon || '🪙',
    imagePreview: token?.imagePreview || token?.image || null, 
    mintAddress: token?.mintAddress || '8AVmX9aQwZoonSolanaNet11oHEZforge',
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

  useEffect(() => {
    localStorage.setItem(localCacheKey, JSON.stringify({ curveState, userBalanceSol, userTokenBalance }));
  }, [curveState, userBalanceSol, userTokenBalance, localCacheKey]);

  const dynamicPriceImpact = tradeAmount && parseFloat(tradeAmount) > 0 
    ? (parseFloat(tradeAmount) * (tradeMode === 'buy' ? 0.12 : 0.08)).toFixed(2) 
    : '0.00';

  const formatProPrice = (val) => {
    if (!val && val !== 0) return '';
    const str = val.toString();
    if (str.startsWith('$')) return <><span className="font-bold mr-[2px]">$</span>{str.slice(1)}</>;
    return str;
  };

  const formatBadge = (bal) => {
    if (!bal && bal !== 0) return '0';
    const val = parseFloat(bal);
    if (isNaN(val)) return '0';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  const topHolders = [
    { id: 1, name: 'Apex Sniper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper', holding: '4.2%' },
    { id: 2, name: '0xDegen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Degen', holding: '3.8%' },
    { id: 3, name: 'SolWhale', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale', holding: '2.1%' },
    { id: 4, name: 'Toly', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toly', holding: '1.5%' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Apex Sniper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper', text: 'This chart is looking incredibly primed. 🚀', time: '10:42 AM', badge: '42M', isMe: false, reactions: { '🚀': 12, '🐳': 3 } },
    { id: 2, sender: '0xDegen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Degen', text: 'Just swept the floor. Nobody is selling!', time: '10:45 AM', badge: '38M', isMe: false, reactions: { '💎': 8 } },
    { id: 3, sender: 'SolWhale', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale', text: 'Raydium graduation incoming today. Hold the line.', time: '10:48 AM', badge: '21M', isMe: false, reactions: {} },
  ]);

  // 🤖 FOMO BUY BOT INJECTION
  useEffect(() => {
    const timer = setTimeout(() => {
      const fomoMessage = {
        id: Date.now().toString(),
        isSystem: true,
        text: `🟢 Wallet 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}... just scooped 50 SOL ($7.2k) of ${tokenSymbol}!`,
        time: 'Just now'
      };
      setMessages(prev => [...prev, fomoMessage]);
    }, 6000);

    return () => clearTimeout(timer);
  }, [tokenSymbol]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: myName,
      avatar: myAvatar,
      text: inputText,
      time: 'Just now',
      badge: formatBadge(userTokenBalance), // Dynamically uses real balance
      isMe: true,
      reactions: {}
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  // 🚀 INLINE TRADE EXECUTION
  const handleExecuteTrade = () => {
    const amount = parseFloat(tradeAmount);
    
    if (tradeMode === 'buy') {
      if (!amount || amount <= 0 || amount > userBalanceSol) return;

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

      if (displayToken.isGraduated) {
          alert(`Jupiter API BUY Executed on Raydium! \n\nFee collected for Treasury: ${feeAmount.toFixed(4)} SOL (0.5%)`);
      }

    } else if (tradeMode === 'sell') {
      const tokenQuantity = amount * 1000000;
      if (!amount || amount <= 0 || tokenQuantity > userTokenBalance) return;

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

      if (displayToken.isGraduated) {
          alert(`Jupiter API SELL Executed on Raydium! \n\nFee collected for Treasury: ${feeAmount.toFixed(4)} SOL (0.5%)`);
      }
    }

    setIsBuyModalOpen(false);
    setTradeAmount('');
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0B] text-white font-sans animate-fadeIn overflow-hidden relative z-50">
      
      {/* --- HEADER --- */}
      <header className="flex-none z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 py-3 border-b border-white/[0.04] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white uppercase">{tokenSymbol} HQ</span>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-[#089981]/20 text-[#089981] px-1.5 py-0.5 rounded border border-[#089981]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span> Live
              </span>
            </div>
            
            {/* 🚀 FIXED: Dynamic Online Users Indicator */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Holder Exclusive</span>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-1.5 bg-[#00FF66]/10 px-1.5 py-0.5 rounded border border-[#00FF66]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_5px_#00FF66]"></span>
                <span className="text-[9px] font-black text-[#00FF66] uppercase tracking-widest">1,420 Online</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Explicit TRADE Button in Header */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-[#00FF66] font-mono">{formatProPrice(`$${curveState.price.toFixed(7)}`)}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">MC: ${curveState.mcap.toFixed(2)}K</span>
          </div>
          <button 
            onClick={() => setIsBuyModalOpen(true)}
            className={`px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-white shadow-lg transition-colors active:scale-95 ${displayToken.isGraduated ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-black' : 'bg-[#089981] hover:bg-[#06806b] shadow-[0_0_15px_rgba(8,153,129,0.3)]'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Trade</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>
      </header>

      {/* --- TOP HOLDERS --- */}
      <div className="flex-none bg-[#121212] border-b border-white/[0.03] py-3 px-4 shadow-inner z-30 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Top Room Holders</span>
          <span className="text-[10px] font-bold text-[#089981] cursor-pointer hover:text-white">View All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {topHolders.map((whale, idx) => (
            <div key={whale.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${idx === 0 ? 'border-amber-400' : 'border-white/10'}`}>
                <img src={whale.avatar} alt={whale.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] font-black text-zinc-400">{whale.holding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- CHAT FEED --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-[#050505]" onClick={() => setActiveReactionId(null)}>
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center w-full my-2 animate-slideUpNative">
                <div className="bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] px-4 py-2 rounded-xl text-xs font-mono font-bold text-center max-w-[90%]">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end group relative`}>
                {!msg.isMe && <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black mb-1"><img src={msg.avatar} alt="avatar" className="w-full h-full object-cover" /></div>}
                
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} relative`}>
                  <div className={`flex items-center gap-1.5 mb-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[11px] font-black text-zinc-400">{msg.sender}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${msg.isMe ? 'bg-[#089981]/20 text-[#089981]' : 'bg-white/10 text-zinc-300'}`}>{msg.badge}</span>
                  </div>

                  <div className="relative cursor-pointer" onMouseEnter={() => setActiveReactionId(msg.id)} onClick={(e) => { e.stopPropagation(); setActiveReactionId(msg.id); }}>
                    <div className={`absolute ${msg.isMe ? '-top-10 right-0' : '-top-10 left-0'} bg-[#121212] border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-2 shadow-xl z-10 transition-all ${activeReactionId === msg.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                      {['🚀', '💎', '🐳', '💩'].map(emoji => (<button key={emoji} className="hover:scale-125 transition-transform text-sm">{emoji}</button>))}
                    </div>

                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-md ${msg.isMe ? 'bg-[#089981] text-white rounded-br-sm' : 'bg-[#1A1A24] border border-white/5 text-zinc-200 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-600 mx-1 mt-1">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* --- CLEANED UP INPUT AREA --- */}
      <div className="flex-none bg-[#0E0E14] border-t border-white/[0.05] p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSendMessage} className="flex items-end gap-1.5 bg-black border border-white/10 focus-within:border-[#089981]/50 rounded-3xl p-1.5 transition-all shadow-inner">
          <div className="flex items-center shrink-0">
            <button type="button" className="p-2 text-zinc-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
            <button type="button" className="p-2 text-zinc-500 hover:text-[#089981] transition-colors font-black text-xs">GIF</button>
          </div>
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Shill the trenches..." className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none py-3 px-1 min-w-0" />
          <button type="submit" disabled={!inputText.trim()} className="p-3 bg-[#089981] hover:bg-[#06806b] disabled:bg-[#089981]/30 text-white rounded-full transition-all active:scale-90 shrink-0 shadow-[0_0_10px_rgba(8,153,129,0.3)]"><svg className="w-4 h-4 translate-x-0.5 -translate-y-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
        </form>
      </div>

      {/* --- THE INLINE TRADE MODAL --- */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsBuyModalOpen(false)}></div>
          
          <div className={`bg-[#1C1C1E] border-t ${displayToken.isGraduated ? 'border-amber-500/30' : (tradeMode === 'buy' ? 'border-[#089981]/30' : 'border-[#F23645]/30')} rounded-t-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col transition-colors duration-300`}>
             
             {/* HEADER */}
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

             {/* BUY / SELL TOGGLE SWITCH */}
             <div className="flex p-1 bg-black/40 rounded-xl mb-6 border border-white/5 shadow-inner">
               <button onClick={() => { setTradeMode('buy'); setTradeAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'buy' ? 'bg-[#089981] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Buy</button>
               <button onClick={() => { setTradeMode('sell'); setTradeAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Sell</button>
             </div>

             {/* DYNAMIC INPUT FIELD */}
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

             {/* DYNAMIC BALANCE QUICK SELECT */}
             <div className="flex justify-between items-center px-1 mb-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Balance: {tradeMode === 'buy' ? `${userBalanceSol.toFixed(2)} SOL` : `${(userTokenBalance / 1000000).toFixed(2)}M ${displayToken.symbol}`}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setTradeAmount(tradeMode === 'buy' ? (userBalanceSol * 0.5).toFixed(2) : ((userTokenBalance * 0.5) / 1000000).toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Half</button>
                  <button onClick={() => setTradeAmount(tradeMode === 'buy' ? userBalanceSol.toFixed(2) : (userTokenBalance / 1000000).toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Max</button>
                </div>
             </div>

             {/* DYNAMIC ESTIMATES BOX */}
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

             {/* DYNAMIC CONFIRM BUTTON */}
             <button 
                onClick={handleExecuteTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                className={`w-full ${displayToken.isGraduated ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : (tradeMode === 'buy' ? 'bg-[#089981] hover:bg-[#06806b] shadow-[0_0_20px_rgba(8,153,129,0.3)]' : 'bg-[#F23645] hover:bg-rose-600 shadow-[0_0_20px_rgba(242,54,69,0.3)]')} disabled:opacity-50 text-white font-black text-sm py-4 rounded-2xl tracking-[0.2em] uppercase transition-all active:scale-95 flex items-center justify-center gap-2`}
             >
                Confirm {tradeMode} ⚡
             </button>
          </div>
        </div>
      )}

    </div>
  );
}