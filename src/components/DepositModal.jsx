import React from 'react';

export default function DepositModal({
  isOpen,
  onClose,
  depositStep,
  setDepositStep,
  depositMethod,
  setDepositMethod,
  depositAmount,
  setDepositAmount,
  selectedFiatProvider,
  setSelectedFiatProvider,
  showFiatDropdown,
  setShowFiatDropdown,
  depositMethods,
  fiatProviders,
  walletAddress,
  handleCopyAddress,
  copied,
  handleExecuteDeposit,
  formatNumber
}) {
  if (!isOpen) return null;

  const activeMethodConfig = depositMethods.find(m => m.id === depositMethod);
  const activeFiatConfig = fiatProviders.find(p => p.id === selectedFiatProvider);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-3xl animate-fadeIn overflow-y-auto">
      <div className="bg-[#050505] border border-white/[0.05] rounded-[2.5rem] w-full max-w-[420px] p-6 sm:p-8 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[95vh] overflow-y-auto scrollbar-hide my-auto">
        
        {/* --- MODAL HEADER --- */}
        <div className="flex justify-between items-center mb-8 relative">
          {depositStep === 2 ? (
            <button 
              onClick={() => { setDepositStep(1); setShowFiatDropdown(false); }} 
              className="text-zinc-500 hover:text-white transition-all duration-300 p-2 -ml-2 rounded-full hover:bg-white/5 shrink-0"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          ) : <div className="w-9 shrink-0"></div>}

          <h2 className="text-[11px] font-black text-center uppercase tracking-[0.2em] text-zinc-400 truncate px-2">
            {depositStep === 2 ? `Deposit via ${activeMethodConfig?.id}` : 'Deposit'}
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

        {/* --- STEP 1: METHOD SELECTION --- */}
        {depositStep === 1 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] text-center mb-4">Select Source</p>
            {depositMethods.map((method) => (
              <button 
                key={method.id} 
                onClick={() => { setDepositMethod(method.id); setDepositStep(2); }} 
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 text-left shadow-lg group"
              >
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-xl border border-white/5 group-hover:border-white/20 transition-all duration-300 shadow-inner shrink-0">
                  <span className="text-center drop-shadow-md">{method.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-black text-sm text-zinc-200 group-hover:text-white tracking-wide transition-colors truncate">{method.label}</span>
                  <span className="text-[10px] text-zinc-500 font-semibold tracking-wide mt-1 truncate">{method.sub}</span>
                </div>
                <div className="ml-auto text-zinc-700 group-hover:text-white transition-colors duration-300 shrink-0">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP 2: FLOW EXECUTION --- */}
        {depositStep === 2 && activeMethodConfig && (
          <div className="flex flex-col animate-fadeIn h-full mt-2">
            {activeMethodConfig.type === 'crypto' ? (
              <div className="flex flex-col items-center">
                <div className="w-56 h-56 bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-6 border-4 border-[#111]">
                  <div className="w-full h-full bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">QR CODE</div>
                </div>
                <div className="w-full bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-4 shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em]">
                    <span>Network</span>
                    <span className="text-[#089981]">Solana</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">Wallet Address</span>
                      <span className="text-sm font-mono font-bold text-white truncate">{walletAddress}</span>
                    </div>
                    <button onClick={(e) => handleCopyAddress(e)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all shrink-0">
                      {copied ? (
                        <svg className="w-4 h-4 text-[#00FF66] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold mt-4 text-center px-4 leading-relaxed">Only send SOL or SPL tokens to this address. Sending other assets will result in permanent loss.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="relative mb-6">
                  <button onClick={() => setShowFiatDropdown(!showFiatDropdown)} className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#089981]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">{activeFiatConfig?.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Provider</span>
                        <span className="text-sm font-bold text-white">{activeFiatConfig?.label}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showFiatDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                      {fiatProviders.map(provider => (
                        <button key={provider.id} onClick={() => { setSelectedFiatProvider(provider.id); setShowFiatDropdown(false); }} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                          <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-sm shrink-0">{provider.icon}</span>
                          <span className="font-bold text-sm text-white">{provider.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- 🚀 UNLOCKED NATIVE INPUT FOR MOBILE --- */}
                <div className="text-center mb-6">
                  <span className="text-zinc-500 font-bold text-sm">$</span>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                    placeholder="0" 
                    className="bg-transparent text-5xl font-sans font-bold text-white text-center w-full outline-none mt-2 placeholder:text-zinc-600" 
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[50, 100, 250, 500].map(amt => (
                    <button key={amt} onClick={() => setDepositAmount(formatNumber(amt))} className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black text-zinc-300 transition-colors">${amt}</button>
                  ))}
                </div>

                <button onClick={handleExecuteDeposit} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${depositAmount && depositAmount !== '0' ? 'bg-[#00FF66] text-black hover:bg-[#00cc52] shadow-[0_0_20px_rgba(0,255,102,0.3)]' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}>
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}