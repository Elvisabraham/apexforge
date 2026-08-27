import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import logo from '../assets/logo.png';

export default function Navbar({ 
  activeRoute = 'discover', 
  setActiveRoute, 
  onOpenForgeModal,
  onOpenNotifications,
  onOpenAccountDrawer,
  userProfile 
}) {
  const { connected } = useWallet();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);

  // Capitalize active route for display label
  const currentLabel = activeRoute ? activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1).toLowerCase() : 'Discover';

  // Quick-Buy & Slippage state
  const [quickBuyAmount, setQuickBuyAmount] = useState('0.1');
  const [selectedSlippage, setSelectedSlippage] = useState('1');

  const handleViewSelect = (viewName) => {
    if (setActiveRoute) {
      setActiveRoute(viewName.toLowerCase());
    }
    setViewDropdownOpen(false);
  };

  const isMainView = ['launches', 'discover', 'track'].includes(activeRoute.toLowerCase());

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121216] border-b border-white/5 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
      
      {/* LEFT: BRAND LOGO & VIEW SWITCHER DROPDOWN */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleViewSelect('discover')}>
          <img src={logo} alt="Apex Forge" className="w-7 h-7 rounded-lg object-cover transition-transform group-hover:scale-105" />
          <span className="font-black text-white text-base tracking-wider hidden sm:inline">APEXFORGE</span>
        </div>

        {/* View Switcher Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewDropdownOpen || isMainView
                ? 'bg-[#252530] border-[#ab9ff2]/30 text-white shadow-md'
                : 'bg-[#1c1c24] hover:bg-[#252530] border-white/5 text-zinc-300'
            }`}
          >
            <span className={isMainView ? 'text-[#ab9ff2]' : 'text-zinc-300'}>{currentLabel}</span>
            <svg 
              className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${viewDropdownOpen ? 'rotate-180 text-white' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {viewDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setViewDropdownOpen(false)} />

              <div className="absolute top-full left-0 mt-1.5 w-36 bg-[#1c1c24] border border-white/10 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5">
                {['Discover', 'Launches', 'Track'].map((view) => {
                  const isActive = activeRoute.toLowerCase() === view.toLowerCase();
                  return (
                    <button
                      key={view}
                      onClick={() => handleViewSelect(view)}
                      className={`px-3 py-2 text-left text-xs font-bold rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-[#252530] text-[#ab9ff2]' 
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{view}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#ab9ff2]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <nav className="hidden md:flex items-center gap-4 font-sans text-xs font-bold">
          <button
            onClick={() => handleViewSelect('tokens')}
            className={`transition-colors cursor-pointer ${
              activeRoute.toLowerCase() === 'tokens' || activeRoute.toLowerCase() === 'discover'
                ? 'text-white font-black' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tokens
          </button>

          <button
            onClick={() => handleViewSelect('portfolio')}
            className={`transition-colors cursor-pointer ${
              activeRoute.toLowerCase() === 'portfolio' 
                ? 'text-white font-black' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Portfolio
          </button>
        </nav>
      </div>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-xs xl:max-w-sm hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tokens or CAs..."
            className="w-full bg-[#1c1c24] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ab9ff2]/50 font-medium transition-all"
          />
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden lg:flex items-center bg-[#1c1c24] border border-white/5 rounded-lg px-2.5 py-1.5 gap-1 text-xs font-mono">
          <Zap className="w-3 h-3 text-[#00f2a1]" />
          <span className="text-white font-bold">{quickBuyAmount}</span>
          <span className="text-zinc-400 text-[10px]">SOL</span>
        </div>

        <button
          onClick={onOpenForgeModal}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#ab9ff2] hover:bg-[#9b8df0] text-black font-black text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <span>+ Forge</span>
        </button>

        <div className="apex-wallet-btn-wrapper">
          <WalletMultiButton />
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifications}
          className="w-8 h-8 bg-[#1c1c24] hover:bg-[#252530] text-zinc-300 hover:text-white rounded-lg border border-white/5 flex items-center justify-center transition-all cursor-pointer"
        >
          🔔
        </button>

        {/* User Profile / Account Drawer */}
        <div 
          onClick={onOpenAccountDrawer}
          className="flex items-center gap-2 bg-[#1c1c24] hover:bg-[#252530] border border-white/5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-[#ab9ff2]/20 text-[#ab9ff2] flex items-center justify-center font-bold text-[10px]">
            {userProfile?.name ? userProfile.name[0] : 'E'}
          </div>
          <span className="text-xs font-bold text-zinc-200 hidden sm:inline">
            {userProfile?.name || 'Elvis'}
          </span>
        </div>
      </div>

    </header>
  );
}