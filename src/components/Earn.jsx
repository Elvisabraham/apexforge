import React, { useState } from 'react';

// 🚀 ADDED 'onBack' TO PROPS
export default function Earn({ setActivePage, userPortfolio, onBack }) {
  const [activeTab, setActiveTab] = useState('STAKE'); // 'STAKE' | 'LIQUIDITY'
  const [activeVault, setActiveVault] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  // Mock User Earn Data
  const totalStakedUSD = 12450.50;
  const totalEarnedUSD = 342.15;
  const userSolBalance = userPortfolio?.find(t => t.symbol === 'SOL')?.balance || 0;

  // Mock Vault Data
  const stakingVaults = [
    { id: 'sol-native', name: 'Apex Native SOL', symbol: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', apy: '8.5%', tvl: '$12.4M', lockup: 'None', myStake: '45.0 SOL' },
    { id: 'apex-lock', name: 'Apex Governance', symbol: 'APEX', icon: '🔥', apy: '14.2%', tvl: '$4.1M', lockup: '14 Days', myStake: '0' },
  ];

  const liquidityVaults = [
    { id: 'lp-vision', name: 'VISION / SOL', symbol: 'VSN-SOL', icon: '👁️', apy: '124.5%', tvl: '$850K', feesEarned: '$12.40', myStake: '0' },
    { id: 'lp-bcat', name: 'Based Cat / SOL', symbol: 'BCAT-SOL', icon: '🐱', apy: '84.2%', tvl: '$1.2M', feesEarned: '$0.00', myStake: '0' },
  ];

  const displayVaults = activeTab === 'STAKE' ? stakingVaults : liquidityVaults;

  const handleExecuteStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    alert(`✅ Successfully Staked ${stakeAmount} ${activeVault.symbol} into ${activeVault.name} Vault!`);
    setActiveVault(null);
    setStakeAmount('');
  };

  const formatWithCommas = (val) => {
    if (!val) return '0.00';
    return parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans animate-fadeIn overflow-hidden relative">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUpNative { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        .animate-slideUpNative { animation: slideUpNative 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-40 bg-[#050505]/95 backdrop-blur-xl pt-6 pb-4 px-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-widest text-white uppercase">Yield Hub</h1>
            <span className="text-[10px] text-[#089981] font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1.5">
              Protocol Rewards Active
            </span>
          </div>
          
          {/* 🚀 WIRED THE ONBACK FUNCTION HERE */}
          <button onClick={onBack ? onBack : () => setActivePage('wallet')} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Global Yield Stats */}
        <div className="bg-[#121212] border border-[#089981]/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(8,153,129,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#089981]/20 transition-colors"></div>
          
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest relative z-10">Total Value Staked</span>
          <div className="text-4xl font-black text-white mt-1 mb-4 tracking-tighter relative z-10">${formatWithCommas(totalStakedUSD)}</div>
          
          <div className="flex justify-between items-end border-t border-white/10 pt-3 relative z-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Yield Earned</span>
              <span className="text-sm font-black text-[#089981] shadow-sm">+ ${formatWithCommas(totalEarnedUSD)}</span>
            </div>
            <button className="px-4 py-1.5 bg-[#089981] text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#06806b] transition-colors shadow-[0_0_10px_rgba(8,153,129,0.3)]">
              Claim All
            </button>
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-4">
        
        {/* Toggles */}
        <div className="flex bg-[#0A0A0A] border border-white/[0.04] p-1 rounded-xl w-full shadow-inner relative z-10 mb-6">
          {['STAKE', 'LIQUIDITY'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg transition-all duration-300 ${activeTab === tab ? 'bg-[#089981] text-black shadow-[0_0_15px_rgba(8,153,129,0.3)]' : 'text-zinc-500 hover:text-zinc-200'}`}
            >
              {tab === 'STAKE' ? 'Single Asset' : 'LP Farming'}
            </button>
          ))}
        </div>

        {/* Vault List */}
        <div className="flex flex-col gap-4">
          {displayVaults.map((vault) => (
            <div key={vault.id} onClick={() => setActiveVault(vault)} className="bg-[#121212] border border-white/5 hover:border-[#089981]/40 rounded-3xl p-5 cursor-pointer transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-xl overflow-hidden group-hover:scale-105 transition-transform shadow-inner">
                    {vault.icon.startsWith('http') ? <img src={vault.icon} className="w-full h-full object-cover p-2" alt="icon"/> : vault.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">{vault.name}</span>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mt-0.5">{vault.symbol}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. APY</span>
                  <span className="text-lg font-black text-[#089981]">{vault.apy}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol TVL</span>
                  <span className="text-xs font-bold text-zinc-300">{vault.tvl}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Your Position</span>
                  <span className={`text-xs font-black ${vault.myStake !== '0' ? 'text-[#089981]' : 'text-zinc-500'}`}>{vault.myStake}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- STAKING MODAL --- */}
      {activeVault && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0 z-0" onClick={() => setActiveVault(null)}></div>
          
          <div className="bg-[#1C1C1E] border-t border-[#089981]/30 rounded-t-3xl w-full max-w-lg p-6 relative z-10 shadow-[0_0_80px_rgba(8,153,129,0.15)] animate-slideUpNative flex flex-col">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-lg overflow-hidden">
                  {activeVault.icon.startsWith('http') ? <img src={activeVault.icon} className="w-full h-full object-cover p-1.5" alt="icon"/> : activeVault.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Deposit {activeVault.symbol}</h3>
                  <span className="text-[10px] text-[#089981] font-black tracking-widest">Current APY: {activeVault.apy}</span>
                </div>
              </div>
              <button onClick={() => setActiveVault(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">✕</button>
            </div>

            <div className="bg-black/40 border border-white/5 focus-within:border-[#089981]/50 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all mb-4">
              <input 
                type="number" 
                value={stakeAmount} 
                onChange={(e) => setStakeAmount(e.target.value)} 
                placeholder="0.00" 
                className="bg-transparent text-3xl font-black text-white w-full focus:outline-none placeholder-zinc-700" 
              />
              <span className="text-sm font-black text-zinc-500 pr-2">{activeVault.symbol}</span>
            </div>

            <div className="flex justify-between items-center px-1 mb-6">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Wallet Balance: {userSolBalance.toFixed(2)} SOL</span>
              <div className="flex gap-2">
                <button onClick={() => setStakeAmount((userSolBalance * 0.5).toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Half</button>
                <button onClick={() => setStakeAmount(userSolBalance.toFixed(2))} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors">Max</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-[#0A0A0A] border border-white/5 rounded-xl mb-6 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Lockup Period</span>
                <span className="text-[10px] font-black text-zinc-300">{activeVault.lockup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Est. Monthly Yield</span>
                <span className="text-[10px] font-black text-[#089981]">
                  {stakeAmount ? `+${((parseFloat(stakeAmount) * parseFloat(activeVault.apy)) / 100 / 12).toFixed(4)} ${activeVault.symbol}` : '0.00'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleExecuteStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full bg-[#089981] hover:bg-[#06806b] disabled:bg-[#089981]/30 disabled:text-white/50 text-white font-black text-sm py-4.5 rounded-2xl tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(8,153,129,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Confirm Stake 🔒
            </button>
          </div>
        </div>
      )}
    </div>
  );
}