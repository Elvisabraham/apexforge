import React, { useState, useEffect } from 'react';
import { Search, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import logo from '../assets/logo.jpg';

export default function Navbar({ activeRoute = 'discover', setActiveRoute = () => {}, onOpenForgeModal }) {
  const { connected } = useWallet();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  
  // Format string dynamically based on the current activeRoute
  const formatViewName = (route) => {
    if (!route) return 'Discover';
    return route.charAt(0).toUpperCase() + route.slice(1).toLowerCase();
  };

  // Directly derive label from activeRoute so it updates instantly on click
  const selectedView = formatViewName(activeRoute);

  // Quick-Buy & Slippage state
  const [quickBuyAmount, setQuickBuyAmount] = useState('0.1');
  const [selectedSlippage, setSelectedSlippage] = useState('1');

  const handleViewSelect = (viewName) => {
    setActiveRoute(viewName.toLowerCase());
    setViewDropdownOpen(false);
  };

  const isMainView = ['launches', 'discover', 'track'].includes(activeRoute.toLowerCase());

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121216] border-b border-white/5 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
      
      {/* LEFT: BRAND LOGO, VIEW DROPDOWN & NAV LINKS */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveRoute('launches')}>
          <img src={logo} alt="Apex Forge" className="w-7 h-7 rounded-lg object-cover transition-transform group-hover:scale-105" />
          <span className="font-black text-white text-base tracking-wider hidden sm:inline">APEXFORGE</span>
        </div>

        {/* View Switcher Dropdown (Launches, Discover, Track) */}
        <div className="relative">
          <button 
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewDropdownOpen || isMainView
                ? 'bg-[#252530] border-[#ab9ff2]/30 text-white shadow-md'
                : 'bg-[#1c1c24] hover:bg-[#252530] border-white/5 text-zinc-300'
            }`}
          >
            <span className={isMainView ? 'text-[#ab9ff2]' : 'text-zinc-300'}>{selectedView}</span>
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
              {/* Backdrop to close on outside click */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setViewDropdownOpen(false)} 
              />

              <div className="absolute top-full left-0 mt-1.5 w-36 bg-[#1c1c24] border border-white/10 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                {['Launches', 'Discover', 'Track'].map((view) => {
                  const isActive = selectedView.toLowerCase() === view.toLowerCase();
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
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ab9ff2]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Navigation Tabs (Tokens, Perps, Portfolio) */}
        <nav className="hidden md:flex items-center gap-4 font-sans text-xs font-bold">
          {['Tokens', 'Perps', 'Portfolio'].map((tab) => {
            const isActive = activeRoute.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveRoute(tab.toLowerCase())}
                className={`transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white font-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* CENTER: SEARCH BAR */}
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

      {/* RIGHT: QUICK BUY, SLIPPAGE, FORGE BUTTON & WALLET */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Global Quick Buy Amount Setting */}
        <div className="hidden lg:flex items-center bg-[#1c1c24] border border-white/5 rounded-lg px-2.5 py-1.5 gap-1 text-xs font-mono">
          <Zap className="w-3 h-3 text-[#00f2a1]" />
          <span className="text-white font-bold">{quickBuyAmount}</span>
          <span className="text-zinc-400 text-[10px]">SOL</span>
        </div>

        {/* Global Slippage Selector */}
        <div className="hidden xl:flex items-center bg-[#1c1c24] border border-white/5 rounded-lg p-0.5 gap-0.5">
          {['1', '2', '3'].map((val) => (
            <button
              key={val}
              onClick={() => setSelectedSlippage(val)}
              className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-md transition-all cursor-pointer ${
                selectedSlippage === val 
                  ? 'bg-[#2a2a36] text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Forge Launch Button */}
        <button
          onClick={onOpenForgeModal}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#ab9ff2] hover:bg-[#9b8df0] text-black font-black text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <span>+ Forge</span>
        </button>

        {/* Solana Wallet Adapter Button */}
        <div className="apex-wallet-btn-wrapper">
          <WalletMultiButton />
        </div>

      </div>

    </header>
  );
}