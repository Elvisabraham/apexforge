import React, { useState } from 'react';
import Earn from './Earn'; 
import Refer from './Refer'; 

// 🚀 ADDED 'previousPage' PROP
export default function EarnHub({ setActivePage, userPortfolio, previousPage }) {
  const [currentView, setCurrentView] = useState('HUB');

  if (currentView === 'STAKING') {
    return <Earn setActivePage={setActivePage} userPortfolio={userPortfolio} onBack={() => setCurrentView('HUB')} />;
  }
  
  if (currentView === 'REFERRAL') {
    return <Refer onBack={() => setCurrentView('HUB')} />;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white p-6 justify-center animate-fadeIn relative">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#089981]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2 text-center">Income Hub</h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest text-center mb-8">Select a path to grow your portfolio</p>
        
        <div className="flex flex-col gap-4">
          
          <button onClick={() => setCurrentView('STAKING')} className="bg-[#121212] border border-white/5 hover:border-[#089981]/50 p-6 rounded-3xl flex items-center gap-5 transition-all active:scale-[0.98] group shadow-sm hover:shadow-[0_0_20px_rgba(8,153,129,0.1)]">
            <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner shrink-0">🔒</div>
            <div className="text-left">
              <h2 className="font-black text-white uppercase tracking-widest text-sm">Staking & Farming</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Earn passive yield on your assets</p>
            </div>
          </button>

          <button onClick={() => setCurrentView('REFERRAL')} className="bg-[#121212] border border-white/5 hover:border-[#089981]/50 p-6 rounded-3xl flex items-center gap-5 transition-all active:scale-[0.98] group shadow-sm hover:shadow-[0_0_20px_rgba(8,153,129,0.1)]">
            <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner shrink-0">🫂</div>
            <div className="text-left">
              <h2 className="font-black text-white uppercase tracking-widest text-sm">Referral Program</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Invite friends, earn SOL forever</p>
            </div>
          </button>

        </div>
        
        {/* 🚀 DYNAMIC ESCAPE HATCH */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setActivePage(previousPage === 'home' ? 'home' : 'wallet')} 
            className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
          >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
             Return to {previousPage === 'home' ? 'Directory' : 'Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}