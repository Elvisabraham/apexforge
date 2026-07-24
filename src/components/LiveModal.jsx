import React, { useState } from 'react';

export default function TokenHome({ 
  token, 
  onBack, 
  onTradeClick, 
  onOpenProfile, 
  onOpenChat, 
  onOpenLiveModal 
}) {
  const [activeTab, setActiveTab] = useState('chart');

  // Safely guard token data to avoid undefined errors
  const tokenName = token?.tokenName || token?.name || 'Unknown Token';
  const tokenSymbol = token?.symbol || 'TOKEN';
  const mintAddress = token?.mintAddress || token?.address || 'CA: Pending...';
  const icon = token?.icon || '🪙';
  const imagePreview = token?.imagePreview || null;
  const price = token?.price || '0.00';
  const mcap = token?.mcap || '$0';
  const change = token?.change || '+0.0%';
  const isGraduated = token?.isGraduated || false;
  const progress = token?.progress || 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] text-white overflow-y-auto">
      
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <button 
          onClick={() => onBack && onBack()} 
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onOpenLiveModal && onOpenLiveModal()} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500/20 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Go Live
          </button>
          
          <button 
            onClick={() => onOpenChat && onOpenChat()} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#089981]/10 border border-[#089981]/30 text-[#089981] rounded-lg text-xs font-bold hover:bg-[#089981]/20 transition-all"
          >
            💬 Chat
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        
        {/* Token Overview Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-center text-3xl overflow-hidden shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt={tokenName} className="w-full h-full object-cover" />
              ) : (
                icon
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{tokenName}</h1>
                <span className="text-xs font-black text-[#089981] bg-[#089981]/10 border border-[#089981]/20 px-2 py-0.5 rounded">
                  ${tokenSymbol}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-500 mt-1">{mintAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Price</span>
              <span className="text-lg font-black text-white font-mono">${price}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Market Cap</span>
              <span className="text-lg font-black text-white font-mono">{mcap}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">24h Change</span>
              <span className="text-lg font-black text-[#00FF66] font-mono">{change}</span>
            </div>
          </div>
        </div>

        {/* Bonding Curve Progress */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-zinc-400">Bonding Curve Progress</span>
            <span className="text-[#089981] font-mono">{isGraduated ? '100% (Graduated)' : `${progress}%`}</span>
          </div>
          <div className="w-full bg-[#121212] h-2.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-[#089981] to-[#00FF66] h-full transition-all duration-500" 
              style={{ width: `${isGraduated ? 100 : progress}%` }}
            ></div>
          </div>
        </div>

        {/* Trade CTA Button */}
        <button 
          onClick={() => onTradeClick && onTradeClick(token)} 
          className="w-full py-4 bg-[#089981] hover:bg-[#06806b] text-black text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)] active:scale-[0.98]"
        >
          Trade ${tokenSymbol}
        </button>

      </div>
    </div>
  );
}