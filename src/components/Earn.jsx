import React, { useState } from 'react';

export default function Earn({ setActivePage, userPortfolio, onBack }) {
  const [activeTab, setActiveTab] = useState('STAKE'); // 'STAKE' | 'FARM'
  const [activeVault, setActiveVault] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  // User Data & Balances
  const totalStakedUSD = 12450.50;
  const totalEarnedUSD = 342.15;
  const userSolBalance = userPortfolio?.find(t => t.symbol === 'SOL')?.balance || 0;

  // Enriched Vault Data
  const stakingVaults = [
    { id: 'sol-native', name: 'Apex Native SOL', symbol: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', apy: '8.5%', tvl: '$12.4M', lockup: 'None', myStake: '45.0', earned: '+$14.20', badge: 'Stable' },
    { id: 'apex-lock', name: 'Apex Governance', symbol: 'APEX', icon: '🔥', apy: '14.2%', tvl: '$4.1M', lockup: '14 Days', myStake: '0', earned: '$0.00', badge: '🔥 Hot' },
    { id: 'neuro-stake', name: 'Neuro AI', symbol: 'NEURO', icon: '🧠', apy: '42.5%', tvl: '$850K', lockup: '30 Days', myStake: '0', earned: '$0.00', badge: '' },
  ];

  const liquidityVaults = [
    { id: 'lp-apex', name: 'APEX / SOL', symbol: 'APEX-SOL', icon: '🔥', apy: '124.5%', tvl: '$850K', feesEarned: '$12.40', myStake: '0', badge: 'High Yield' },
    { id: 'lp-bcat', name: 'Based Cat / SOL', symbol: 'BCAT-SOL', icon: '🐱', apy: '84.2%', tvl: '$1.2M', feesEarned: '$0.00', myStake: '0', badge: '' },
  ];

  const displayVaults = activeTab === 'STAKE' ? stakingVaults : liquidityVaults;
  
  // Separate active positions from available pools
  const activePositions = displayVaults.filter(v => parseFloat(v.myStake) > 0);
  const availablePools = displayVaults.filter(v => parseFloat(v.myStake) === 0);

  const handleExecuteStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    alert(`✅ Successfully Staked ${stakeAmount} ${activeVault.symbol} into ${activeVault.name} Vault!`);
    setActiveVault(null);
    setStakeAmount('');
  };

  const formatWithCommas = (val) => {
    if (!val && val !== 0) return '0.00';
    return parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans animate-fadeIn overflow-hidden relative select-none">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUpNative { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        .animate-slideUpNative { animation: slideUpNative 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#050505]/95 backdrop-blur-xl pt-6 pb-4 px-4 border-b border-white/[0.04] sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-md">💰</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-widest text-white uppercase mt-1">Yield Hub</h1>
              <span className="text-[9px] text-[#089981] font-bold tracking-widest uppercase flex items-center gap-1.5">
                Protocol Rewards Active
              </span>
            </div>
          </div>
          
          <button 
            onClick={onBack ? onBack : () => setActivePage('wallet')} 
            className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95 shadow-inner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 🚀 HERO PORTFOLIO CARD */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#089981]/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(8,153,129,0.1)] relative overflow-hidden flex flex-col group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#089981]/30 transition-colors"></div>
            
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 relative z-10">Total Value Staked</span>
            <div className="flex items-end gap-3 mb-6 relative z-10">
              <span className="text-4xl font-black text-white leading-none tracking-tight">${formatWithCommas(totalStakedUSD)}</span>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-0.5">Total Yield Earned</span>
                <span className="text-lg font-mono font-black text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]">
                  + ${formatWithCommas(totalEarnedUSD)}
                </span>
              </div>
              <button className="bg-[#089981] hover:bg-[#06806b] text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(8,153,129,0.3)] active:scale-95 transition-all">
                Claim All
              </button>
            </div>
          </div>
        </div>

        {/* --- GAMIFIED TABS --- */}
        <div className="px-4 sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md pt-2 pb-3">
          <div className="flex bg-[#121212] border border-white/5 p-1 rounded-2xl w-full mx-auto shadow-inner">
            {['STAKE', 'FARM'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[#089981] text-white shadow-[0_4px_15px_rgba(8,153,129,0.3)]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {tab === 'STAKE' ? 'Single Asset' : 'LP Farming'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col px-4 gap-6 pt-2">
          
          {/* ACTIVE POSITIONS SECTION */}
          {activePositions.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Your Active Vaults</h3>
              {activePositions.map(pos => (
                <div key={pos.id} onClick={() => setActiveVault(pos)} className="bg-gradient-to-r from-[#0A0A0A] to-[#121212] border border-[#089981]/30 hover:border-[#089981]/60 rounded-2xl p-4 shadow-[0_0_15px_rgba(8,153,129,0.05)] cursor-pointer transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center font-black text-white shadow-inner overflow-hidden">
                        {pos.icon.startsWith('http') ? <img src={pos.icon} className="w-full h-full object-cover p-1.5" alt="icon"/> : pos.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-widest">{pos.symbol}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{pos.myStake} {pos.symbol} Staked</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-[#00FF66] tracking-widest">{pos.earned || pos.feesEarned}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase">Yield Earned</span>
                    </div>
                  </div>
                  
                  {/* Lockup Status */}
                  <div className="w-full flex justify-between items-center pt-3 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Current APY: <strong className="text-[#089981]">{pos.apy}</strong></span>
                    <span>Lock: {pos.lockup || 'Flexible'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AVAILABLE POOLS SECTION */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1 mt-2">Available Vaults</h3>
            
            {availablePools.map(pool => (
              <div key={pool.id} onClick={() => setActiveVault(pool)} className="bg-[#0A0A0A] border border-white/5 hover:border-[#089981]/50 rounded-2xl p-4 flex flex-col gap-4 transition-colors group cursor-pointer shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center font-black text-white shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                      {pool.icon.startsWith('http') ? <img src={pool.icon} className="w-full h-full object-cover p-2" alt="icon"/> : pool.icon}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white tracking-widest group-hover:text-[#089981] transition-colors">{pool.symbol}</span>
                        {pool.badge && <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-rose-500/30 text-rose-500 bg-rose-500/10">{pool.badge}</span>}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500">{pool.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Est. APY</span>
                    <span className="text-lg font-mono font-black text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.2)]">{pool.apy}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Protocol TVL</span>
                    <span className="text-xs font-black text-white font-mono mt-0.5">{pool.tvl}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Lock Period</span>
                    <span className="text-xs font-black text-white mt-0.5">{pool.lockup || 'Flexible'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* --- STAKING MODAL --- */}
      {activeVault && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0 z-0" onClick={() => setActiveVault(null)}></div>
          
          <div className="bg-[#121212] border-t border-[#089981]/30 rounded-t-3xl w-full max-w-lg p-6 relative z-10 shadow-[0_-20px_50px_rgba(8,153,129,0.1)] animate-slideUpNative flex flex-col">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-lg overflow-hidden shadow-inner">
                  {activeVault.icon.startsWith('http') ? <img src={activeVault.icon} className="w-full h-full object-cover p-1.5" alt="icon"/> : activeVault.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Deposit {activeVault.symbol}</h3>
                  <span className="text-[10px] text-[#089981] font-black tracking-widest">Current APY: {activeVault.apy}</span>
                </div>
              </div>
              <button onClick={() => setActiveVault(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-[#050505] border border-white/5 focus-within:border-[#089981]/50 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all mb-3 shadow-inner">
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
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Balance: {activeVault.symbol === 'SOL' ? formatWithCommas(userSolBalance) : '0.00'} {activeVault.symbol}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setStakeAmount(activeVault.symbol === 'SOL' ? (userSolBalance * 0.5).toFixed(2) : '0')} 
                  className="text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-white/5 active:scale-95"
                >
                  Half
                </button>
                <button 
                  onClick={() => setStakeAmount(activeVault.symbol === 'SOL' ? formatWithCommas(userSolBalance).replace(/,/g, '') : '0')} 
                  className="text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-white/5 active:scale-95"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-[#0A0A0A] border border-white/5 rounded-xl mb-6 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lockup Period</span>
                <span className="text-[10px] font-black text-white">{activeVault.lockup || 'Flexible'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Monthly Yield</span>
                <span className="text-[10px] font-black text-[#00FF66]">
                  {stakeAmount ? `+${((parseFloat(stakeAmount) * parseFloat(activeVault.apy)) / 100 / 12).toFixed(4)} ${activeVault.symbol}` : '0.00'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleExecuteStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full bg-[#089981] hover:bg-[#06806b] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black text-sm py-4 rounded-2xl tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(8,153,129,0.3)] disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Confirm Stake 🔒
            </button>
          </div>
        </div>
      )}
    </div>
  );
}