// 🚀 VERSION 6.0: THE MODULAR WALLET (Clean Architecture & Layout Fixes)
import React, { useState, useEffect, useRef } from 'react';
import AccountSettingsSystem from './AccountSettingsSystem';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// 📦 Import our newly extracted Modular Payment Screens
import DepositModal from './DepositModal';
import SendModal from './SendModal';
import WithdrawModal from './WithdrawModal';
import SwapModal from './SwapModal';

export default function Wallet({ setActivePage, onOpenProfile, onOpenSettings, onOpenAccountDrawer, portfolio = [], transactions = [], createdTokens = [], onAddTransaction, userProfile }) {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const [isMuted, setIsMuted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); 
  const [copied, setCopied] = useState(false);
  const [settingsView, setSettingsView] = useState(null);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('assets'); 
  
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [viewAll, setViewAll] = useState({ assets: false, created: false });
  
  const [showWalletManager, setShowWalletManager] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollContainerRef = useRef(null);
  const tabsRef = useRef(null); 

  const displayAvatar = userProfile?.avatar;
  const displayUsername = userProfile?.username || '@User';
  const shortAddress = connected && publicKey ? `${publicKey.toBase58().slice(0,4)}...${publicKey.toBase58().slice(-4)}` : 'Connect Wallet';
  const walletAddress = connected && publicKey ? publicKey.toBase58() : "Not Connected";

  const otherAccounts = [
    { username: 'turbosharkpious', address: 'FihWW...fgskM', balance: '$0.07', avatar: '🦈' }
  ];

  // Component States
  const [depositStep, setDepositStep] = useState(1);
  const [depositMethod, setDepositMethod] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [showFiatDropdown, setShowFiatDropdown] = useState(false); 

  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const [withdrawStep, setWithdrawStep] = useState(1);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [showWithdrawFiatDropdown, setShowWithdrawFiatDropdown] = useState(false);
  const [selectedWithdrawFiatProvider, setSelectedWithdrawFiatProvider] = useState('bank');

  const [swapAmount, setSwapAmount] = useState('');
  const [swapPayAsset, setSwapPayAsset] = useState('SOL');
  const [swapReceiveAsset, setSwapReceiveAsset] = useState(portfolio.length > 1 ? portfolio[1].symbol : 'SOL');
  const [showPayDropdown, setShowPayDropdown] = useState(false);
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);

  const totalNetWorth = portfolio.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
  const displayNetWorth = `$${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getAssetColor = (symbol) => {
    if (symbol === 'SOL') return 'from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/20';
    const colors = [
      'from-[#089981]/20 to-emerald-500/20 text-[#089981] border-[#089981]/20',
      'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/20',
      'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/20',
      'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/20'
    ];
    const charCode = symbol.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const depositMethods = [
    { id: 'Crypto', icon: '⛓️', label: 'Crypto Transfer', type: 'crypto', sub: 'Deposit via Wallet or QR' },
    { id: 'Card', icon: '💳', label: 'Buy with Card', type: 'fiat', sub: 'Instant via Card, GPay, or Bank' }
  ];
  const withdrawMethods = [
    { id: 'Fiat', icon: '🏦', label: 'Fiat Off-Ramp', type: 'fiat', sub: 'Withdraw to Bank or Card' },
    { id: 'Crypto', icon: '⛓️', label: 'Crypto Transfer', type: 'crypto', sub: 'Withdraw to External Wallet' }
  ];

  const fiatProviders = [
    { id: 'moonpay', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'gpay', label: 'Google Pay', icon: 'G' },
    { id: 'revolut', label: 'Revolut Pay', icon: 'R' },
    { id: 'paypal', label: 'PayPal Instant', icon: 'P' }
  ];
  const withdrawFiatProviders = [
    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'coinbase', label: 'Coinbase', icon: '🔵' },
    { id: 'paypal', label: 'PayPal', icon: 'P' }
  ];

  const [selectedFiatProvider, setSelectedFiatProvider] = useState('moonpay');

  const formatNumber = (val) => {
    if (!val && val !== 0) return '';
    let [integer, decimal] = val.toString().replace(/,/g, '').split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal !== undefined ? `${integer}.${decimal}` : integer;
  };

  const formatBalance = (val) => {
    if (!val) return '0';
    return Number(val).toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleNumpad = (val) => {
    let currentAmount = '';
    if (activeModal === 'deposit') currentAmount = depositAmount;
    if (activeModal === 'send') currentAmount = sendAmount;
    if (activeModal === 'withdraw') currentAmount = withdrawAmount;
    if (activeModal === 'swap') currentAmount = swapAmount;

    let raw = currentAmount.replace(/,/g, '');
    
    if (val === 'back') { 
      raw = raw.slice(0, -1); 
    } else {
      if (raw === '' && val === '.') return;
      if (val === '.' && raw.includes('.')) return;
      raw = raw + val;
    }
    
    if (activeModal === 'deposit') setDepositAmount(formatNumber(raw));
    if (activeModal === 'send') setSendAmount(formatNumber(raw));
    if (activeModal === 'withdraw') setWithdrawAmount(formatNumber(raw));
    if (activeModal === 'swap') setSwapAmount(formatNumber(raw));
  };

  const handleWithdrawQuickAmount = (amount) => setWithdrawAmount(formatNumber(amount));

  const handleCryptoPercentage = (percentStr, isSend = true) => {
    const assetTicker = 'SOL';
    const assetConfig = portfolio.find(a => a.symbol === assetTicker) || { balance: 0 };
    const balance = parseFloat(assetConfig.balance.toString().replace(/,/g, ''));
    let pct = 0;
    if (percentStr === '25%') pct = 0.25;
    if (percentStr === '50%') pct = 0.50;
    if (percentStr === '75%') pct = 0.75;
    if (percentStr === 'MAX') pct = 1;
    const calcAmount = (balance * pct).toFixed(4);
    
    if (isSend) setSendAmount(formatNumber(calcAmount));
    else setWithdrawAmount(formatNumber(calcAmount));
  };

  const handleCopyAddress = (e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModals = () => { 
    setActiveModal(null); 
    setDepositAmount(''); setDepositStep(1); setDepositMethod(''); setShowFiatDropdown(false);
    setSendAmount(''); setSendAddress(''); 
    setWithdrawAmount(''); setWithdrawStep(1); setWithdrawMethod(''); setWithdrawAddress(''); setShowWithdrawFiatDropdown(false); 
    setSwapAmount(''); setShowPayDropdown(false); setShowReceiveDropdown(false);
  };

  const flipSwap = () => {
    const temp = swapPayAsset;
    setSwapPayAsset(swapReceiveAsset);
    setSwapReceiveAsset(temp);
  };

  // 🚀 FIXED: Properly hooks into your main application settings via onOpenSettings prop
  const handleOpenSettings = () => {
    setShowWalletManager(false);
    setIsMenuOpen(false);
    if (typeof onOpenSettings === 'function') {
      onOpenSettings();
    } else {
      setSettingsView('settings');
    }
  };

  const activeMethodConfig = depositMethods.find(m => m.id === depositMethod);
  const activeFiatConfig = fiatProviders.find(p => p.id === selectedFiatProvider);
  const activeWithdrawMethodConfig = withdrawMethods.find(m => m.id === withdrawMethod);
  const activeWithdrawFiatConfig = withdrawFiatProviders.find(p => p.id === selectedWithdrawFiatProvider);
  const activePayAsset = portfolio.find(a => a.symbol === swapPayAsset) || portfolio[0];
  const activeReceiveAsset = portfolio.find(a => a.symbol === swapReceiveAsset) || portfolio[1] || portfolio[0];

  const handleExecuteDeposit = () => {
    if (!depositAmount || depositAmount === '0') return;
    const newTx = {
      id: Date.now().toString(),
      type: 'Deposit',
      details: `Funded via ${activeFiatConfig?.label || 'Fiat'}`,
      time: 'Just now',
      amount: `+ $${depositAmount}`,
      color: 'text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]',
      hash: Math.random().toString(36).substring(2, 10)
    };
    if (onAddTransaction) onAddTransaction(newTx);
    closeModals();
    setActiveTab('activity');
  };

  const handleExecuteSend = () => {
    if (!sendAmount || sendAmount === '0' || !sendAddress) return;
    const shortRecipient = `${sendAddress.slice(0,4)}...${sendAddress.slice(-4)}`;
    const newTx = {
      id: Date.now().toString(),
      type: 'Sent',
      details: `To ${shortRecipient}`,
      time: 'Just now',
      amount: `- ${sendAmount} SOL`,
      color: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]',
      hash: Math.random().toString(36).substring(2, 10)
    };
    if (onAddTransaction) onAddTransaction(newTx);
    closeModals();
    setActiveTab('activity');
  };

  const handleExecuteWithdraw = () => {
    if (!withdrawAmount || withdrawAmount === '0') return;
    const isCrypto = activeWithdrawMethodConfig?.type === 'crypto';
    const destName = isCrypto ? `${withdrawAddress.slice(0,4)}...${withdrawAddress.slice(-4)}` : activeWithdrawFiatConfig?.label;
    
    const newTx = {
      id: Date.now().toString(),
      type: 'Withdraw',
      details: `To ${destName || 'External'}`,
      time: 'Just now',
      amount: `- ${withdrawAmount} ${isCrypto ? 'SOL' : 'USD'}`,
      color: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]',
      hash: Math.random().toString(36).substring(2, 10)
    };
    if (onAddTransaction) onAddTransaction(newTx);
    closeModals();
    setActiveTab('activity');
  };

  const handleExecuteSwap = () => {
    if (!swapAmount || swapAmount === '0') return;
    const rcvAmount = formatNumber((parseFloat(swapAmount.replace(/,/g, '')) * 1.5).toFixed(2));
    const newTx = {
      id: Date.now().toString(),
      type: 'Swap',
      details: `Swapped ${activePayAsset?.symbol} for ${activeReceiveAsset?.symbol}`,
      time: 'Just now',
      amount: `+ ${rcvAmount} ${activeReceiveAsset?.symbol}`,
      color: 'text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]',
      hash: Math.random().toString(36).substring(2, 10)
    };
    if (onAddTransaction) onAddTransaction(newTx);
    closeModals();
    setActiveTab('activity');
  };

  // 🚀 FIXED: Ignore input elements so it never double-types on Android
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModal) return;
      if (activeModal === 'deposit' && depositStep === 2 && activeMethodConfig?.type === 'crypto') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key >= '0' && e.key <= '9') { handleNumpad(e.key); } 
      else if (e.key === '.') { handleNumpad('.'); } 
      else if (e.key === 'Backspace') { handleNumpad('back'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, depositAmount, sendAmount, withdrawAmount, swapAmount, depositStep, withdrawStep]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 150);
  };

  const toggleViewAll = (tab) => {
    const isExpanding = !viewAll[tab];
    setViewAll({ ...viewAll, [tab]: isExpanding });
    
    if (!isExpanding && tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAssetClick = (symbol) => {
    if (symbol === 'SOL') {
      setActiveModal('deposit');
      setDepositStep(1);
    } else {
      if(setActivePage) setActivePage('tokenHome');
    }
  };

  const handleActivityClick = (hash) => {
    if (hash) window.open(`https://solscan.io/tx/${hash}`, '_blank');
  };

  const sortedPortfolio = [...portfolio].sort((a, b) => {
    if (a.symbol === 'SOL') return -1;
    if (b.symbol === 'SOL') return 1;
    return b.valueUSD - a.valueUSD;
  });

  const visiblePortfolio = viewAll.assets ? sortedPortfolio : sortedPortfolio.slice(0, 5);
  const visibleActivity = transactions.slice(0, 5);
  const visibleCreated = viewAll.created ? createdTokens : createdTokens.slice(0, 5);

  return (
    <>
      <div className="flex flex-col w-full h-screen overflow-hidden bg-[#030303] text-white selection:bg-[#089981]/30 font-sans relative">
        
        {/* --- HEADER --- */}
        <header className="flex-none z-40 bg-[#030303]/90 backdrop-blur-3xl px-4 sm:px-6 py-3 border-b border-white/[0.02] flex items-center justify-between sticky top-0 relative">
          
          <div className="flex items-center min-w-0 z-10 w-2/5">
            <div onClick={(e) => { e.stopPropagation(); setShowWalletManager(true); }} className="flex items-center gap-2 sm:gap-3 cursor-pointer group w-full min-w-0">
               <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/5 overflow-hidden bg-[#121212] flex items-center justify-center shadow-inner group-hover:border-[#089981]/50 transition-colors shrink-0">
                 {displayAvatar ? (
                   <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-sm">👨‍💻</span>
                 )}
               </div>
               
               <div className="flex flex-col min-w-0 justify-center flex-1">
                  <span className="text-[13px] sm:text-sm font-black text-white tracking-wide truncate group-hover:text-[#089981] transition-colors leading-tight">
                    {displayUsername}
                  </span>
                  
                  <div className="flex items-center mt-0.5 w-full min-w-0">
                    {connected ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCopyAddress(e); }}
                        className="flex items-center gap-1.5 group/copy hover:bg-white/5 py-0.5 pr-1 -ml-1 rounded-md transition-colors cursor-pointer w-full min-w-0"
                        title="Copy Address"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_5px_#00FF66] animate-pulse shrink-0"></span>
                        <span className="text-[10px] text-zinc-400 group-hover/copy:text-white font-mono font-bold truncate transition-colors flex-1 text-left min-w-0">
                          {shortAddress}
                        </span>
                        {/* 🚀 FIXED: Copy icon protected by min-w-[12px] and shrink-0 */}
                        <div className="shrink-0 flex items-center justify-center">
                          {copied ? (
                            <svg className="w-3 h-3 min-w-[12px] min-h-[12px] shrink-0 text-[#00FF66]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-3 h-3 min-w-[12px] min-h-[12px] shrink-0 text-zinc-600 group-hover/copy:text-[#089981] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          )}
                        </div>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 w-full min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e] shrink-0"></span>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest truncate min-w-0">Disconnected</span>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>

          <div className="absolute inset-x-28 top-0 bottom-0 flex justify-center items-center pointer-events-none z-0">
            <div className={`transition-all duration-300 transform w-full flex justify-center ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="text-[13px] font-black text-white tracking-tight truncate block text-center w-full">{isMuted ? '••••••' : displayNetWorth}</span>
            </div>
          </div>

          <div className="flex items-center justify-end z-10 shrink-0 w-12">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-all shadow-md group relative cursor-pointer"
            >
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto no-scrollbar pb-32"
        >
          <div className="flex flex-col w-full max-w-4xl mx-auto">
            
            <section className="bg-gradient-to-b from-[#0A0A0A] to-[#050505] border-b border-white/[0.04] p-6 sm:p-8 flex flex-col items-center relative shadow-sm rounded-b-3xl mb-4 overflow-hidden">
              
              <div className="flex items-center justify-center gap-2 mb-3 z-10 w-full px-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] truncate shrink">Estimated Net Worth</p>
                <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-white transition-colors shrink-0 flex items-center justify-center outline-none">
                  {/* 🚀 FIXED: Premium Eye SVG protected by shrink-0 and min-width */}
                  {isMuted ? (
                    <svg className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] shrink-0 text-zinc-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  ) : (
                    <svg className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] shrink-0 text-zinc-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-sans tracking-tight font-bold text-white z-10 leading-none transition-opacity duration-300 truncate max-w-full w-full px-4 text-center ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                {isMuted ? '••••••' : displayNetWorth}
              </h2>

              <div className={`flex items-center gap-2 mt-3 mb-8 z-10 transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                 <span className="text-sm font-black text-[#089981] font-mono leading-none">+$450.00</span>
                 <span className="text-[9px] font-black bg-[#089981]/10 text-[#089981] px-1.5 py-0.5 rounded uppercase tracking-widest border-[#089981]/20 shadow-[0_0_10px_rgba(8,153,129,0.1)] leading-none">+2.4% Today</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-[400px] mx-auto z-10">
                {[
                  { id: 'deposit', label: 'Deposit', icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                  { id: 'send', label: 'Send', icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> },
                  { id: 'withdraw', label: 'Withdraw', icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
                  { id: 'swap', label: 'Swap', icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> }
                ].map((btn) => (
                  <button 
                    key={btn.id} 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveModal(btn.id.toLowerCase()); 
                      setDepositStep(1); 
                      setWithdrawStep(1); 
                    }} 
                    className="flex flex-col items-center gap-2 group z-50 cursor-pointer"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 text-zinc-400 group-hover:bg-[#089981]/10 group-hover:text-[#089981] group-hover:border-[#089981]/30 group-hover:shadow-[0_0_15px_rgba(8,153,129,0.15)] shrink-0">
                      {btn.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-500 group-hover:text-zinc-200 transition-colors uppercase tracking-wide truncate max-w-full">{btn.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <div ref={tabsRef} className="px-4 mb-4 scroll-mt-24">
              <div className="flex bg-[#0A0A0A] border border-white/[0.04] p-1.5 rounded-2xl w-full max-w-[420px] mx-auto shadow-inner">
                {['assets', 'activity', 'created'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-[#089981] text-white shadow-[0_0_20px_rgba(8,153,129,0.3)]' : 'text-zinc-500 hover:text-zinc-200'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4">
              {/* ASSETS TAB */}
              {activeTab === 'assets' && (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  {visiblePortfolio.map(asset => (
                    <div key={asset.symbol} onClick={() => handleAssetClick(asset.symbol)} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/[0.03] rounded-2xl hover:bg-[#0D0D0D] hover:border-white/10 transition-all duration-300 cursor-pointer group shadow-lg">
                       <div className="flex items-center gap-4 min-w-0">
                         <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border shadow-inner overflow-hidden shrink-0 ${asset.imagePreview ? 'bg-black border-white/10' : `bg-gradient-to-br ${getAssetColor(asset.symbol)}`}`}>
                           {asset.imagePreview ? (
                             <img src={asset.imagePreview} alt={asset.symbol} className="w-full h-full object-cover" />
                           ) : (
                             <span className="select-none">{asset.icon}</span>
                           )}
                         </div>
                         <div className="flex flex-col min-w-0">
                           <div className="font-black text-sm tracking-wide text-zinc-200 group-hover:text-white transition-colors uppercase truncate">{asset.symbol}</div>
                           <div className="text-[11px] text-zinc-500 font-semibold tracking-wide truncate">{asset.name}</div>
                         </div>
                       </div>
                       
                       <div className="text-right shrink-0 pl-3">
                         <div className="font-black text-sm tracking-tight text-zinc-200 group-hover:text-white">
                           {isMuted ? '••••••' : formatBalance(asset.balance)}
                         </div>
                         <div className="flex items-center justify-end gap-1.5 mt-0.5">
                           <div className="text-[11px] text-zinc-500 font-semibold">
                             {isMuted ? '•••' : `$${(asset.valueUSD || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                           </div>
                           {!isMuted && (
                             <span className={`text-[9px] font-black tracking-widest ${asset.change !== undefined && asset.change < 0 ? 'text-rose-500' : 'text-[#089981]'}`}>
                               {asset.change !== undefined ? (asset.change > 0 ? '+' : '') + asset.change + '%' : '+5.2%'}
                             </span>
                           )}
                         </div>
                       </div>
                    </div>
                  ))}
                  
                  {portfolio.length > 5 && (
                    <button onClick={() => toggleViewAll('assets')} className="w-full py-3.5 mt-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors shadow-sm">
                      {viewAll.assets ? 'View Less' : `View All ${portfolio.length} Assets`}
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
                    <button 
                      onClick={() => setActivePage && setActivePage('explore')}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-[#121212] hover:bg-[#1A1A24] border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 active:scale-95 shadow-lg"
                    >
                      Explore 🔍
                    </button>
                    <button 
                      onClick={() => setActivePage && setActivePage('earn')}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#089981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(8,153,129,0.2)] hover:shadow-[0_15px_40px_rgba(8,153,129,0.4)] transition-all duration-300 active:scale-95"
                    >
                      Earn Yield 💰
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === 'activity' && (
                <div className="flex flex-col gap-2 animate-fadeIn">
                  {transactions.length > 0 ? (
                    <>
                      {visibleActivity.map((tx) => (
                        <div key={tx.id} onClick={() => handleActivityClick(tx.hash)} className="flex justify-between items-center p-4 bg-[#0A0A0A] rounded-2xl border border-white/[0.03] hover:bg-[#0D0D0D] transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/5 group-hover:border-white/20 transition-colors shrink-0`}>
                              {tx.type === 'Swap' && <svg className="w-5 h-5 text-[#00FF66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                              {tx.type === 'Deposit' && <svg className="w-5 h-5 text-[#00FF66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                              {tx.type === 'Sent' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                              {tx.type === 'Withdraw' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                              {tx.type === 'Deploy' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-black tracking-wider text-zinc-200 group-hover:text-white truncate">{tx.type}</span>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] text-zinc-500 font-medium truncate sm:max-w-[200px]">{tx.details}</span>
                                <span className="text-[8px] uppercase tracking-widest text-zinc-600 shrink-0">• {tx.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs font-black tracking-widest ${tx.color}`}>{isMuted ? '••••' : tx.amount}</span>
                            <svg className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </div>
                        </div>
                      ))}
                      
                      {transactions.length > 5 && (
                        <button onClick={() => setShowFullHistory(true)} className="w-full py-3.5 mt-2 mb-8 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors shadow-sm">
                          See All Activity ›
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
                        <button onClick={() => setActivePage && setActivePage('explore')} className="w-full flex items-center justify-center gap-2 py-4 bg-[#121212] hover:bg-[#1A1A24] border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 active:scale-95 shadow-lg">
                          Explore 🔍
                        </button>
                        <button onClick={() => setActivePage && setActivePage('earn')} className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#089981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(8,153,129,0.2)] hover:shadow-[0_15px_40px_rgba(8,153,129,0.4)] transition-all duration-300 active:scale-95">
                          Earn Yield 💰
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border border-white/[0.02] bg-[#0A0A0A] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                      <span className="text-4xl mb-4 opacity-50">📭</span>
                      <span className="text-zinc-500 text-xs font-black tracking-[0.2em] uppercase">No transactions yet</span>
                    </div>
                  )}
                </div>
              )}

              {/* CREATED TAB */}
              {activeTab === 'created' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  {createdTokens.length > 0 ? (
                    <>
                      {visibleCreated.map((token, index) => (
                        <div key={index} onClick={() => setActivePage('tokenHome')} className="p-5 bg-[#0A0A0A] border border-white/[0.03] rounded-2xl hover:border-[#089981]/30 transition-all duration-300 shadow-lg flex flex-col gap-4 group cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#089981]/20 to-emerald-500/20 flex items-center justify-center font-bold text-sm text-[#089981] border border-[#089981]/30 shadow-inner group-hover:scale-105 transition-transform shrink-0">{token.symbol.charAt(0)}</div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-white tracking-wide group-hover:text-[#089981] transition-colors">{token.symbol}</span>
                                <span className="text-[10px] text-zinc-500 font-bold">{token.name}</span>
                              </div>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border shrink-0 ${token.isGraduated ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-[#00FF66] bg-[#00FF66]/10 border-[#00FF66]/20'}`}>
                              {token.isGraduated ? 'Graduated' : 'Active'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.03]">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Bonding Curve</span>
                              <span className="text-xs font-black text-zinc-200 mt-0.5">{token.progress ? token.progress.toFixed(1) : '0.0'}% Sold</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Royalties Earned</span>
                              <span className="text-xs font-black text-[#00FF66] mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]">{token.royalties || '0.00 SOL'}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {createdTokens.length > 5 && (
                        <button onClick={() => toggleViewAll('created')} className="w-full py-3.5 mt-2 mb-8 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors shadow-sm">
                          {viewAll.created ? 'View Less' : 'View All Launches'}
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
                        <button onClick={() => setActivePage && setActivePage('explore')} className="w-full flex items-center justify-center gap-2 py-4 bg-[#121212] hover:bg-[#1A1A24] border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 active:scale-95 shadow-lg">
                          Explore 🔍
                        </button>
                        <button onClick={() => setActivePage && setActivePage('earn')} className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#089981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(8,153,129,0.2)] hover:shadow-[0_15px_40px_rgba(8,153,129,0.4)] transition-all duration-300 active:scale-95">
                          Earn Yield 💰
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border border-white/[0.02] bg-[#0A0A0A] rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl mb-4 opacity-50">🛠️</span>
                      <span className="text-zinc-500 text-xs font-black tracking-[0.2em] uppercase mb-6">No Tokens Launched</span>
                      <button onClick={() => setActivePage && setActivePage('deploy')} className="bg-[#089981]/10 text-[#089981] border border-[#089981]/30 hover:bg-[#089981]/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Go to Forge</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 ALL 4 MODALS ARE RENDERED EXTERNALLY NOW */}
      <DepositModal
        isOpen={activeModal === 'deposit'}
        onClose={closeModals}
        depositStep={depositStep}
        setDepositStep={setDepositStep}
        depositMethod={depositMethod}
        setDepositMethod={setDepositMethod}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        selectedFiatProvider={selectedFiatProvider}
        setSelectedFiatProvider={setSelectedFiatProvider}
        showFiatDropdown={showFiatDropdown}
        setShowFiatDropdown={setShowFiatDropdown}
        depositMethods={depositMethods}
        fiatProviders={fiatProviders}
        walletAddress={walletAddress}
        handleCopyAddress={handleCopyAddress}
        copied={copied}
        handleExecuteDeposit={handleExecuteDeposit}
        formatNumber={formatNumber}
      />

      <SendModal
        isOpen={activeModal === 'send'}
        onClose={closeModals}
        sendAddress={sendAddress}
        setSendAddress={setSendAddress}
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        portfolio={portfolio}
        handleExecuteSend={handleExecuteSend}
        formatNumber={formatNumber}
        formatBalance={formatBalance}
        handleCryptoPercentage={handleCryptoPercentage}
      />

      <WithdrawModal
        isOpen={activeModal === 'withdraw'}
        onClose={closeModals}
        withdrawStep={withdrawStep}
        setWithdrawStep={setWithdrawStep}
        withdrawMethod={withdrawMethod}
        setWithdrawMethod={setWithdrawMethod}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawAddress={withdrawAddress}
        setWithdrawAddress={setWithdrawAddress}
        selectedWithdrawFiatProvider={selectedWithdrawFiatProvider}
        setSelectedWithdrawFiatProvider={setSelectedWithdrawFiatProvider}
        showWithdrawFiatDropdown={showWithdrawFiatDropdown}
        setShowWithdrawFiatDropdown={setShowWithdrawFiatDropdown}
        withdrawMethods={withdrawMethods}
        withdrawFiatProviders={withdrawFiatProviders}
        portfolio={portfolio}
        displayNetWorth={displayNetWorth}
        handleExecuteWithdraw={handleExecuteWithdraw}
        formatNumber={formatNumber}
        formatBalance={formatBalance}
        handleCryptoPercentage={handleCryptoPercentage}
        handleWithdrawQuickAmount={handleWithdrawQuickAmount}
      />

      <SwapModal
        isOpen={activeModal === 'swap'}
        onClose={closeModals}
        swapAmount={swapAmount}
        setSwapAmount={setSwapAmount}
        swapPayAsset={swapPayAsset}
        setSwapPayAsset={setSwapPayAsset}
        swapReceiveAsset={swapReceiveAsset}
        setSwapReceiveAsset={setSwapReceiveAsset}
        showPayDropdown={showPayDropdown}
        setShowPayDropdown={setShowPayDropdown}
        showReceiveDropdown={showReceiveDropdown}
        setShowReceiveDropdown={setShowReceiveDropdown}
        portfolio={portfolio}
        flipSwap={flipSwap}
        handleExecuteSwap={handleExecuteSwap}
        formatNumber={formatNumber}
        formatBalance={formatBalance}
        getAssetColor={getAssetColor}
      />

      {showWalletManager && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowWalletManager(false)}>
          <div className="w-full max-w-sm bg-[#050505] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-slideUpNative shadow-[0_0_50px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Your Accounts</h3>
              <button onClick={() => setShowWalletManager(false)} className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full shrink-0"><svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            {connected ? (
              <>
                <div onClick={() => { setShowWalletManager(false); setSettingsView('editProfile'); }} className="bg-gradient-to-r from-[#121212] to-[#0A0A0A] border border-[#089981]/50 rounded-3xl p-5 shadow-[0_0_30px_rgba(8,153,129,0.15)] relative overflow-hidden flex flex-col mb-6 cursor-pointer hover:border-[#089981] transition-all group">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start z-10 w-full mb-6">
                    <div className="w-14 h-14 bg-black border-2 border-[#089981] rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                       {displayAvatar ? <img src={displayAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`} alt="You" className="w-full h-full object-cover" />}
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); setShowWalletManager(false); setSettingsView('editProfile'); }} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors text-white shrink-0">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-end z-10 w-full">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xl font-black text-white leading-tight truncate">{displayUsername.replace('@', '')}</span>
                      <span className="text-xs font-mono font-bold text-zinc-500 mt-0.5 truncate">{shortAddress}</span>
                    </div>
                    <span className="text-2xl font-black text-white font-mono tracking-tight shrink-0">{displayNetWorth}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-white/10 w-full"></div>
                  <span className="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap shrink-0">Other Accounts</span>
                  <div className="h-px bg-white/10 w-full"></div>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {otherAccounts.map((acc, idx) => (
                    <div key={idx} className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#1A1A24] transition-colors group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0">{acc.avatar}</div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-white truncate">{acc.username}</span>
                          <span className="text-[10px] font-mono font-bold text-zinc-500 truncate">{acc.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-base font-black text-white font-mono">{acc.balance}</span>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors shrink-0">
                           <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full bg-[#121212] border border-white/10 hover:border-[#089981]/50 text-white font-black text-sm uppercase py-4 rounded-xl tracking-widest shadow-sm transition-all flex items-center justify-center gap-2">
                    <span>+</span> Create Burner Wallet
                  </button>
                </div>

                <button onClick={handleOpenSettings} className="w-full flex justify-between items-center py-5 mt-6 border-t border-white/10 group">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">App Preferences & Security</span>
                  <span className="text-zinc-600 group-hover:text-white shrink-0">›</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 shrink-0">
                  <svg className="w-8 h-8 text-zinc-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <h4 className="text-lg font-black text-white mb-2">Connect a Wallet</h4>
                <p className="text-xs text-zinc-400 text-center mb-6 px-4">Connect your Solana wallet to view balances, deploy assets, and access the social network.</p>
                <div className="w-full">
                  <button onClick={() => { setShowWalletManager(false); setVisible(true); }} className="w-full bg-[#089981] hover:bg-[#06806b] h-12 rounded-xl font-black text-sm tracking-widest uppercase flex items-center justify-center transition-all text-white shadow-[0_0_20px_rgba(8,153,129,0.3)]">
                    Connect Options
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-72 h-full bg-[#050505] border-l border-white/10 flex flex-col shadow-2xl animate-slideInRight z-10">
            
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Settings</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors shrink-0">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-2">
              
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3">Network</span>
                <div className="mt-2 flex flex-col gap-1">
                  <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Mainnet Beta</span>
                    <span className="w-2 h-2 rounded-full bg-[#089981] shadow-[0_0_5px_#089981] shrink-0"></span>
                  </button>
                  <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <span className="text-sm font-bold text-zinc-500 group-hover:text-white">Devnet</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3">Security</span>
                <div className="mt-2 flex flex-col gap-1">
                  <button onClick={handleOpenSettings} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <svg className="w-5 h-5 text-zinc-500 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">App Settings & Preferences</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <svg className="w-5 h-5 text-zinc-500 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Show Private Key</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3">Links</span>
                <div className="mt-2 flex flex-col gap-1">
                  <button onClick={() => { setIsMenuOpen(false); setActivePage && setActivePage('earn'); }} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[#089981]/10 border border-transparent hover:border-[#089981]/30 transition-colors text-left group">
                    <span className="text-lg shrink-0">💰</span>
                    <span className="text-sm font-bold text-[#089981]">Earn Yield</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <span className="text-lg shrink-0">🐦</span>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Twitter / X</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <span className="text-lg shrink-0">✈️</span>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Telegram</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-white/5">
              <button 
                onClick={() => { disconnect(); setIsMenuOpen(false); }}
                className="w-full py-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Disconnect
              </button>
            </div>
            
          </div>
        </div>
      )}

      {showFullHistory && (
        <div className="fixed inset-0 z-[350] bg-[#030303] flex flex-col animate-slideInRight">
          
          <div className="flex-none bg-[#030303]/90 backdrop-blur-md px-4 py-4 border-b border-white/[0.05] flex items-center justify-between z-10">
            <button onClick={() => setShowFullHistory(false)} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Transaction History</h2>
            <div className="w-10 shrink-0"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
            {transactions.map((tx) => (
              <div key={tx.id} onClick={() => handleActivityClick(tx.hash)} className="flex justify-between items-center p-4 bg-[#0A0A0A] rounded-2xl border border-white/[0.03] hover:bg-[#0D0D0D] transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/5 group-hover:border-white/20 transition-colors shrink-0`}>
                    {tx.type === 'Swap' && <svg className="w-5 h-5 text-[#00FF66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                    {tx.type === 'Deposit' && <svg className="w-5 h-5 text-[#00FF66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    {tx.type === 'Sent' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                    {tx.type === 'Withdraw' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                    {tx.type === 'Deploy' && <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black tracking-wider text-zinc-200 group-hover:text-white truncate">{tx.type}</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-zinc-500 font-medium truncate sm:max-w-[200px]">{tx.details}</span>
                      <span className="text-[8px] uppercase tracking-widest text-zinc-600 shrink-0">• {tx.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-black tracking-widest ${tx.color}`}>{isMuted ? '••••' : tx.amount}</span>
                  <svg className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {settingsView && (
        <div className="fixed inset-0 z-[400] bg-[#030303] animate-slideInRight">
          <AccountSettingsSystem 
            onClose={() => setSettingsView(null)} 
            view={settingsView} 
            userProfile={userProfile} 
          />
        </div>
      )}

    </>
  );
}