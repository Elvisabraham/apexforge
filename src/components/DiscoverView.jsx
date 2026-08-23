import React from 'react';
import LaunchesView from './LaunchesView';
import TrackView from './TrackView';
import DiscoverHomeView from './DiscoverHomeView';

export default function DiscoverView({ 
  activeRoute = 'discover', 
  setActiveRoute, 
  newTokens = [], 
  migratingTokens = [], 
  migratedTokens = [] 
}) {
  const currentTab = activeRoute.toLowerCase();

  return (
    <div className="flex flex-col w-full h-full text-white bg-[#0e0f12] p-0 m-0 overflow-hidden">
      {/* Main Content Container - Fits flush right beneath global navbar */}
      <div className="flex-1 w-full h-full min-h-0 overflow-hidden p-0 m-0">
        {currentTab === 'discover' ? (
          <DiscoverHomeView 
            newTokens={newTokens} 
            migratingTokens={migratingTokens} 
            migratedTokens={migratedTokens} 
          />
        ) : currentTab === 'launches' ? (
          <LaunchesView 
            newTokens={newTokens} 
            migratingTokens={migratingTokens} 
            migratedTokens={migratedTokens} 
          />
        ) : currentTab === 'track' ? (
          <TrackView />
        ) : (
          <DiscoverHomeView 
            newTokens={newTokens} 
            migratingTokens={migratingTokens} 
            migratedTokens={migratedTokens} 
          />
        )}
      </div>
    </div>
  );
}