import React, { useState, useEffect, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import AccountDrawer from './AccountDrawer';

export default function Navbar({
  activeRoute = 'tokens',
  setActiveRoute,
  currentView = 'tokens',
  setCurrentView,
  userProfile,
  setForgeModalOpen,
  searchQuery: externalSearch,
  setSearchQuery: externalSetSearch,
  onOpenProfile,
  onOpenSettings
}) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [solBalance, setSolBalance] = useState(null);

  const dropdownRef = useRef(null);

  const activeView = activeRoute || currentView || 'tokens';
  const currentLabel = activeView.toUpperCase();

  // Fetch real SOL balance if wallet is connected
  useEffect(() => {
    let isMounted = true;
    if (connected && publicKey && connection) {
      connection.getBalance(publicKey).then((balance) => {
        if (isMounted) setSolBalance((balance / LAMPORTS_PER_SOL).toFixed(2));
      }).catch(() => {
        if (isMounted) setSolBalance(null);
      });
    } else {
      setSolBalance(null);
    }
    return () => { isMounted = false; };
  }, [connected, publicKey, connection]);

  // Close view switcher dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRouteSelect = (route) => {
    if (typeof setActiveRoute === 'function') setActiveRoute(route);
    if (typeof setCurrentView === 'function') setCurrentView(route);
    setDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInternalSearch(value);
    if (typeof externalSetSearch === 'function') {
      externalSetSearch(value);
    }
  };

const rawName = userProfile?.name || userProfile?.username || 'Elvis';
const cleanName = rawName.replace(/^@/, ''); // Remove any leading '@'
const truncatedName = cleanName.length > 7 
  ? `@${cleanName.slice(0, 7)}...` 
  : `@${cleanName}`;

  const displayAddress = connected && publicKey 
    ? `${publicKey.toBase58().slice(0, 4)}..${publicKey.toBase58().slice(-4)}`
    : (userProfile?.address ? `${userProfile.address.slice(0, 4)}..${userProfile.address.slice(-4)}` : '43pU..q2HR');

  const displayName = userProfile?.name || userProfile?.username || 'Elvis';
  const displayAvatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="relative z-[100] pointer-events-auto w-full h-[52px] bg-[#0A0A0A] border-b border-white/5 px-4 flex items-center justify-between shrink-0 select-none">
        
        {/* LEFT: VIEW SWITCHER DROPDOWN & NAV LINKS */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#089981]/40 bg-[#16171d] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:bg-[#20222b] active:scale-95"
            >
              <span className="text-[#089981]">{currentLabel}</span>
              <svg
                className={`w-3 h-3 text-[#089981] transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-[#16171d] border border-white/10 rounded-xl shadow-2xl py-2 z-[110] backdrop-blur-md">
                {['discover', 'launches', 'tokens', 'portfolio', 'track'].map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRouteSelect(view);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      activeView === view
                        ? 'text-[#089981] bg-white/5'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Nav Links */}
          <div className="hidden md:flex items-center gap-4 text-xs font-bold">
            <button 
              type="button"
              onClick={() => handleRouteSelect('tokens')}
              className={`transition-colors cursor-pointer ${
                activeView === 'tokens' ? 'text-[#089981]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tokens
            </button>
            <button 
              type="button"
              onClick={() => handleRouteSelect('portfolio')}
              className={`transition-colors cursor-pointer ${
                activeView === 'portfolio' ? 'text-[#089981]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Portfolio
            </button>
          </div>
        </div>

        {/* CENTER: SEARCH BAR */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <svg 
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={externalSearch !== undefined ? externalSearch : internalSearch}
              onChange={handleSearchChange}
              placeholder="Search tokens or CAs..." 
              className="w-full bg-[#16171d] border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#089981]/60 transition-all cursor-text pointer-events-auto"
            />
          </div>
        </div>

        {/* RIGHT: ACTION CONTROLS */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Balance Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#16171d] border border-white/5 rounded-lg text-xs font-bold text-zinc-300">
            <span className="text-[#089981]">⚡ {solBalance !== null ? solBalance : '0.1'}</span>
            <span className="text-zinc-500">SOL</span>
          </div>

          {/* + Forge Button */}
          <button 
            type="button"
            onClick={() => setForgeModalOpen && setForgeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#089981] hover:bg-[#067a67] text-white font-black text-xs rounded-lg transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
          >
            <span>+ Forge</span>
          </button>

          {/* Wallet Address Button */}
          <button 
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#16171d] hover:bg-[#20222b] border border-[#089981]/40 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer active:scale-95"
          >
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#089981] animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{displayAddress}</span>
          </button>

          {/* Notifications Button */}
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#16171d] border border-white/5 text-zinc-400 hover:text-white hover:bg-[#20222b] transition-all cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Settings Button */}
<button 
  type="button"
  onClick={onOpenSettings}
  className="p-2 bg-[#16171d] hover:bg-[#20222b] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
  title="Settings"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
</button>
         </div>

      </header>

      {/* Account Drawer Integration */}
      <AccountDrawer 
        isOpen={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        userProfile={userProfile}
        netWorth="$45,702.07"
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />
    </>
  );
}