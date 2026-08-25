import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';


// --- SOLANA PROVIDER INTEGRATION ---
import SolanaProvider from './components/SolanaProvider'; // 🚀 Added Solana Web3 Context Wrapper

// --- GLOBAL STREAM CONTEXT & FLOATING PLAYER ---
import { StreamProvider, useStream } from './components/StreamProvider';
import ActiveTvStream from './components/ActiveTvStream';

// --- CORE VIEWS ---
import Home from './components/Home';
import LaunchesView from './components/LaunchesView';
import TrackView from './components/TrackView';
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

function AppContent() {
  const { connected, publicKey } = useWallet();
  const { activeStreamUrl, stopStream } = useStream();

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
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // 🔍 NEW: Global search query state for header search integration
  const [searchQuery, setSearchQuery] = useState('');
  // 🏷️ NEW: Top-bar tab selection state matching Phantom's navigation model
  const [topNavTab, setTopNavTab] = useState('Discover');
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  
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

  const [selectedTokenData, setSelectedTokenData] = useState(() => {
    const savedToken = localStorage.getItem('apex_selected_token_data');
    return savedToken ? JSON.parse(savedToken) : null;
  });

  useEffect(() => { localStorage.setItem('apex_active_page', activePage); }, [activePage]);
  useEffect(() => { localStorage.setItem('apex_previous_page', previousPage); }, [previousPage]);
  useEffect(() => { localStorage.setItem('apex_global_tokens', JSON.stringify(globalTokens.map(t => ({...t, imagePreview: null})))); }, [globalTokens]);
  useEffect(() => { localStorage.setItem('apex_user_portfolio', JSON.stringify(userPortfolio.map(t => ({...t, imagePreview: null})))); }, [userPortfolio]);
  useEffect(() => { localStorage.setItem('apex_user_profile', JSON.stringify({...userProfile, avatar: null})); }, [userProfile]);
  useEffect(() => { localStorage.setItem('apex_global_transactions', JSON.stringify(globalTransactions)); }, [globalTransactions]);
  
  useEffect(() => { 
    if (selectedTokenData) {
      localStorage.setItem('apex_selected_token_data', JSON.stringify(selectedTokenData)); 
    } else {
      localStorage.removeItem('apex_selected_token_data');
    }
  }, [selectedTokenData]);

  // 🚀 REAL DEVNET BALANCE FETCHING (Replaces fake state with actual Solana network queries)
  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      const fetchLiveBalance = async () => {
        try {
          const lamports = await connection.getBalance(publicKey);
          const solBalance = lamports / LAMPORTS_PER_SOL;
          const currentSolPriceUSD = 145; // Testnet estimated benchmark rate

          setUserPortfolio(prev => {
            const nonSolAssets = prev.filter(t => t.symbol !== 'SOL');
            return [
              { symbol: 'SOL', name: 'Solana', balance: solBalance, valueUSD: solBalance * currentSolPriceUSD, icon: 'S' },
              ...nonSolAssets
            ];
          });
        } catch (error) {
          console.error("Failed to fetch live Devnet SOL balance:", error);
        }
      };

      fetchLiveBalance();
      const interval = setInterval(fetchLiveBalance, 20000);
      return () => clearInterval(interval);

    } else {
      setUserPortfolio(prev => {
        const nonSolAssets = prev.filter(t => t.symbol !== 'SOL');
        return [{ symbol: 'SOL', name: 'Solana', balance: 0, valueUSD: 0, icon: 'S' }, ...nonSolAssets];
      });
    }
  }, [connected, publicKey]);
  
  const [isTradePortalOpen, setIsTradePortalOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  
  const userSolBalance = userPortfolio.find(t => t.symbol === 'SOL')?.balance || 0;

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

  const handleExecuteTrade = async () => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ Please enter a valid amount to trade.");
      return;
    }

    // 🚀 Send the transaction straight to your deployed Solana hook and Phantom wallet!
    const success = await executeTradeOnChain(tradeMode, amount, selectedTokenData?.mintAddress, null, null, selectedTokenData?.isGraduated);
    
    if (success) {
      setIsTradePortalOpen(false);
      setTradeAmount('');
    }
  };

 const handleForgeSuccess = (newToken) => {
    const forgedToken = {
      ...newToken,
      isGraduated: false,
      isMine: true,
      progress: newToken.initialSnipe ? ((parseFloat(newToken.initialSnipe)/85)*100) : 0,
      created_at: newToken?.created_at || newToken?.createdAt || new Date().toISOString()
    };

    setGlobalTokens(prev => [forgedToken, ...prev]);

    setGlobalTransactions(prev => [{
      id: Date.now().toString(),
      type: 'Deploy',
      details: `Forged Token: ${forgedToken.symbol}`,
      time: 'Just now',
      amount: `- 0.002 SOL`,
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

  const renderContent = () => {
    const openAccountDrawer = () => setIsAccountDrawerOpen(true);

    switch (activePage.toLowerCase()) {
      case 'home': 
        return <Home 
                 tokens={globalTokens} 
                 trendingTokens={trendingTokens} 
                 migratingTokens={[]} // 👈 CHANGE THIS LINE
                 graduatedTokens={graduatedTokens}
                 onTokenClick={handleTokenClick} 
                 setActivePage={(page) => { setPreviousPage('home'); setActivePage(page); }} 
                 userProfile={userProfile} 
                 onOpenSidebar={() => setIsMobileSidebarOpen(true)} 
                 onOpenAccountDrawer={openAccountDrawer} 
                 onOpenNotifications={() => setIsNotificationsOpen(true)}
                 searchQuery={searchQuery}
               />;

      case 'launches': 
        return (
          <div className="h-full p-4 sm:p-6 overflow-hidden">
            <LaunchesView 
              newTokens={trendingTokens} 
              migratingTokens={[]} // 👈 CHANGE THIS LINE TOO
              migratedTokens={graduatedTokens} 
            />
          </div>
        );

      case 'track': 
        return (
          <div className="h-full p-4 sm:p-6 overflow-hidden">
            <TrackView searchQuery={searchQuery} />
          </div>
        );

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
        if (!selectedTokenData) {
          setTimeout(() => setActivePage('home'), 0);
          return null;
        }
        return (
          <TokenHome 
            token={selectedTokenData} 
            onBack={() => {
              // 🚀 FIX: Bulletproof routing to break the infinite back-loop
              const loopPages = ['tokenhome', 'tokenchat', 'tokenHome', 'tokenChat'];
              const targetPage = loopPages.includes(previousPage) ? 'home' : (previousPage || 'home');
              setActivePage(targetPage);
            }} 
            onTradeClick={handleOpenTradePortal}
            onOpenProfile={() => handleOpenPublicProfile({ name: 'Apex Deployer', handle: '@ApexDeployer_0x1', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=ApexDeployer_0x1` })}
            onOpenChat={() => {
              // Do not update previousPage here, so we preserve the original root origin (Home/Wallet)
              setActivePage('tokenchat');
            }}
            onOpenLiveModal={() => toggleModal('live', true)}
          />
        );
      case 'tokenchat':
        if (!selectedTokenData) {
          setTimeout(() => setActivePage('home'), 0);
          return null;
        }
        return (
          <TokenChat
          token={selectedTokenData}
          onBack={() => {
            setActivePage('tokenhome'); // Go straight back to the token hub
          }}
          userProfile={userProfile}
          // 🚀 FIX: Correctly separate the SOL balance and the Token balance!
          userBalance={userPortfolio.find(t => t.symbol === 'SOL')?.balance || 0}
          userTokenBalance={
            userPortfolio.find(t => t.symbol === selectedTokenData?.symbol)?.balance || 
            selectedTokenData?.balance || 
            0
          }

            liveUsdPrice={selectedTokenData?.price || selectedTokenData?.usd_price || 0}
            priceChangePct={selectedTokenData?.priceChange24h || selectedTokenData?.price_change_24h || 0}
            isPositiveChange={(selectedTokenData?.priceChange24h || selectedTokenData?.price_change_24h || 0) >= 0}
      
          onOpenProfile={handleOpenPublicProfile}
          onOpenTrade={handleOpenTradePortal}
        />
        );
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
                 searchQuery={searchQuery}
               />;
    }
  };

 return (
<div className="fixed inset-0 bg-[#050505] text-white flex overflow-hidden select-none">
  
  <style>{`
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

      {/* --- FLOATING TV STREAM WIDGET --- */}
      <ActiveTvStream 
        currentTokenSymbol={
          (typeof selectedToken !== 'undefined' && selectedToken?.symbol) || 
          (typeof activeToken !== 'undefined' && activeToken?.symbol) || 
          ""
        } 
        activePage={activePage}
        closeStream={stopStream} 
      />

      return (
    <div className="fixed inset-0 bg-[#050505] text-white flex w-full h-full overflow-hidden select-none">
      
     {/* --- DESKTOP SIDEBAR --- */}
<div className="hidden md:block w-16 h-full bg-[#0A0A0A] border-r border-white/5 shrink-0 z-40">
  <Sidebar currentView={activePage} setCurrentView={handleSidebarNavigation} userProfile={userProfile} />
</div>

      {/* --- MOBILE NAVIGATION SIDEBAR OVERLAY --- */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[200] md:hidden flex" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn" />
          <div 
            className="w-[260px] h-full bg-[#0A0A0A] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.8)] relative z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto">
              <Sidebar currentView={activePage} setCurrentView={(view) => { handleSidebarNavigation(view); setIsMobileSidebarOpen(false); }} userProfile={userProfile} />
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        
       {/* --- TOP HEADER BAR --- */}
<header className="flex items-center justify-between px-4 py-1 bg-[#0c0d10] shrink-0 select-none h-[44px] border-b border-zinc-800/60">
  
  {/* Left Nav: Discover Dropdown & Sub-tabs */}
  <div className="flex items-center space-x-6">
    <div className="relative">
      <button
        onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
        className="flex items-center space-x-1.5 text-sm font-bold text-white hover:text-[#08a68c] transition-colors"
      >
        <span>{topNavTab}</span>
        <span className={`text-[10px] text-zinc-400 transition-transform duration-200 ${isHeaderDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isHeaderDropdownOpen && (
        <div className="absolute left-0 top-full mt-2 w-44 bg-[#121318] border border-zinc-800 rounded-xl shadow-2xl py-1 z-50">
          {[
           { label: 'Discover', action: () => { setTopNavTab('Discover'); setActivePage('home'); } },
           { label: 'Launches', action: () => { setTopNavTab('Launches'); setActivePage('launches'); } },
           { label: 'Track', action: () => { setTopNavTab('Track'); setActivePage('track'); } }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setIsHeaderDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-[#08a68c] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>

    <nav className="hidden md:flex items-center space-x-5 text-xs text-zinc-400 font-medium">
      <button
        onClick={() => {
          setTopNavTab('Tokens');
          if (!selectedTokenData && globalTokens.length > 0) {
            setSelectedTokenData(globalTokens[0]);
          }
          setActivePage('tokenhome');
        }}
        className={`hover:text-white transition-colors ${topNavTab === 'Tokens' ? 'text-white font-bold' : ''}`}
      >
        Tokens
      </button>
      <button 
        onClick={() => { setTopNavTab('Perps'); setActivePage('perps'); }} 
        className={`hover:text-white transition-colors ${topNavTab === 'Perps' ? 'text-white font-bold' : ''}`}
      >
        Perps
      </button>
      <button 
        onClick={() => { setTopNavTab('Portfolio'); setActivePage('wallet'); }} 
        className={`hover:text-white transition-colors ${topNavTab === 'Portfolio' ? 'text-white font-bold' : ''}`}
      >
        Portfolio
      </button>
    </nav>
  </div>

  {/* Center/Right: Search Bar, Quick Buy & Wallet Controls */}
  <div className="flex items-center space-x-2.5">
    
    {/* Search Input */}
    <div className="relative w-56 lg:w-72">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-zinc-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tokens or CAs..."
        className="w-full bg-[#16171d] border border-white/5 focus:border-[#08a68c]/50 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 transition-all outline-none"
      />
    </div>

    {/* Quick-Buy Preset Toggle */}
    <div className="hidden lg:flex items-center bg-[#16171d] border border-white/5 rounded-lg px-2 py-1 space-x-1 text-xs font-mono">
      <span className="text-[#08a68c] text-xs">⚡</span>
      <span className="text-white font-bold text-xs">0.1</span>
      <span className="text-zinc-500 text-[10px]">SOL</span>
    </div>

    {/* Quick Slippage Mode */}
    <div className="hidden xl:flex items-center bg-[#16171d] border border-white/5 rounded-lg p-0.5 space-x-0.5">
      {['1', '2', '3'].map((val) => (
        <button
          key={val}
          className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-md transition-all ${
            val === '1' ? 'bg-[#252733] text-[#08a68c]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {val}
        </button>
      ))}
    </div>

    {/* Add Funds Button (Apex TradingView Green) */}
    <button
      onClick={() => toggleModal('deposit', true)}
      className="hidden sm:flex items-center bg-[#08a68c] hover:bg-[#07957e] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
    >
      + Add Funds
    </button>

    {/* Wallet Balance Pill */}
    <button 
      onClick={() => toggleModal('wallet', true)}
      className="bg-[#16171d] hover:bg-[#20222b] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center space-x-1.5 transition-all cursor-pointer"
    >
      <span>0 SOL</span>
      <span className="text-[#08a68c] text-xs">👤</span>
    </button>

  </div>
</header>

       {/* --- DYNAMIC CONTENT AREA --- */}
<div className="flex-1 w-full h-full overflow-hidden flex flex-col p-0 m-0 bg-[#0c0d10]">
  {renderContent()}
</div>

        {/* --- LOCKED BOTTOM NAVIGATION --- */}
        {activePage?.toLowerCase() !== 'tokenhome' && activePage?.toLowerCase() !== 'tokenchat' && activePage?.toLowerCase() !== 'settings' && activePage?.toLowerCase() !== 'profile' && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-50 bg-[#050505]">
            <BottomNav activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} />
          </div>
        )}

      </div>

      {/* --- DRAWERS & MODALS --- */}
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
<NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        notifications={dummyNotifications} 
      />
      {modals.deposit && <DepositModal isOpen={modals.deposit} onClose={() => toggleModal('deposit', false)} />}
      {modals.withdraw && <WithdrawModal isOpen={modals.withdraw} onClose={() => toggleModal('withdraw', false)} />}
      {modals.send && <SendModal isOpen={modals.send} onClose={() => toggleModal('send', false)} />}
      {modals.swap && <SwapModal isOpen={modals.swap} onClose={() => toggleModal('swap', false)} />}
      {modals.live && <LiveModal isOpen={modals.live} onClose={() => toggleModal('live', false)} token={selectedTokenData} />}

    </div>
    </div>
  );
}

export default function App() {
  return (
    <SolanaProvider>
      <StreamProvider>
        <AppContent />
      </StreamProvider>
    </SolanaProvider>
  );
}