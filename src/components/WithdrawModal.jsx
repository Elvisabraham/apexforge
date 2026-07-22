import React from 'react';

export default function WithdrawModal({
  isOpen,
  onClose,
  withdrawStep,
  setWithdrawStep,
  withdrawMethod,
  setWithdrawMethod,
  withdrawAmount,
  setWithdrawAmount,
  withdrawAddress,
  setWithdrawAddress,
  selectedWithdrawFiatProvider,
  setSelectedWithdrawFiatProvider,
  showWithdrawFiatDropdown,
  setShowWithdrawFiatDropdown,
  withdrawMethods,
  withdrawFiatProviders,
  portfolio = [],
  displayNetWorth,
  handleExecuteWithdraw,
  formatNumber,
  formatBalance,
  handleCryptoPercentage,
  handleWithdrawQuickAmount
}) {
  if (!isOpen) return null;

  const activeWithdrawMethodConfig = withdrawMethods.find(m => m.id === withdrawMethod);
  const activeWithdrawFiatConfig = withdrawFiatProviders.find(p => p.id === selectedWithdrawFiatProvider);
  const solBalance = portfolio.find(a => a.symbol === 'SOL')?.balance || 0;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-3xl animate-fadeIn overflow-y-auto">
      <div className="bg-[#050505] border border-white/[0.05] rounded-[2.5rem] w-full max-w-[420px] p-6 sm:p-8 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[95vh] overflow-y-auto scrollbar-hide my-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8 relative">
          {withdrawStep === 2 ? (
            <button 
              onClick={() => { setWithdrawStep(1); setShowWithdrawFiatDropdown(false); }} 
              className="text-zinc-500 hover:text-white transition-all duration-300 p-2 -ml-2 rounded-full hover:bg-white/5 shrink-0"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          ) : <div className="w-9 shrink-0"></div>}

          <h2 className="text-[11px] font-black text-center uppercase tracking-[0.2em] text-zinc-400 truncate px-2">
            {withdrawStep === 2 ? `Withdraw to ${activeWithdrawMethodConfig?.id}` : 'Withdraw'}
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

        {/* --- STEP 1: DESTINATION SELECTION --- */}
        {withdrawStep === 1 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] text-center mb-4">Select Destination</p>
            {withdrawMethods.map((method) => (
              <button key={method.id} onClick={() => { setWithdrawMethod(method.id); setWithdrawStep(2); }} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 text-left shadow-lg group">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-xl border border-white/5 group-hover:border-white/20 transition-all duration-300 shadow-inner shrink-0"><span className="text-center drop-shadow-md">{method.icon}</span></div>
                <div className="flex flex-col min-w-0 flex-1"><span className="font-black text-sm text-zinc-200 group-hover:text-white tracking-wide transition-colors truncate">{method.label}</span><span className="text-[10px] text-zinc-500 font-semibold tracking-wide mt-1 truncate">{method.sub}</span></div>
                <div className="ml-auto text-zinc-700 group-hover:text-white transition-colors duration-300 shrink-0"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" /></svg></div>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP 2: WITHDRAWAL FORM --- */}
        {withdrawStep === 2 && activeWithdrawMethodConfig && (
          <div className="flex flex-col animate-fadeIn h-full">
            {activeWithdrawMethodConfig.type === 'crypto' ? (
              <>
                <div className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col gap-1 mb-4 focus-within:border-[#089981]/50 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destination Address</span>
                  <input type="text" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder="Solana Address" className="bg-transparent text-sm font-mono font-bold text-white outline-none w-full placeholder:text-zinc-700" />
                </div>
                <div className="text-center mb-6 mt-2">
                  <div className="flex justify-center items-center gap-2">
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                      placeholder="0" 
                      className="bg-transparent text-5xl font-sans font-bold text-white text-center w-full max-w-[200px] outline-none placeholder:text-zinc-600" 
                    />
                    <span className="text-xl font-bold text-zinc-500 mt-2">SOL</span>
                  </div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Balance: {formatBalance(solBalance)} SOL</div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {['25%', '50%', '75%', 'MAX'].map(pct => (
                    <button key={pct} onClick={() => handleCryptoPercentage(pct, false)} className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black text-zinc-300 transition-colors">{pct}</button>
                  ))}
                </div>
                <button onClick={handleExecuteWithdraw} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-auto ${withdrawAmount && withdrawAmount !== '0' && withdrawAddress.length > 10 ? 'bg-[#089981] text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(8,153,129,0.3)]' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}>
                  Confirm Transfer
                </button>
              </>
            ) : (
              <>
                <div className="relative mb-6">
                  <button onClick={() => setShowWithdrawFiatDropdown(!showWithdrawFiatDropdown)} className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#089981]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">{activeWithdrawFiatConfig?.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destination</span>
                        <span className="text-sm font-bold text-white">{activeWithdrawFiatConfig?.label}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showWithdrawFiatDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                      {withdrawFiatProviders.map(provider => (
                        <button key={provider.id} onClick={() => { setSelectedWithdrawFiatProvider(provider.id); setShowWithdrawFiatDropdown(false); }} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                          <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-sm shrink-0">{provider.icon}</span>
                          <span className="font-bold text-sm text-white">{provider.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center mb-6">
                  <span className="text-zinc-500 font-bold text-sm">$</span>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={withdrawAmount} 
                    onChange={(e) => setWithdrawAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                    placeholder="0" 
                    className="bg-transparent text-5xl font-sans font-bold text-white text-center w-full outline-none mt-2 placeholder:text-zinc-600" 
                  />
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Avail. Balance: {displayNetWorth}</div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[50, 100, 250, 500].map(amt => (
                    <button key={amt} onClick={() => handleWithdrawQuickAmount(amt)} className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black text-zinc-300 transition-colors">${amt}</button>
                  ))}
                </div>
                <button onClick={handleExecuteWithdraw} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-auto ${withdrawAmount && withdrawAmount !== '0' ? 'bg-[#00FF66] text-black hover:bg-[#00cc52] shadow-[0_0_20px_rgba(0,255,102,0.3)]' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}>
                  Withdraw to {activeWithdrawFiatConfig?.label || 'Bank'}
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}