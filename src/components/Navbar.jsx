import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import logo from '../assets/logo.jpg';

export default function Navbar({ activeRoute = 'launches', setActiveRoute = () => {}, onOpenForgeModal }) {
  const { connected } = useWallet();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('Launches');
  const [selectedRpc, setSelectedRpc] = useState(1);

  const handleViewSelect = (viewName) => {
    setSelectedView(viewName);
    setActiveRoute(viewName.toLowerCase());
    setViewDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0E12] border-b border-[#262933] px-4 py-2.5 flex items-center justify-between gap-4 select-none">
      
      {/* LEFT: BRAND LOGO & VIEW SWITCHER DROPDOWN */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRoute('launches')}>
          <img src={logo} alt="Apex Forge" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-black text-white text-base tracking-wider hidden sm:inline">APEXFORGE</span>
        </div>

        {/* VIEW SWITCHER DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#16181E] hover:bg-[#1F222A] border border-[#262933] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <span className="text-[#00E676]">{selectedView}</span>
            <span className="text-[9px] text-zinc-500">▼</span>
          </button>

          {viewDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-[#16181E] border border-[#262933] rounded-xl shadow-2xl py-1 z-50 flex flex-col">
              {['Launches', 'Discover', 'Track'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewSelect(view)}
                  className={`px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-[#1F222A] ${selectedView === view ? 'text-[#00E676]' : 'text-zinc-400'}`}
                >
                  {view}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAV ROUTE TABS */}
        <nav className="hidden md:flex items-center gap-1 bg-[#16181E] p-1 rounded-xl border border-[#262933]">
          {['Tokens', 'Perps', 'Portfolio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRoute(tab.toLowerCase())}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeRoute === tab.toLowerCase()
                  ? 'bg-[#1F222A] text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="flex-1 max-w-sm hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search token, symbol or address..."
            className="w-full bg-[#16181E] border border-[#262933] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] font-medium transition-all"
          />
        </div>
      </div>

      {/* RIGHT: FORGE CTA, RPC SELECTOR & WALLET */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* RPC PRESET SELECTOR */}
        <div className="hidden xl:flex items-center gap-1 bg-[#16181E] p-1 rounded-lg border border-[#262933] text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] mx-1 animate-pulse"></span>
          {[1, 2, 3].map((rpc) => (
            <button
              key={rpc}
              onClick={() => setSelectedRpc(rpc)}
              className={`w-5 h-5 rounded flex items-center justify-center font-bold transition-all cursor-pointer ${
                selectedRpc === rpc ? 'bg-[#1F222A] text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {rpc}
            </button>
          ))}
        </div>

        {/* PRIMARY + FORGE LAUNCH BUTTON */}
        <button
          onClick={onOpenForgeModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>+ Forge</span>
        </button>

        {/* WALLET BUTTON */}
        <div className="apex-wallet-btn-wrapper">
          <WalletMultiButton />
        </div>

      </div>

    </header>
  );
}