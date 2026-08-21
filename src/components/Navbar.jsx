import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import logo from '../assets/logo.jpg';

export default function Navbar({ activeRoute = 'launches', setActiveRoute = () => {}, onOpenForgeModal }) {
  const { connected } = useWallet();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('Launches');
  
  // Quick-Buy & Slippage state
  const [quickBuyAmount, setQuickBuyAmount] = useState('0.1');
  const [selectedSlippage, setSelectedSlippage] = useState('1');

  const handleViewSelect = (viewName) => {
    setSelectedView(viewName);
    setActiveRoute(viewName.toLowerCase());
    setViewDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121216] border-b border-white/5 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
      
      {/* LEFT: BRAND LOGO, VIEW DROPDOWN & NAV LINKS */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRoute('launches')}>
          <img src={logo} alt="Apex Forge" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-black text-white text-base tracking-wider hidden sm:inline">APEXFORGE</span>
        </div>

        {/* View Switcher Dropdown (Launches, Discover, Track) */}
        <div className="relative">
          <button 
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c1c24] hover:bg-[#252530] border border-white/5 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <span className="text-[#ab9ff2]">{selectedView}</span>
            <span className="text-[8px] text-zinc-400">▼</span>
          </button>

          {viewDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-[#1c1c24] border border-white/5 rounded-xl shadow-2xl py-1 z-50 flex flex-col">
              {['Launches', 'Discover', 'Track'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewSelect(view)}
                  className={`px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-[#252530] ${selectedView === view ? 'text-[#ab9ff2]' : 'text-zinc-400'}`}
                >
                  {view}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs (Tokens, Perps, Portfolio) */}
        <nav className="hidden md:flex items-center gap-4 font-sans text-xs font-bold">
          {['Tokens', 'Perps', 'Portfolio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRoute(tab.toLowerCase())}
              className={`transition-colors cursor-pointer ${
                activeRoute === tab.toLowerCase()
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
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
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ab9ff2] hover:bg-[#9b8df0] text-black font-extrabold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
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