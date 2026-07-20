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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn h-full bg-[#050505] text-white">
      
      {/* --- ESCAPE HATCH / BACK BUTTON --- */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group w-fit pr-4">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>
      )}

      {/* HEADER */}
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase mb-2">Refer & Earn</h1>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-2xl">
          Invite your network to Apex Forge. Earn <span className="text-[#089981] font-bold">up to 10% of their trading fees</span> in SOL forever. Rewards are instantly claimable to your wallet.
        </p>
      </div>

      {/* UNIQUE LINK GENERATOR */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-inner mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl pointer-events-none"></div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3 relative z-10">Your Master Invite Link</p>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 flex items-center shadow-inner overflow-hidden">
            <span className="text-sm font-mono text-zinc-300 truncate">{referralLink}</span>
          </div>
          <button 
            onClick={handleCopy}
            className={`px-6 py-3.5 rounded-xl font-black uppercase text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
              copied 
                ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50 shadow-[0_0_15px_rgba(0,255,102,0.2)]' 
                : 'bg-[#089981] hover:bg-[#06806b] text-white shadow-[0_0_20px_rgba(8,153,129,0.3)]'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col justify-center">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Referrals</span>
          <span className="text-2xl font-black text-white">1,420</span>
        </div>
        
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col justify-center">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Earned</span>
          <span className="text-2xl font-black text-white font-mono">14.50 SOL</span>
        </div>

        {/* 🚀 UPGRADED: Pending Payout Box with proper brand colors */}
        <div className="bg-[#121212] border border-[#089981]/30 rounded-2xl p-5 shadow-[0_0_15px_rgba(8,153,129,0.05)] flex flex-col justify-center col-span-2 lg:col-span-1 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#089981]/20 rounded-full blur-xl group-hover:bg-[#089981]/30 transition-colors"></div>
          <span className="text-[10px] text-[#089981] font-bold uppercase tracking-widest mb-1 relative z-10">Pending Payout</span>
          <div className="flex justify-between items-end relative z-10">
            <span className="text-2xl font-black text-white font-mono">2.15 SOL</span>
            <button className="text-[10px] bg-[#089981] hover:bg-[#06806b] text-white px-4 py-2 rounded-lg uppercase font-black tracking-wider transition-all active:scale-95 shadow-[0_0_10px_rgba(8,153,129,0.3)]">Claim</button>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div>
        <h3 className="text-xs font-black text-zinc-400 tracking-widest uppercase mb-4 border-b border-white/5 pb-2">Recent Invites</h3>
        <div className="flex flex-col gap-2">
          {['4xV9...qPn2', '7mKl...wXr1', '2pZa...bYc9'].map((wallet, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#121212]/50 border border-white/5 rounded-xl hover:bg-[#121212] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black border border-[#089981]/30 flex items-center justify-center text-[12px] shadow-inner shadow-[#089981]/10">🫂</div>
                <div>
                  <p className="text-xs font-mono font-bold text-zinc-200 hover:text-[#089981] transition-colors cursor-pointer">{wallet}</p>
                  <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Joined Today</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-[#00FF66] shadow-sm">+ 0.05 SOL</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}