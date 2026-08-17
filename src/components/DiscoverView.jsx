import React, { useState } from 'react';
import LaunchesView from './LaunchesView';
import TrackView from './TrackView';

export default function DiscoverView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  const [activeTab, setActiveTab] = useState('launches');

  return (
    <div className="flex flex-col w-full h-full text-white bg-[#121214] p-4 sm:p-6 overflow-hidden">
      {/* Sub-navigation Header */}
      <div className="flex items-center space-x-6 border-b border-gray-800 pb-4 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab('launches')}
          className={`font-medium pb-1 transition-colors ${
            activeTab === 'launches'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Launches
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`font-medium pb-1 transition-colors ${
            activeTab === 'track'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Track
        </button>
      </div>

      {/* Dynamic Content View */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {activeTab === 'launches' ? (
          <LaunchesView 
            newTokens={newTokens} 
            migratingTokens={migratingTokens} 
            migratedTokens={migratedTokens} 
          />
        ) : (
          <TrackView />
        )}
      </div>
    </div>
  );
}