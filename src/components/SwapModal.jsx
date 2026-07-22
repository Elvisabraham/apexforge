import React from 'react';

export default function SwapModal({
  isOpen,
  onClose,
  swapAmount,
  setSwapAmount,
  swapPayAsset,
  setSwapPayAsset,
  swapReceiveAsset,
  setSwapReceiveAsset,
  showPayDropdown,
  setShowPayDropdown,
  showReceiveDropdown,
  setShowReceiveDropdown,
  portfolio = [],
  flipSwap,
  handleExecuteSwap,
  formatNumber,
  formatBalance,
  getAssetColor
}) {
  if (!isOpen) return null;

  const activePayAsset = portfolio.find(a => a.symbol === swapPayAsset) || portfolio[0];
  const activeReceiveAsset = portfolio.find(a => a.symbol === swapReceiveAsset) || portfolio[1] || portfolio[0];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-3xl animate-fadeIn overflow-y-auto">
      <div className="bg-[#050505] border border-white/[0.05] rounded-[2.5rem] w-full max-w-[420px] p-6 sm:p-8 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[95vh] overflow-y-auto scrollbar-hide my-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="w-9 shrink-0"></div>
          <h2 className="text-[11px] font-black text-center uppercase tracking-[0.2em] text-zinc-400 truncate px-2">
            Swap Tokens
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300 shrink-0" title="Support">
              <span className="text-base drop-shadow-lg block leading-none">🎧</span>
            </button>
            <button onClick={onClose} className="text-zinc-500 hover:text-white p-2 rounded-full transition-all duration-300 hover:bg-white/5 shrink-0">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col animate-fadeIn h-full mt-2 relative">
          {/* Pay Block */}
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-5 flex flex-col relative z-20 focus-within:border-[#089981]/50 transition-colors">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">You Pay</span>
            <div className="flex justify-between items-center">
              <input 
                type="text" 
                inputMode="decimal"
                value={swapAmount} 
                onChange={(e) => setSwapAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                placeholder="0" 
                className="bg-transparent text-4xl font-sans font-bold text-white outline-none w-1/2 placeholder:text-zinc-600" 
              />
              <div className="relative">
                <button onClick={() => { setShowPayDropdown(!showPayDropdown); setShowReceiveDropdown(false); }} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-2xl transition-colors border border-white/5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] bg-gradient-to-br ${getAssetColor(activePayAsset?.symbol)} border border-current shrink-0`}>
                    {activePayAsset?.symbol.charAt(0)}
                  </div>
                  <span className="font-bold text-white text-sm">{activePayAsset?.symbol}</span>
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showPayDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl">
                    {portfolio.map(asset => (
                      <button key={asset.symbol} onClick={() => { setSwapPayAsset(asset.symbol); setShowPayDropdown(false); }} className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                        <span className="font-bold text-sm text-white">{asset.symbol}</span>
                        <span className="ml-auto text-[10px] text-zinc-500 font-mono">{formatBalance(asset.balance)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Bal: {formatBalance(activePayAsset?.balance)} {activePayAsset?.symbol}</div>
          </div>

          {/* Swap Flip Button */}
          <div className="flex justify-center -my-3 relative z-30">
            <button onClick={flipSwap} className="w-10 h-10 bg-[#1A1A1A] border-4 border-[#050505] rounded-xl flex items-center justify-center text-white hover:text-[#089981] hover:scale-110 transition-all shadow-lg">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>
          </div>

          {/* Receive Block */}
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-5 flex flex-col relative z-10">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">You Receive</span>
            <div className="flex justify-between items-center">
              <input type="text" value={swapAmount ? formatNumber((parseFloat(swapAmount.replace(/,/g, '')) * 1.5).toFixed(2)) : ''} placeholder="0" readOnly className="bg-transparent text-4xl font-sans font-bold text-white outline-none w-1/2 placeholder:text-zinc-600" />
              <div className="relative">
                <button onClick={() => { setShowReceiveDropdown(!showReceiveDropdown); setShowPayDropdown(false); }} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-2xl transition-colors border border-white/5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] bg-gradient-to-br ${getAssetColor(activeReceiveAsset?.symbol)} border border-current shrink-0`}>
                    {activeReceiveAsset?.symbol.charAt(0)}
                  </div>
                  <span className="font-bold text-white text-sm">{activeReceiveAsset?.symbol}</span>
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showReceiveDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl">
                    {portfolio.map(asset => (
                      <button key={asset.symbol} onClick={() => { setSwapReceiveAsset(asset.symbol); setShowReceiveDropdown(false); }} className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                        <span className="font-bold text-sm text-white">{asset.symbol}</span>
                        <span className="ml-auto text-[10px] text-zinc-500 font-mono">{formatBalance(asset.balance)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 mb-8 px-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rate</span>
            <span className="text-xs font-bold text-white">1 {activePayAsset?.symbol} = 1.50 {activeReceiveAsset?.symbol}</span>
          </div>

          <button onClick={handleExecuteSwap} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-auto ${swapAmount && swapAmount !== '0' ? 'bg-[#00FF66] text-black hover:bg-[#00cc52] shadow-[0_0_20px_rgba(0,255,102,0.3)]' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}>
            Confirm Swap
          </button>
        </div>

      </div>
    </div>
  );
}