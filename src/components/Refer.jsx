import React, { useState } from 'react';

// FIXED: Added onBack prop to receive the exit command
export default function Refer({ onBack }) {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://apexforge.cc/ref/elvis_vision";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans overflow-hidden select-none animate-fadeIn">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#050505]/95 backdrop-blur-xl pt-6 pb-4 px-4 border-b border-white/[0.04] sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-md">🤝</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-widest text-white uppercase mt-1">Refer & Earn</h1>
              <span className="text-[9px] text-[#089981] font-bold tracking-widest uppercase flex items-center gap-1.5">
                Affiliate Network Active
              </span>
            </div>
          </div>
          
          {/* ESCAPE HATCH / BACK BUTTON */}
          {onBack && (
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95 shadow-inner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-6">
        
        {/* HERO INTRO */}
        <div className="mb-6">
          <p className="text-zinc-400 text-sm font-medium leading-relaxed">
            Invite your network to Apex Forge. Earn <strong className="text-[#089981] drop-shadow-[0_0_8px_rgba(8,153,129,0.3)]">up to 10% of their trading fees</strong> in SOL forever. Rewards are instantly claimable to your wallet.
          </p>
        </div>

        {/* UNIQUE LINK GENERATOR */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#089981]/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(8,153,129,0.1)] mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#089981]/30 transition-colors"></div>
          
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3 relative z-10">Your Master Invite Link</p>
          
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 flex items-center shadow-inner overflow-hidden focus-within:border-[#089981]/50 transition-colors">
              <span className="text-sm font-mono text-zinc-300 truncate select-all">{referralLink}</span>
            </div>
            <button 
              onClick={handleCopy}
              className={`px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 shadow-lg ${
                copied 
                  ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50 shadow-[0_0_15px_rgba(0,255,102,0.2)]' 
                  : 'bg-[#089981] hover:bg-[#06806b] text-black shadow-[0_0_20px_rgba(8,153,129,0.3)]'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col justify-center hover:border-white/10 transition-colors">
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Total Referrals</span>
            <span className="text-2xl font-black text-white tracking-tight">1,420</span>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col justify-center hover:border-white/10 transition-colors">
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Total Earned</span>
            <span className="text-2xl font-black text-white font-mono tracking-tight">14.50 <span className="text-sm text-zinc-500">SOL</span></span>
          </div>

          {/* Pending Payout Box */}
          <div className="bg-gradient-to-r from-[#121212] to-[#0A0A0A] border border-[#089981]/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(8,153,129,0.1)] flex flex-col justify-center col-span-2 lg:col-span-1 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#089981]/20 rounded-full blur-xl group-hover:bg-[#089981]/30 transition-colors"></div>
            
            <span className="text-[9px] text-[#089981] font-black uppercase tracking-widest mb-1 relative z-10">Pending Payout</span>
            <div className="flex justify-between items-end relative z-10 mt-1">
              <span className="text-2xl font-black text-white font-mono tracking-tight">2.15 <span className="text-sm text-[#089981]">SOL</span></span>
              <button className="text-[10px] bg-[#089981] hover:bg-[#06806b] text-black px-4 py-2 rounded-lg uppercase font-black tracking-widest transition-all active:scale-95 shadow-[0_0_15px_rgba(8,153,129,0.3)]">
                Claim
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="flex flex-col gap-4 pt-2">
          <h3 className="text-[10px] font-black text-zinc-500 tracking-widest uppercase pl-1 border-b border-white/5 pb-2">Recent Invites</h3>
          
          <div className="flex flex-col gap-2">
            {['4xV9...qPn2', '7mKl...wXr1', '2pZa...bYc9'].map((wallet, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-[#121212] hover:border-white/10 transition-colors cursor-pointer group shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#089981]/30 flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${wallet}`} alt="Avatar" className="w-full h-full object-cover p-1.5 opacity-80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono font-black text-zinc-200 group-hover:text-[#089981] transition-colors">{wallet}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Joined Today</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-black text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.2)]">+ 0.05 SOL</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">Fee Bonus</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}