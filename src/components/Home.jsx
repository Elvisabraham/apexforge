import React, { useState } from 'react';
import DiscoverView from './DiscoverView';

export default function Home({ 
  activeRoute = 'launches',
  setActiveRoute = () => {},
  tokens = [], 
  trendingTokens = [], 
  migratingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  setActivePage, 
  userProfile, 
  onOpenSidebar, 
  onOpenAccountDrawer, 
  onOpenNotifications,
  searchQuery = ''
}) {
  return (
    <div className="flex-1 bg-[#050505] text-white flex flex-col w-full h-screen overflow-hidden p-2 pt-0 md:p-3 md:pt-0 font-sans">
      
      {/* Desktop Top Bar Navigation */}
      <div className="flex items-center justify-between pb-2 shrink-0 border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="hidden text-zinc-400 hover:text-white p-1 rounded-lg bg-white/5"
          >
            ≡
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenNotifications}
            className="w-8 h-8 bg-[#141417] border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm"
          >
            🔔
          </button>
          <div 
            onClick={onOpenAccountDrawer}
            className="flex items-center gap-2 bg-[#141417] border border-zinc-800 hover:border-zinc-700 px-3 py-1 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-[10px]">
              {userProfile?.name ? userProfile.name[0] : 'E'}
            </div>
            <span className="text-xs font-bold text-zinc-200">{userProfile?.name || 'Elvis AI'}</span>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Desktop View Container */}
      <div className="flex-1 w-full h-full min-h-0 overflow-hidden">
        <DiscoverView 
          activeRoute={activeRoute} 
          setActiveRoute={setActiveRoute} 
          newTokens={trendingTokens} 
          migratingTokens={migratingTokens} 
          migratedTokens={graduatedTokens} 
        />
      </div>

    </div>
  );
}