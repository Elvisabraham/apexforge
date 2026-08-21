import React, { useState, useRef, useEffect } from 'react';
import LaunchesView from './LaunchesView';
import TrackView from './TrackView';
import DiscoverHomeView from './DiscoverHomeView';

export default function DiscoverView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  const [activeTab, setActiveTab] = useState('discover');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col w-full h-full text-white bg-[#121214] px-4 pt-2 pb-4 overflow-hidden">
      
      {/* Header Dropdown & Navigation */}
      <div className="relative flex items-center space-x-6 border-b border-zinc-800/80 pb-4 mb-5 shrink-0" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-lg font-bold text-white hover:text-purple-400 transition-colors focus:outline-none"
          >
            <span className="capitalize">{activeTab}</span>
            <span className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-[#1e1e24] border border-zinc-700/80 rounded-xl shadow-2xl py-2 z-50">
              {['discover', 'launches', 'track'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm capitalize transition-colors ${activeTab === tab ? 'text-purple-400 bg-zinc-800/60 font-medium' : 'text-gray-300 hover:bg-zinc-800/40 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-sm text-zinc-400">
          <span className="cursor-pointer hover:text-white transition-colors">Tokens</span>
          <span className="cursor-pointer hover:text-white transition-colors">Perps</span>
          <span className="cursor-pointer hover:text-white transition-colors">Portfolio</span>
        </div>
      </div>

      {/* Dynamic Main View Switcher */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'discover' ? (
          <DiscoverHomeView newTokens={newTokens} migratingTokens={migratingTokens} migratedTokens={migratedTokens} />
        ) : activeTab === 'launches' ? (
          <LaunchesView newTokens={newTokens} migratingTokens={migratingTokens} migratedTokens={migratedTokens} />
        ) : (
          <TrackView />
        )}
      </div>
    </div>
  );
}