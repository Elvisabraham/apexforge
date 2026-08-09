import React, { useState, useRef, useEffect } from 'react';
import { useTrade } from '../hooks/useTrade';
import TradeWidget from './TradeWidget';
import { supabase } from '../supabaseClient';

export default function TokenChat({ token, onBack, userBalance, userTokenBalance, userProfile, onOpenProfile }) {
  // 🚀 INJECT IT RIGHT HERE BEFORE ANY HOOKS
  const userBalanceSol = userBalance;

  const { executeTradeOnChain, isProcessing } = useTrade();

  const messagesEndRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [activeReactionId, setActiveReactionId] = useState(null);
  const [isHoldersModalOpen, setIsHoldersModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // INLINE TRADE MODAL STATE
const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
const [tradeMode, setTradeMode] = useState('buy');
const [tradeAmount, setTradeAmount] = useState('');

  // Identity Context
  const myName = `@${(userProfile?.username || 'User').replace('@', '')}`;
  const myAvatar = userProfile?.avatar;
  const tokenSymbol = token?.symbol || 'TKN';

  // 🚀 SUPABASE LIVE CHAT ENGINE
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const tokenMint = token?.mint || token?.address || token?.symbol; // Fallback identifier

  useEffect(() => {
    if (!tokenMint) return;

    // 1. Fetch historical messages
    const fetchMessages = async () => {
      setIsChatLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('token_mint', tokenMint)
        .order('created_at', { ascending: true });

      if (!error && data) setMessages(data);
      setIsChatLoading(false);
    };

    fetchMessages();

    // 2. Subscribe to live WebSockets (Now listens for both INSERTS and UPDATES)
    const channel = supabase
      .channel(`chat:${tokenMint}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `token_mint=eq.${tokenMint}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            // 🚀 Replaces the old message with the newly updated message (containing live reactions)
            setMessages((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tokenMint]);

  // 🚀 FORMATTER HELPER: Adds thousand commas while preserving decimals
  const formatInputWithCommas = (val) => {
    if (!val && val !== 0) return '';
    const parts = val.toString().replace(/,/g, '').split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // PERMANENT MEMORY CACHE
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
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.curveState && parsed.curveState.solInCurve !== undefined) {
        return parsed.curveState;
      }
    }
    return { price: initialBasePrice, mcap: initialMcap, progress: displayToken.progress, solInCurve: (displayToken.progress / 100) * 85 };
  });

  useEffect(() => {
    localStorage.setItem(localCacheKey, JSON.stringify({ curveState, userBalanceSol, userTokenBalance }));
  }, [curveState, userBalanceSol, userTokenBalance, localCacheKey]);

  // 🚀 Map incoming props to match your component variables
  const userPnlPercent = token?.change || '0.0%';
  const isPnlPositive = !userPnlPercent.includes('-');

  // 🚀 SANITIZED PRICE IMPACT: Strips commas before running float calculations
  const cleanNumericAmount = tradeAmount ? parseFloat(tradeAmount.toString().replace(/,/g, '')) : 0;
  const rawImpact = !isNaN(cleanNumericAmount) && cleanNumericAmount > 0 
    ? (cleanNumericAmount * (tradeMode === 'buy' ? 0.12 : 0.08)) 
    : 0;
  const dynamicPriceImpact = Math.min(99.99, Math.max(0, rawImpact)).toFixed(2);

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
    { id: 1, name: 'Apex Sniper', address: '7xK2...9pQ1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper', holding: '4.2%', value: '$12,450' },
    { id: 2, name: '0xDegen', address: '3fR8...2vL4', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Degen', holding: '3.8%', value: '$11,200' },
    { id: 3, name: 'SolWhale', address: '9pQ1...4xK2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale', holding: '2.1%', value: '$6,800' },
    { id: 4, name: 'Toly', address: '2vL4...3fR8', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toly', holding: '1.5%', value: '$4,500' },
    { id: 5, name: 'MoonShot_99', address: '5mN7...1wQ9', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moon', holding: '1.2%', value: '$3,600' },
  ];

  // FOMO BUY BOT INJECTION
  useEffect(() => {
    const timer = setTimeout(() => {
      const fomoMessage = {
        id: Date.now().toString(),
        isSystem: true,
        text: `🟢 Wallet 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}... just scooped 50 SOL ($7.2k) of $${tokenSymbol}!`,
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

  const renderFormattedText = (text, isMe) => {
    if (!text) return '';
    // 🚀 FIX: Handles token symbols containing spaces or special characters
    const parts = text.split(/(\$[A-Za-z0-9_\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$')) {
        return (
          <span 
            key={i} 
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono font-black text-xs mx-0.5 align-baseline shadow-sm border ${
              isMe 
                ? 'bg-black/30 text-white border-white/30' 
                : 'bg-[#089981]/20 text-[#089981] border-[#089981]/40'
            }`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        
        // 🚀 Push Image live to Supabase
        const { error } = await supabase.from('messages').insert([
          {
            token_mint: tokenMint,
            user_address: myName || 'Anon',
            avatar: myAvatar || null,
            content: '', 
            image: base64Image
          }
        ]);
        if (error) console.error('Error sending image:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMockGif = async () => {
    // 🚀 Push GIF live to Supabase
    const { error } = await supabase.from('messages').insert([
      {
        token_mint: tokenMint,
        user_address: myName || 'Anon',
        avatar: myAvatar || null,
        content: '',
        image: 'https://media.giphy.com/media/amrNGnZUeWhZC/giphy.gif'
      }
    ]);
    if (error) console.error('Error sending GIF:', error);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !tokenMint) return;

    const textToSend = inputText.trim();
    setInputText(''); // Clear UI instantly for a smooth feel

    // 🚀 Push Text live to Supabase
    const { error } = await supabase.from('messages').insert([
      {
        token_mint: tokenMint,
        user_address: myName || 'Anon',
        avatar: myAvatar || null,
        content: textToSend,
        image: null
      }
    ]);

    if (error) console.error('Error sending message:', error);
  };

  const handleAddReaction = async (msgId, emoji) => {
    // Find the current message and increment the emoji count
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg) return;

    const currentReactions = targetMsg.reactions || {};
    const newCount = (currentReactions[emoji] || 0) + 1;
    const updatedReactions = { ...currentReactions, [emoji]: newCount };

    // Optimistic UI update so it feels instant for the user
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, reactions: updatedReactions } : m
    ));
    setActiveReactionId(null);

    // 🚀 Push Reaction Update live to Supabase
    const { error } = await supabase
      .from('messages')
      .update({ reactions: updatedReactions })
      .eq('id', msgId);
      
    if (error) console.error('Error updating reaction:', error);
  };

  const handleExecuteTrade = async () => {
    const amount = parseFloat(tradeAmount.toString().replace(/,/g, ''));
    if (!amount || amount <= 0) return;

    // 🚀 Send the transaction to the blockchain using your new hook!
    const success = await executeTradeOnChain(tradeMode, amount, displayToken.mintAddress, null, null, displayToken.isGraduated);
    
    if (success) {
      // If the Phantom wallet transaction succeeds, close the modal
      setIsBuyModalOpen(false);
      setTradeAmount('');
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#0A0A0B] text-white font-sans animate-fadeIn overflow-hidden relative z-50">
      
      <style>{`
        * { -webkit-tap-highlight-color: transparent !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* 🚀 HIDE DESKTOP BROWSER SPINNER ARROWS */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] { 
          -moz-appearance: textfield; 
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 py-3 border-b border-white/[0.04] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white uppercase">{tokenSymbol} HQ</span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_5px_#00FF66]"></span>
              <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest">
    {token?.onlineCount || '1,420'} Online
  </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-[#00FF66] font-mono">${token?.price || '0.0000'}</span>
            <span className={`text-[10px] font-black font-mono ${isPnlPositive ? 'text-[#089981]' : 'text-rose-500'}`}>
              PnL: {userPnlPercent}
            </span>
          </div>
          <button 
            onClick={() => setIsBuyModalOpen(true)}
            className={`px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-white shadow-lg transition-colors active:scale-95 ${displayToken.isGraduated ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-black' : 'bg-[#089981] hover:bg-[#06806b] shadow-[0_0_15px_rgba(8,153,129,0.3)]'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Trade</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>
      </header>

      {/* --- TOP HOLDERS --- */}
      <div className="flex-none bg-[#121212] border-b border-white/[0.03] py-2 px-4 shadow-inner z-30 relative">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Top Room Holders</span>
          <span onClick={() => setIsHoldersModalOpen(true)} className="text-[10px] font-bold text-[#089981] cursor-pointer hover:text-white transition-colors">View All</span>
        </div>
       <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {topHolders.map((whale, idx) => (
            <div key={whale.id} onClick={() => onOpenProfile ? onOpenProfile(whale.name) : setIsHoldersModalOpen(true)} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
              <div className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-105 ${idx === 0 ? 'border-amber-400' : 'border-white/10'}`}>
                <img src={whale.avatar} alt={whale.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[8px] font-black text-zinc-400">{whale.holding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- PINNED DEV ANNOUNCEMENT BANNER --- */}
      <div className="flex-none bg-gradient-to-r from-amber-500/20 via-[#121212] to-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">Pinned</span>
          <p className="text-[11px] font-bold text-amber-200 truncate">🎯 Target: Raydium graduation at 85 SOL. Keep pushing!</p>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-2">ApexDev</span>
      </div>

      {/* --- CHAT FEED --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#050505]" onClick={() => setActiveReactionId(null)}>
        {messages.map((dbMsg) => {
            // 🚀 ADAPTER: Translate Supabase database fields into your custom UI fields
            const msg = {
              id: dbMsg.id,
              text: dbMsg.content,
              sender: dbMsg.user_address,
              isMe: dbMsg.user_address === (myName || 'Anon'),
              time: dbMsg.created_at ? new Date(dbMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
              avatar: dbMsg.avatar || null,
              badge: null,
              isDev: false, 
              reactions: dbMsg.reactions || {},
              image: dbMsg.image || null,
              isSystem: false
            };

            if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center w-full my-2 animate-slideUpNative">
                <div className="bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] px-4 py-2 rounded-xl text-xs font-mono font-bold text-center max-w-[90%] shadow-[0_0_10px_rgba(0,255,102,0.1)]">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} mb-1`}>
              <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : 'items-start'} group relative`}>
                
                <div className={`flex items-center gap-1.5 mb-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!msg.isMe && (
                    <div 
                      onClick={() => onOpenProfile && onOpenProfile(msg.sender)}
                      className={`w-4 h-4 rounded-full overflow-hidden shrink-0 border ${msg.isDev ? 'border-amber-400' : 'border-white/10'} bg-black cursor-pointer hover:border-[#089981] transition-colors`}
                    >
                      <img src={msg.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span 
                    onClick={() => onOpenProfile && onOpenProfile(msg.sender)}
                    className={`text-[10px] font-black ${msg.isDev ? 'text-amber-400' : 'text-zinc-400'} cursor-pointer hover:text-white transition-colors`}
                  >
                    {(msg.sender || '').startsWith('@') ? msg.sender : `@${msg.sender}`}
                  </span>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${msg.isDev ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : msg.isMe ? 'bg-[#089981]/20 text-[#089981]' : 'bg-white/10 text-zinc-300'}`}>
                    {msg.badge}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-600">{msg.time}</span>
                </div>

                <div className="relative cursor-pointer w-full" onMouseEnter={() => setActiveReactionId(msg.id)} onClick={(e) => { e.stopPropagation(); setActiveReactionId(msg.id); }}>
                  <div className={`absolute ${msg.isMe ? '-top-10 right-0' : '-top-10 left-0'} bg-[#121212] border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-2 shadow-xl z-10 transition-all ${activeReactionId === msg.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    {['🚀', '💎', '🐳', '🔥'].map(emoji => (
                      <button key={emoji} onClick={() => handleAddReaction(msg.id, emoji)} className="hover:scale-125 transition-transform text-sm">{emoji}</button>
                    ))}
                  </div>

                  <div className={`rounded-2xl text-sm shadow-md flex flex-col ${msg.isDev ? 'bg-gradient-to-r from-amber-500/20 to-[#1A1A24] border border-amber-500/40 text-amber-100 rounded-bl-sm shadow-[0_0_15px_rgba(251,191,36,0.15)]' : msg.isMe ? 'bg-[#089981] text-white rounded-br-sm' : 'bg-[#1A1A24] border border-white/5 text-zinc-200 rounded-bl-sm'} ${msg.text ? 'px-4 py-2.5' : 'p-1'}`}>
                    {msg.image && (
    <img 
      src={msg.image} 
      alt="attachment" 
      onClick={() => setFullscreenImage(msg.image)}
      className="max-w-[200px] sm:max-w-[250px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity active:scale-95" 
    />
  )}
                    {msg.text && renderFormattedText(msg.text, msg.isMe)}
                  </div>

                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="bg-[#1A1A24] border border-white/10 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 text-zinc-300 font-mono">
                          {emoji} <span className="font-bold text-white">{count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="flex-none bg-[#0E0E14] border-t border-white/[0.05] p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSendMessage} className="flex items-end gap-1.5 bg-black border border-white/10 focus-within:border-[#089981]/50 rounded-3xl p-1.5 transition-all shadow-inner">
          
          <div className="flex items-center shrink-0">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()} 
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button 
              type="button" 
              onClick={handleSendMockGif}
              className="p-2 text-zinc-500 hover:text-[#089981] transition-colors font-black text-xs"
            >
              GIF
            </button>
          </div>

          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={`Shill the trenches using $${tokenSymbol}...`} className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none py-3 px-1 min-w-0" />
          
          <button type="submit" disabled={!inputText.trim()} className="p-3 bg-[#089981] hover:bg-[#06806b] disabled:bg-[#089981]/30 text-white rounded-full transition-all active:scale-90 shrink-0 shadow-[0_0_10px_rgba(8,153,129,0.3)]"><svg className="w-4 h-4 translate-x-0.5 -translate-y-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
        </form>
      </div>

      {/* --- HOLDERS LEDGER MODAL --- */}
      {isHoldersModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsHoldersModalOpen(false)}></div>
          <div className="bg-[#050505] border-t border-white/10 rounded-t-3xl w-full max-w-xl h-[80vh] p-6 relative z-10 animate-slideUpNative flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Top Room Holders</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">Verified Supply Distribution</p>
              </div>
              <button onClick={() => setIsHoldersModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 space-y-2">
              {topHolders.map((holder, index) => (
                <div key={holder.id} onClick={() => { setIsHoldersModalOpen(false); if(onOpenProfile) onOpenProfile(holder.name); }} className="bg-[#121212] border border-white/5 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-[#089981]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-4">#{index + 1}</span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={holder.avatar} alt={holder.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">{holder.name}</span>
                      <span className="text-[11px] font-mono text-zinc-500">{holder.address}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-mono font-black text-[#089981]">{holder.holding}</span>
                    <span className="text-[11px] font-mono text-zinc-400">{holder.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- INLINE TRADE MODAL --- */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
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

             {/* 🚀 INJECT THE MASTER COMPONENT HERE */}
          <TradeWidget 
            displayToken={displayToken}
            tradeMode={tradeMode}
            setTradeMode={setTradeMode}
            tradeAmount={tradeAmount}
            setTradeAmount={setTradeAmount}
            userBalanceSol={userBalance} 
            userTokenBalance={userTokenBalance}
            handleExecuteTrade={handleExecuteTrade}
            isProcessing={isProcessing}
            curveState={curveState}
          />
          </div>
        </div>
      )}

{/* --- FULLSCREEN IMAGE POPUP --- */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn cursor-zoom-out p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img 
            src={fullscreenImage} 
            alt="Fullscreen attachment" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slideUpNative"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}