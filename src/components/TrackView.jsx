import React from 'react';

export default function TrackView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[350px]">
        <h3 className="font-semibold text-gray-200 mb-2">Tracking</h3>
        <p className="text-sm text-gray-400 mb-4">No tracked wallets</p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          Click the + button to add a wallet
        </button>
      </div>

      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[350px]">
        <h3 className="font-semibold text-gray-200 mb-2">Monitor</h3>
        <p className="text-sm text-gray-400">No activity yet</p>
        <p className="text-xs text-gray-500 mt-1">Wallet activities will appear in real-time</p>
      </div>
    </div>
  );
}