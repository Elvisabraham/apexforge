import React, { useState } from 'react';

export default function TrackView({ 
  wallets: initialWallets = [], 
  activities: initialActivities = [], 
  onAddWallet, 
  onRemoveWallet 
}) {
  const [wallets, setWallets] = useState(
    initialWallets.length > 0 ? initialWallets : [
      { id: '1', label: 'Whale Alpha 1', address: '43pU..q2HR', balance: '142.5 SOL', active: true },
      { id: '2', label: 'Smart Money Wallet', address: '8xZw..99Lp', balance: '48.2 SOL', active: true },
    ]
  );

  const [activities, setActivities] = useState(
    initialActivities.length > 0 ? initialActivities : [
      { id: 'a1', wallet: 'Whale Alpha 1', type: 'BUY', amount: '12.5 SOL', token: 'ANSEM', time: '2m ago' },
      { id: 'a2', wallet: 'Smart Money Wallet', type: 'SELL', amount: '5.0 SOL', token: 'BULLSHIT', time: '8m ago' },
      { id: 'a3', wallet: 'Whale Alpha 1', type: 'BUY', amount: '25.0 SOL', token: 'LAYOOO', time: '14m ago' },
    ]
  );

  const [isAdding, setIsAdding] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [labelInput, setLabelInput] = useState('');

  const handleCreateWallet = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    const newWallet = {
      id: Date.now().toString(),
      label: labelInput.trim() || `Wallet ${wallets.length + 1}`,
      address: addressInput.length > 10 
        ? `${addressInput.slice(0, 4)}..${addressInput.slice(-4)}` 
        : addressInput,
      balance: '0.0 SOL',
      active: true,
    };

    setWallets([newWallet, ...wallets]);
    if (onAddWallet) onAddWallet(newWallet);

    setAddressInput('');
    setLabelInput('');
    setIsAdding(false);
  };

  const handleRemove = (id) => {
    setWallets(wallets.filter((w) => w.id !== id));
    if (onRemoveWallet) onRemoveWallet(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full select-none">
      
      {/* LEFT COLUMN: TRACKED WALLETS */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-5 flex flex-col min-h-[420px]">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div>
            <h3 className="font-bold text-gray-200 text-sm">Tracking List</h3>
            <p className="text-xs text-zinc-500">Monitor targeted wallets and smart traders</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#089981] hover:bg-[#067a67] text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all active:scale-95 shadow-md shadow-[#089981]/10 cursor-pointer"
          >
            {isAdding ? 'Cancel' : '+ Add Wallet'}
          </button>
        </div>

        {/* Inline Add Form */}
        {isAdding && (
          <form onSubmit={handleCreateWallet} className="mb-4 p-3 bg-[#16171d] border border-[#089981]/30 rounded-lg space-y-2.5">
            <input
              type="text"
              placeholder="Wallet Address / CA..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="w-full bg-[#0D0E12] border border-white/10 rounded-md px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#089981]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Label (e.g. Smart Whale)"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="flex-1 bg-[#0D0E12] border border-white/10 rounded-md px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#089981]"
              />
              <button
                type="submit"
                className="bg-[#089981] hover:bg-[#067a67] text-white font-bold text-xs px-4 py-1.5 rounded-md transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Wallet Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {wallets.length > 0 ? (
            wallets.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 bg-[#16171d] hover:bg-[#1a1c24] border border-white/5 rounded-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#089981]/15 text-[#089981] border border-[#089981]/30 flex items-center justify-center font-bold text-xs">
                    🎯
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{w.label}</div>
                    <div className="text-[11px] font-mono text-zinc-400">{w.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#089981]">{w.balance}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(w.id)}
                    className="text-zinc-500 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer px-1.5 py-0.5"
                    title="Remove Wallet"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-sm font-bold text-zinc-400 mb-1">No tracked wallets</p>
              <p className="text-xs text-zinc-500 mb-4">Add a wallet address to begin tracking transactions.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE MONITOR FEED */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-5 flex flex-col min-h-[420px]">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div>
            <h3 className="font-bold text-gray-200 text-sm">Live Activity Feed</h3>
            <p className="text-xs text-zinc-500">Real-time trade stream from tracked wallets</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#089981] bg-[#089981]/10 px-2.5 py-1 rounded-full border border-[#089981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-ping"></span>
            LIVE
          </span>
        </div>

        {/* Activity Feed List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activities.length > 0 ? (
            activities.map((act) => {
              const isBuy = act.type === 'BUY';
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 bg-[#16171d] border border-white/5 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        isBuy
                          ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {act.type}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-white">{act.wallet}</span>
                      <span className="text-zinc-400 ml-1.5">swapped for <strong className="text-white">{act.token}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className={`font-bold ${isBuy ? 'text-[#089981]' : 'text-red-400'}`}>
                      {act.amount}
                    </div>
                    <div className="text-[10px] text-zinc-500">{act.time}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-sm font-bold text-zinc-400 mb-1">No activity yet</p>
              <p className="text-xs text-zinc-500">Wallet activities will appear here in real-time.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}