import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

// --- CORE VIEWS ---
import Home from './components/Home';
import Launch from './components/Launch';
import Wallet from './components/Wallet';
import Watch from './components/Watch';
import TokenHome from './components/TokenHome'; 
import TokenChat from './components/TokenChat';
import Ranks from './components/Ranks'; 
import Profile from './components/Profile'; 
import Refer from './components/Refer';
import EarnHub from './components/EarnHub'; 
import SocialHub from './components/SocialHub'; 
import AccountSettingsSystem from './components/AccountSettingsSystem';

// --- NAVIGATION & DRAWERS ---
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar'; 
import AccountDrawer from './components/AccountDrawer';
import NotificationCenter from './components/NotificationCenter';

// --- GLOBAL MODALS ---
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import SendModal from './components/SendModal';
import SwapModal from './components/SwapModal';
import LiveModal from './components/LiveModal';

export default function App() {
  const { connected, publicKey } = useWallet();

  // --- ROUTING & PERSISTENCE STATE ---
  const [activePage, setActivePage] = useState(() => {
    const saved = localStorage.getItem('apex_active_page');
    return saved ? saved : 'home'; 
  }); 
  const [previousPage, setPreviousPage] = useState(() => {
    const saved = localStorage.getItem('apex_previous_page');
    return saved ? saved : 'home';
  }); 
  
  const [publicProfileView, setPublicProfileView] = useState(null);
  const [isFollowingCurrentView, setIsFollowingCurrentView] = useState(false);
  
  // --- GLOBAL OVERLAY STATES ---
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [modals, setModals] = useState({
    deposit: false,
    withdraw: false,
    send: false,
    swap: false,
    live: false
  });

  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };
  
  // --- MOCK DATA STATES ---
  const defaultTokens = [
    { id: '1', name: 'Apex AI', symbol: 'APEX', mintAddress: 'CA: Forge...Solana', icon: '🔥', mcap: '$10.4M', price: '0.0102', change: '+500%', isGraduated: false, progress: 68 },
    { id: '2', name: 'Based Cat', symbol: 'BCAT', mintAddress: 'CA: Meow...Pump', icon: '🐱', mcap: '$1.2M', price: '0.0012', change: '+142.5%', isGraduated: true, progress: 100 },
    { id: '3', name: 'Solana Yield', symbol: 'SYLD', mintAddress: 'CA: Yield...Vault', icon: '📈', mcap: '$3.4M', price: '0.0034', change: '+24.8%', isGraduated: false, progress: 25 },
  ];

  const dummyNotifications = [
    { id: 1, category: 'FORGE', title: 'Token Deployed', message: 'Apex AI is now live on the bonding curve.', time: '2m ago', read: false },
    { id: 2, category: 'SOCIAL', title: 'New Mention', message: '@turboshark tagged you in based cat chat.', time: '1h ago', read: false },
  ];

  const [globalTokens, setGlobalTokens] = useState(() => {
    const savedTokens = localStorage.getItem('apex_global_tokens');
    return savedTokens ? JSON.parse(savedTokens) : defaultTokens;
  });

  const [userPortfolio, setUserPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem('apex_user_portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [{ symbol: 'SOL', name: 'Solana', balance: 0, valueUSD: 0, icon: 'S' }];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('apex_user_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Elvis',
      username: '@ElvisVision',
      bio: 'Independent Platform Architect & Web3 Developer.',
      avatar: null
    };
  });

  const [globalTransactions, setGlobalTransactions] = useState(() => {
    const savedTxs = localStorage.getItem('apex_global_transactions');
    return savedTxs ? JSON.parse(savedTxs) : [];
  });

  // --- LOCAL STORAGE EFFECTS ---
  useEffect(() => { localStorage.setItem('apex_active_page', activePage); }, [activePage]);
  useEffect(() => { localStorage.setItem('apex_previous_page', previousPage); }, [previousPage]);
  useEffect(() => { localStorage.setItem('apex_global_tokens', JSON.stringify(globalTokens.map(t => ({...t, imagePreview: null})))); }, [globalTokens]);
  useEffect(() => { localStorage.setItem('apex_user_portfolio', JSON.stringify(userPortfolio.map(t => ({...t, imagePreview: null})))); }, [userPortfolio]);
  useEffect(() => { localStorage.setItem('apex_user_profile', JSON.stringify({...userProfile, avatar: null})); }, [userProfile]);
  useEffect(() => { localStorage.setItem('apex_global_transactions', JSON.stringify(globalTransactions)); }, [globalTransactions]);

  // --- LIVE SOLANA BALANCE FETCHING ---
  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      const fetchLiveBalance = async () => {
        try {
          const lamports = await connection.getBalance(publicKey);
          const solBalance = lamports / LAMPORTS_PER_SOL;
          const currentSolPriceUSD = 145; 

          setUserPortfolio(prev => {
            const nonSolAssets = prev.filter(t => t.symbol !== 'SOL');
            return [
              { symbol: 'SOL', name: 'Solana', balance: solBalance, valueUSD: solBalance * currentSolPriceUSD, icon: 'S' },
              ...nonSolAssets
            ];
          });
        } catch (error) {}
      };

      fetchLiveBalance();
      const interval = setInterval(fetchLiveBalance, 10000);
      return () => clearInterval(interval);

    } else {
      setUserPortfolio(prev => {
        const nonSolAssets = prev.filter(t => t.symbol !== 'SOL');
        return [{ symbol: 'SOL', name: 'Solana', balance: 0, valueUSD: 0, icon: 'S' }, ...nonSolAssets];
      });
    }
  }, [connected, publicKey]);
  
  // --- TRADE PORTAL STATE ---
  const [selectedTokenData, setSelectedTokenData] = useState(null); 
  const [isTradePortalOpen, setIsTradePortalOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  
  const userSolBalance = userPortfolio.find(t => t.symbol === 'SOL')?.balance || 0;

  // --- HANDLERS ---
  const handleTokenClick = (token) => {
    setPreviousPage(activePage); 
    setSelectedTokenData(token);
    setActivePage('tokenHome'); 
  };

  const handleOpenTradePortal = (token) => {
    setSelectedTokenData(token);
    setIsTradePortalOpen(true);
  };

  const handleOpenPublicProfile = (userData) => {
    setPublicProfileView({
      name: userData?.name || userData?.sender || 'Crypto Whale',
      username: userData?.handle || `@${(userData?.name || userData?.sender || 'user').replace(/\s+/g, '')}`,
      avatar: userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || userData?.sender}`,
      bio: 'Web3 native. Navigating the trenches of Apex Forge.',
      address: userData?.address || '8xV9pRqwHGZ1T8ZwbZ6L7V2wXyCqY9n2M4PqZzXvYyW',
      followers: Math.floor(Math.random() * 5000) + 100,
      following: Math.floor(Math.random() * 500) + 10,
      forged: Math.floor(Math.random() * 20),
    });
    setIsFollowingCurrentView(false); 
    setPreviousPage(activePage);
    setActivePage('profile');
  };

  const handleSidebarNavigation = (page) => {
    setIsMobileSidebarOpen(false);
    if (page === 'profile') setPublicProfileView(null); 
    setActivePage(page);
  };

  const handleExecuteTrade = () => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ Please enter a valid amount to trade.");
      return;
    }

    const exchangeRate = 1850420; 
    const currentSolPriceUSD = 145;

    if (tradeMode === 'buy') {
      const tokensToReceive = amount * exchangeRate;
      const usdValueSpent = amount * currentSolPriceUSD;

      setUserPortfolio(prev => {
        let updated = [...prev];
        const tokenIndex = updated.findIndex(t => t.symbol === selectedTokenData.symbol);
        
        if (tokenIndex !== -1) {
          updated[tokenIndex] = {
            ...updated[tokenIndex],
            balance: updated[tokenIndex].balance + tokensToReceive,
            valueUSD: updated[tokenIndex].valueUSD + usdValueSpent
          };
        } else {
          updated.push({
            symbol: selectedTokenData.symbol,
            name: selectedTokenData.name || selectedTokenData.tokenName || 'Unknown Token',
            balance: tokensToReceive,
            valueUSD: usdValueSpent,
            icon: selectedTokenData.icon || '🪙',
            imagePreview: selectedTokenData.imagePreview
          });
        }
        return updated;
      });
      
      setGlobalTransactions(prev => [{
        id: Date.now().toString(),
        type: 'Swap',
        details: `Swapped SOL for ${selectedTokenData.symbol}`,
        time: 'Just now',
        amount: `+ ${formatWithCommas(tokensToReceive.toFixed(0))}${selectedTokenData.symbol}`,
        color: 'text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]',
        hash: Math.random().toString(36).substring(2, 10)
      }, ...prev]);

      alert(`✅ Trade Executed! You successfully bought ${formatWithCommas(tokensToReceive.toFixed(0))}${selectedTokenData.symbol}.`);

    } else {
      const tokenInWallet = userPortfolio.find(t => t.symbol === selectedTokenData.symbol);
      if (!tokenInWallet || amount > tokenInWallet.balance) {
        alert(`⚠️ Insufficient ${selectedTokenData.symbol} balance to execute sell.`);
        return;
      }
      
      const usdValueReceived = (amount / exchangeRate) * currentSolPriceUSD;

      setUserPortfolio(prev => {
        let updated = [...prev];
        const tokenIndex = updated.findIndex(t => t.symbol === selectedTokenData.symbol);
        
        if (tokenIndex !== -1) {
          const newBalance = updated[tokenIndex].balance - amount;
          if (newBalance <= 0) {
              updated.splice(tokenIndex, 1); 
          } else {
             updated[tokenIndex] = {
               ...updated[tokenIndex],
               balance: newBalance,
               valueUSD: updated[tokenIndex].valueUSD - usdValueReceived
             };
          }
        }
        return updated;
      });

      setGlobalTransactions(prev => [{
        id: Date.now().toString(),
        type: 'Swap',
        details: `Swapped ${selectedTokenData.symbol} for SOL`,
        time: 'Just now',
        amount: `+ $${usdValueReceived.toFixed(2)}`,
        color: 'text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]',
        hash: Math.random().toString(36).substring(2, 10)
      }, ...prev]);

      alert(`✅ Trade Executed! You sold ${formatWithCommas(amount)}${selectedTokenData.symbol}.`);
    }

    setIsTradePortalOpen(false);
    setTradeAmount('');
  };

  const handleForgeSuccess = (newToken) => {
    const forgedToken = {
        ...newToken,
        isGraduated: false,
        isMine: true,
        progress: newToken.initialSnipe ? ((parseFloat(newToken.initialSnipe)/85)*100) : 0
    };

    setGlobalTokens(prev => [forgedToken, ...prev]);

    setGlobalTransactions(prev => [{
      id: Date.now().toString(),
      type: 'Deploy',
      details: `Forged Token: ${forgedToken.symbol}`,
      time: 'Just now',
      amount: `- 0.05 SOL`,
      color: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]',
      hash: Math.random().toString(36).substring(2, 10)
    }, ...prev]);

    if (forgedToken.initialSnipe > 0) {
      setUserPortfolio(prev => [
        ...prev,
        { 
          symbol: forgedToken.symbol, 
          name: forgedToken.name, 
          balance: forgedToken.initialSnipe * 1850420, 
          valueUSD: forgedToken.initialSnipe * 145, 
          icon: forgedToken.icon,
          imagePreview: forgedToken.imagePreview 
        }
      ]);
    }
  };

  const formatWithCommas = (val) => {
    if (!val) return '';
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const calculateTokenYield = (solAmt) => {
    const amount = parseFloat(solAmt);
    if (isNaN(amount) || amount <= 0) return '0';
    return formatWithCommas((amount * 1850420).toFixed(0));
  };

  const trendingTokens = globalTokens.filter(t => !t.isGraduated && t.progress < 100);
  const graduatedTokens = globalTokens.filter(t => t.isGraduated || t.progress >= 100);

  // --- MAIN ROUTER ---
  const renderContent = () => {
    const openAccountDrawer = () => setIsAccountDrawerOpen(true);

    switch (activePage.toLowerCase()) {
      case 'home': 
        return <Home 
                 tokens={globalTokens} 
                 trendingTokens={trendingTokens} 
                 graduatedTokens={graduatedTokens}
                 onTokenClick={handleTokenClick} 
                 setActivePage={(page) => { setPreviousPage('home'); setActivePage(page); }} 
                 userProfile={userProfile} 
                 onOpenSidebar={() => setIsMobileSidebarOpen(true)} 
                 onOpenAccountDrawer={openAccountDrawer} 
                 onOpenNotifications={() => setIsNotificationsOpen(true)}
               />;
      case 'watch': 
        return <Watch onTokenClick={handleTokenClick} setActivePage={(page) => { setPreviousPage('watch'); setActivePage(page); }} userProfile={userProfile} onOpenAccountDrawer={openAccountDrawer} onOpenNotifications={() => setIsNotificationsOpen(true)} />;
      case 'forge':
      case 'launch': 
        return <Launch onForgeSuccess={handleForgeSuccess} userProfile={userProfile} setActivePage={(page) => { setPreviousPage('forge'); setActivePage(page); }} />;
      case 'ranks': 
        return <Ranks onOpenProfile={handleOpenPublicProfile} userProfile={userProfile} setActivePage={(page) => { setPreviousPage('ranks'); setActivePage(page); }} />;
      case 'refer': 
        return <Refer onBack={() => setActivePage(previousPage === 'refer' ? 'wallet' : previousPage)} />;
      case 'earn': 
        return <EarnHub setActivePage={setActivePage} userPortfolio={userPortfolio} previousPage={previousPage} />;
      case 'social':
        return <SocialHub setActivePage={setActivePage} onOpenProfile={handleOpenPublicProfile} />;
      case 'wallet': 
        return (
          <Wallet 
            portfolio={userPortfolio}
            transactions={globalTransactions} 
            createdTokens={globalTokens.filter(t => t.isMine)} 
            onAddTransaction={(tx) => setGlobalTransactions(prev => [tx, ...prev])} 
            setActivePage={(page) => { setPreviousPage('wallet'); setActivePage(page); }} 
            onTokenClick={handleTokenClick} 
            onOpenProfile={() => { setPublicProfileView(null); setActivePage('profile'); }} 
            onOpenSettings={() => { setPreviousPage('wallet'); setActivePage('settings'); }}
            userProfile={userProfile}
            onOpenAccountDrawer={openAccountDrawer}
            onOpenDeposit={() => toggleModal('deposit', true)}
            onOpenWithdraw={() => toggleModal('withdraw', true)}
            onOpenSend={() => toggleModal('send', true)}
            onOpenSwap={() => toggleModal('swap', true)}
          />
        );
      case 'profile': 
        return (
          <Profile 
            isOwnProfile={!publicProfileView} 
            userProfile={publicProfileView || userProfile} 
            isFollowingUser={isFollowingCurrentView}
            onFollowToggle={() => setIsFollowingCurrentView(!isFollowingCurrentView)}
            onBack={() => { setPublicProfileView(null); setActivePage(previousPage === 'profile' ? 'home' : previousPage); }} 
            onOpenSettings={() => { setPreviousPage('profile'); setActivePage('settings'); }} 
          />
        );
      case 'settings': 
        return (
          <AccountSettingsSystem 
            initialView="main" 
            onBack={() => setActivePage(previousPage || 'home')} 
            onCloseSettings={() => setActivePage(previousPage || 'home')} 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
          />
        );
      case 'tokenhome': 
        return (
          <TokenHome 
            token={selectedTokenData} 
            onBack={() => setActivePage(previousPage || 'home')} 
            onTradeClick={handleOpenTradePortal}
            onOpenProfile={() => handleOpenPublicProfile({ name: 'Apex Deployer', handle: '@ApexDeployer_0x1', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=ApexDeployer_0x1` })}
            onOpenChat={() => setActivePage('tokenChat')}
            onOpenLiveModal={() => toggleModal('live', true)}
          />
        );
      case 'tokenchat':
        return (
          <TokenChat 
            token={selectedTokenData}
            onBack={() => setActivePage('tokenHome')}
            userProfile={userProfile}
            userBalance={userPortfolio.find(t => t.symbol === selectedTokenData?.symbol)?.balance || 0}
            onOpenProfile={handleOpenPublicProfile} 
            onOpenTrade={handleOpenTradePortal} 
          />
        )
      default: 
        return <Home 
                 tokens={globalTokens} 
                 trendingTokens={trendingTokens} 
                 graduatedTokens={graduatedTokens}
                 onTokenClick={handleTokenClick} 
                 setActivePage={(page) => { setPreviousPage('home'); setActivePage(page); }} 
                 userProfile={userProfile} 
                 onOpenSidebar={() => setIsMobileSidebarOpen(true)} 
                 onOpenAccountDrawer={openAccountDrawer} 
                 onOpenNotifications={() => setIsNotificationsOpen(true)}
               />;
    }
  };

  return (
    <div className="bg-[#050505] h-[100dvh] text-white flex overflow-hidden w-screen select-none relative">
      
      <style>{`
        /* 🚀 GLOBAL NATIVE APP LOCKDOWN 🚀 */
        html, body {
          height: 100%;
          width: 100%;
          overflow: hidden; 
          position: fixed; 
          overscroll-behavior-y: none; 
        }
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        input, textarea {
          -webkit-user-select: auto !important;
          user-select: auto !important;
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slideRight { animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>

      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:block w-[260px] shrink-0 bg-[#0A0A0A] border-r border-white/5 z-40 relative">
        <Sidebar currentView={activePage} setCurrentView={handleSidebarNavigation} userProfile={userProfile} />
      </div>

      {/* --- MOBILE NAVIGATION SIDEBAR OVERLAY --- */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[200] md:hidden flex" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"></div>
          <div 
            className="w-[260px] h-full bg-[#0A0A0A] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.7)] relative z-10 animate-slideRight flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex-1 overflow-y-auto">
              <Sidebar currentView={activePage} setCurrentView={handleSidebarNavigation} userProfile={userProfile} />
            </div>
          </div>
        </div>
      )}

      {/* --- IMPORTED LEFT-ALIGNED ACCOUNT DRAWER --- */}
      <AccountDrawer 
        isOpen={isAccountDrawerOpen} 
        onClose={() => setIsAccountDrawerOpen(false)} 
        userProfile={userProfile} 
        netWorth="$16,530.00" 
        onOpenProfile={() => {
          setPublicProfileView(null);
          setPreviousPage(activePage);
          setActivePage('profile');
        }}
        onOpenSettings={() => {
          setPreviousPage(activePage);
          setActivePage('settings');
        }}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 relative h-full overflow-y-auto overflow-x-hidden pb-20 md:pb-0 bg-[#050505]">
        {renderContent()}

        {/* --- TRADE PORTAL OVERLAY --- */}
        {isTradePortalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="absolute inset-0 z-0" onClick={() => setIsTradePortalOpen(false)}></div>
            <div className="bg-[#121212] border-t border-white/10 sm:border rounded-t-3xl sm:rounded-3xl w-full max-w-[400px] p-6 relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-slideUpNative">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 sm:hidden"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center min-w-0">
                   <div className="w-12 h-12 bg-[#0A0A0A] border border-white/5 rounded-full flex items-center justify-center text-xl shadow-inner shrink-0 overflow-hidden">
                      {selectedTokenData?.imagePreview ? (
                        <img src={selectedTokenData.imagePreview} alt="token" className="w-full h-full object-cover" />
                      ) : (
                        selectedTokenData?.icon || '🪙'
                      )}
                   </div>
                   <div className="min-w-0 flex flex-col">
                     <h2 className="text-base font-black text-white tracking-wide truncate">
                       {selectedTokenData?.tokenName || selectedTokenData?.name || selectedTokenData?.token || 'Unknown Token'}
                     </h2>
                     <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[11px] text-[#089981] font-black tracking-wider uppercase">
                         {selectedTokenData?.symbol || 'TOKEN'}
                       </span>
                       <span className="text-[9px] font-mono text-zinc-500 bg-white/[0.03] border border-white/5 px-1.5 py-0.5 rounded tracking-tight truncate max-w-[140px]">
                         {selectedTokenData?.mintAddress || 'CA: Forge...Solana'}
                       </span>
                     </div>
                   </div>
                </div>
                <button onClick={() => setIsTradePortalOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors hidden sm:block">✕</button>
              </div>

              <div className="flex p-1 bg-[#050505] rounded-xl mb-4 border border-white/5 shadow-inner">
                <button onClick={() => setTradeMode('buy')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'buy' ? 'bg-[#089981] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Buy</button>
                <button onClick={() => setTradeMode('sell')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>Sell</button>
              </div>

              <div className="bg-[#050505] border border-white/5 rounded-xl p-4 flex items-center justify-between mb-2 focus-within:border-[#089981]/50 transition-colors shadow-inner">
                <div className="flex flex-col flex-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Amount to {tradeMode}</span>
                  <input 
                    type="text" inputMode="decimal" placeholder="0.0" 
                    value={formatWithCommas(tradeAmount)}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9.]/g, '');
                      if ((val.match(/\./g) || []).length > 1) val = val.substring(0, val.lastIndexOf('.'));
                      setTradeAmount(val);
                    }}
                    className="bg-transparent text-3xl font-black text-white w-full outline-none placeholder-zinc-700 font-mono tracking-tight"
                  />
                </div>
                <div className="flex flex-col items-end justify-center">
                  <div className="flex items-center gap-1.5 bg-[#121212] border border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-xs font-black text-white font-mono">SOL</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-1 mb-4 min-h-[18px]">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {tradeMode === 'buy' ? 'Estimated Receive' : 'Estimated Cost'}
                </span>
                <span className="text-xs font-mono font-black text-zinc-300">
                  {tradeAmount ? `${calculateTokenYield(tradeAmount)}${selectedTokenData?.symbol || 'TOKENS'}` : `0 ${selectedTokenData?.symbol || 'TOKENS'}`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {['0.1', '0.5', '1', 'Max'].map(amt => (
                  <button key={amt} onClick={() => setTradeAmount(amt === 'Max' ? '1' : amt)} className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-black text-zinc-300 py-2.5 rounded-lg transition-colors active:scale-95 shadow-sm">{amt}</button>
                ))}
              </div>

              <div className="flex justify-between items-center px-1 mb-4">
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Wallet Balance</span>
                 <span className={`text-xs font-mono font-black ${userSolBalance <= 0 ? 'text-[#F23645]' : 'text-white'}`}>
                   {userSolBalance.toFixed(4)} SOL
                 </span>
              </div>

              <button 
                onClick={handleExecuteTrade}
                className={`w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  tradeMode === 'buy' 
                    ? 'bg-[#089981] hover:opacity-90 text-white shadow-[0_0_20px_rgba(8,153,129,0.3)]' 
                    : 'bg-[#F23645] hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(242,54,69,0.2)]'
                }`}
              >
                {tradeMode === 'buy' ? 'Place Buy Order' : 'Execute Sell'}
              </button>
            </div>
          </div>
        )}

        {/* --- BOTTOM NAVIGATION (HIDDEN ON DESKTOP & SUBPAGES) --- */}
        {activePage !== 'tokenHome' && activePage !== 'tokenChat' && activePage !== 'settings' && activePage !== 'profile' && (
          <div className="md:hidden z-50">
            <BottomNav activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} />
          </div>
        )}
        
      </div>

      {/* ========================================================= */}
      {/* 🚀 GLOBAL APP MODALS & DRAWERS (MOUNTED AT ROOT) 🚀 */}
      {/* ========================================================= */}
      
      {/* 1. Global Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        notifications={dummyNotifications} 
      />

      {/* 2. Wallet Transaction Modals */}
      {modals.deposit && <DepositModal isOpen={modals.deposit} onClose={() => toggleModal('deposit', false)} />}
      {modals.withdraw && <WithdrawModal isOpen={modals.withdraw} onClose={() => toggleModal('withdraw', false)} />}
      {modals.send && <SendModal isOpen={modals.send} onClose={() => toggleModal('send', false)} />}
      {modals.swap && <SwapModal isOpen={modals.swap} onClose={() => toggleModal('swap', false)} />}

      {/* 3. Real-Time Broadcast & Event Overlay */}
      {modals.live && <LiveModal isOpen={modals.live} onClose={() => toggleModal('live', false)} token={selectedTokenData} />}

    </div>
  );
}