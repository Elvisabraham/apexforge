import React, { useState } from 'react'
import { Search, Wallet } from 'lucide-react'
import logo from '../assets/logo.jpg'

const Navbar = ({ activeRoute = 'launches', setActiveRoute = () => {}, onOpenSearch = () => {} }) => {
  const [solPreset, setSolPreset] = useState('0.1')

  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'launches', label: 'Launches' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'portfolio', label: 'Portfolio' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#16171E] border-b border-[#272934] px-6 py-3 flex items-center justify-between shadow-lg shadow-black/40">
      
      {/* Left: Brand Logo & Nav Routes */}
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveRoute('launches')}
        >
          <img 
            src={logo} 
            alt="ApexForge Logo" 
            className="w-9 h-9 rounded-xl border border-[#272934] object-cover shadow-md"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Apex<span className="text-[#00E599]">Forge</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRoute(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeRoute === item.id
                  ? 'bg-[#1F2028] text-[#00E599] border border-[#272934]'
                  : 'text-[#8E92A2] hover:text-white hover:bg-[#1F2028]/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block mx-4">
        <button
          onClick={onOpenSearch}
          className="w-full bg-[#14151C] border border-[#272934] hover:border-[#00E599]/50 rounded-xl px-4 py-2 flex items-center justify-between text-sm text-[#8E92A2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8E92A2]" />
            <span>Search for tokens, mints, or wallets...</span>
          </div>
          <kbd className="hidden lg:inline-block text-[10px] bg-[#1F2028] text-[#8E92A2] px-2 py-0.5 rounded border border-[#272934]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick SOL Presets & Wallet Adapter */}
      <div className="flex items-center gap-3">
        {/* Quick SOL Buy Selector */}
        <div className="hidden lg:flex items-center bg-[#14151C] border border-[#272934] rounded-lg p-1">
          {['0.1', '0.5', '1.0'].map((val) => (
            <button
              key={val}
              onClick={() => setSolPreset(val)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                solPreset === val
                  ? 'bg-[#00E599] text-[#0D0E12]'
                  : 'text-[#8E92A2] hover:text-white'
              }`}
            >
              ⚡ {val} SOL
            </button>
          ))}
        </div>

        {/* Connect Wallet Button */}
        <button className="bg-[#00E599] hover:bg-[#00E599]/90 text-[#0D0E12] font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#00E599]/10 active:scale-95">
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
      </div>

    </header>
  )
}

export default Navbar