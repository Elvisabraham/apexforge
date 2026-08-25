import React from 'react';

export default function TrackView({ onAddWallet }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#121318] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[350px]">
        <h3 className="font-bold text-gray-200 mb-2">Tracking</h3>
        <p className="text-sm text-zinc-400 mb-4">No tracked wallets</p>
        <button 
          onClick={onAddWallet}
          className="bg-[#00f2a1] hover:bg-[#00d890] text-black font-black text-xs py-2.5 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#00f2a1]/10 cursor-pointer"
        >
          Click the + button to add a wallet
        </button>
      </div>

      <div className="bg-[#121318] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[350px]">
        <h3 className="font-bold text-gray-200 mb-2">Monitor</h3>
        <p className="text-sm text-zinc-400">No activity yet</p>
        <p className="text-xs text-zinc-500 mt-1">Wallet activities will appear in real-time</p>
      </div>
    </div>
  );
}