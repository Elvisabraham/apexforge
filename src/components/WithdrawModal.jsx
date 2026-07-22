import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

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
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef(null);

  const activeWithdrawMethodConfig = withdrawMethods.find(m => m.id === withdrawMethod);
  const activeWithdrawFiatConfig = withdrawFiatProviders.find(p => p.id === selectedWithdrawFiatProvider);
  const solBalance = portfolio.find(a => a.symbol === 'SOL')?.balance || 0;

  // 🚀 Start / Stop Camera Scanner
  const startScanner = async () => {
    setCameraError('');
    setIsScanning(true);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  // 🚀 Camera Hook
  useEffect(() => {
    let html5QrcodeInstance = null;

    if (isScanning && isOpen && withdrawStep === 2) {
      const timer = setTimeout(() => {
        html5QrcodeInstance = new Html5Qrcode("qr-reader-withdraw");
        scannerRef.current = html5QrcodeInstance;

        html5QrcodeInstance.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 }
          },
          (decodedText) => {
            let cleanedAddress = decodedText.trim();
            if (cleanedAddress.startsWith('solana:')) {
              cleanedAddress = cleanedAddress.replace('solana:', '').split('?')[0];
            }
            setWithdrawAddress(cleanedAddress);
            stopScanner();
          },
          (errorMessage) => {
            // Decoding errors are normal while scanning frame by frame
          }
        ).catch((err) => {
          console.error("Camera access error:", err);
          setCameraError("Camera access denied or unavailable.");
        });
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
          html5QrcodeInstance.stop().catch(console.error);
        }
      };
    }
  }, [isScanning, isOpen, withdrawStep]);

  // Handlers to cleanly stop the camera if the user closes the modal or hits the back button
  const handleCloseModal = () => {
    if (isScanning) stopScanner();
    onClose();
  };

  const handleBackStep = () => {
    if (isScanning) stopScanner();
    setWithdrawStep(1);
    setShowWithdrawFiatDropdown(false);
  };

  // 🚀 Hooks must execute before early returns
  if (!isOpen) return null;

  return (
    // 🚀 FIXED: Upgraded to a tap-to-close backdrop that anchors to the bottom on mobile
    <div 
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={handleCloseModal}
    >
      {/* 🚀 FIXED: Bottom-sheet slide-up design for mobile, floating card for desktop */}
      <div 
        className="w-full max-w-[420px] bg-[#050505] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[90vh] overflow-y-auto scrollbar-hide animate-slideUpNative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* iOS-style drag handle for mobile */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden"></div>

        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6 relative">
          {withdrawStep === 2 ? (
            <button 
              onClick={handleBackStep} 
              className="text-zinc-500 hover:text-white transition-all duration-300 p-2 -ml-2 rounded-full hover:bg-white/5 shrink-0"
            >
              <svg className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          ) : <div className="w-9 shrink-0"></div>}

          <h2 className="text-[11px] font-black text-center uppercase tracking-[0.2em] text-zinc-400 truncate px-2">
            {withdrawStep === 2 ? `Withdraw to ${activeWithdrawMethodConfig?.id}` : 'Withdraw'}
          </h2>

          <div className="flex items-center gap-1 shrink-0">
            <button className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300 shrink-0" title="Support">
              <span className="text-base drop-shadow-lg block leading-none">🎧</span>
            </button>
            <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white p-2 rounded-full transition-all duration-300 hover:bg-white/5 shrink-0">
              <svg className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* --- STEP 1: DESTINATION SELECTION --- */}
        {withdrawStep === 1 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] text-center mb-4">Select Destination</p>
            {withdrawMethods.map((method) => (
              <button 
                key={method.id} 
                onClick={() => { setWithdrawMethod(method.id); setWithdrawStep(2); }} 
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-[#121212] border border-white/5 hover:bg-[#1A1A24] hover:border-white/10 transition-all duration-300 text-left shadow-lg group"
              >
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-xl border border-white/5 group-hover:border-[#089981]/50 transition-all duration-300 shadow-inner shrink-0 group-hover:shadow-[0_0_15px_rgba(8,153,129,0.2)]">
                  <span className="text-center drop-shadow-md">{method.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-black text-sm text-zinc-200 group-hover:text-white tracking-wide transition-colors truncate">{method.label}</span>
                  <span className="text-[10px] text-zinc-500 font-semibold tracking-wide mt-1 truncate">{method.sub}</span>
                </div>
                <div className="ml-auto text-zinc-700 group-hover:text-[#089981] transition-colors duration-300 shrink-0 w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP 2: WITHDRAWAL FORM --- */}
        {withdrawStep === 2 && activeWithdrawMethodConfig && (
          <div className="flex flex-col animate-fadeIn h-full">
            {activeWithdrawMethodConfig.type === 'crypto' ? (
              
              /* 🎥 SCANNER OR INPUT VIEW FOR CRYPTO */
              isScanning ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="w-full bg-[#121212] rounded-3xl p-3 border border-white/5 shadow-lg relative overflow-hidden flex flex-col items-center">
                    <div id="qr-reader-withdraw" className="w-full rounded-2xl overflow-hidden"></div>
                    
                    {cameraError && (
                      <p className="text-rose-500 text-xs font-bold my-3 text-center px-2">{cameraError}</p>
                    )}
                  </div>
      
                  <button 
                    onClick={stopScanner}
                    className="mt-6 py-3 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors shadow-sm"
                  >
                    Cancel Camera Scan
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-full bg-[#121212] border border-white/5 shadow-lg rounded-2xl p-4 flex flex-col gap-1 mb-4 focus-within:border-[#089981]/50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destination Address</span>
                      
                      {/* 📷 QR CAMERA SCAN BUTTON */}
                      <button 
                        onClick={startScanner}
                        className="flex items-center gap-1.5 text-[#089981] hover:text-[#00FF66] text-[10px] font-black uppercase tracking-wider bg-[#089981]/10 px-2 py-1.5 rounded-lg border border-[#089981]/20 transition-colors shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h3.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0113.07 4h1.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019.07 7H21a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Scan QR
                      </button>
                    </div>

                    <input 
                      type="text" 
                      value={withdrawAddress} 
                      onChange={(e) => setWithdrawAddress(e.target.value)} 
                      placeholder="Solana Address" 
                      className="bg-transparent text-sm font-mono font-bold text-white outline-none w-full placeholder:text-zinc-700 mt-1" 
                    />
                  </div>
                  <div className="text-center mb-6 mt-4">
                    <div className="flex justify-center items-center gap-2">
                      <input 
                        type="text" 
                        inputMode="decimal"
                        value={withdrawAmount} 
                        onChange={(e) => setWithdrawAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                        placeholder="0" 
                        className="bg-transparent text-5xl font-sans font-black text-white text-center w-full max-w-[200px] outline-none placeholder:text-zinc-800" 
                      />
                      <span className="text-xl font-black text-zinc-500 mt-2">SOL</span>
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Balance: {formatBalance(solBalance)} SOL</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-8">
                    {['25%', '50%', '75%', 'MAX'].map(pct => (
                      <button 
                        key={pct} 
                        onClick={() => handleCryptoPercentage(pct, false)} 
                        className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#089981]/20 hover:border-[#089981]/50 hover:text-[#089981] text-xs font-black text-zinc-400 transition-all shadow-sm"
                      >
                        {pct}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleExecuteWithdraw} 
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg mt-auto ${
                      withdrawAmount && withdrawAmount !== '0' && withdrawAddress.length > 10 
                        ? 'bg-gradient-to-r from-[#089981] to-emerald-500 text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(8,153,129,0.3)]' 
                        : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Confirm Transfer
                  </button>
                </>
              )
            ) : (
              
              /* 🏦 FIAT WITHDRAW FLOW */
              <>
                <div className="relative mb-6 z-50">
                  <button onClick={() => setShowWithdrawFiatDropdown(!showWithdrawFiatDropdown)} className="w-full bg-[#121212] border border-white/5 shadow-lg rounded-2xl p-4 flex items-center justify-between hover:border-[#089981]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center font-bold text-sm shrink-0">{activeWithdrawFiatConfig?.icon}</span>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate">Destination</span>
                        <span className="text-sm font-bold text-white truncate">{activeWithdrawFiatConfig?.label}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center w-6 h-6 ml-2 text-zinc-500">
                      <svg className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </button>
                  {showWithdrawFiatDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                      {withdrawFiatProviders.map(provider => (
                        <button key={provider.id} onClick={() => { setSelectedWithdrawFiatProvider(provider.id); setShowWithdrawFiatDropdown(false); }} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
                          <span className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center text-sm shrink-0">{provider.icon}</span>
                          <span className="font-bold text-sm text-white truncate">{provider.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center mb-6 mt-4">
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-zinc-500 font-black text-xl mt-2">$</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                      placeholder="0" 
                      className="bg-transparent text-5xl font-sans font-black text-white text-center w-full max-w-[200px] outline-none placeholder:text-zinc-800" 
                    />
                  </div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Avail. Balance: {displayNetWorth}</div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[50, 100, 250, 500].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => handleWithdrawQuickAmount(amt)} 
                      className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#089981]/20 hover:border-[#089981]/50 hover:text-[#089981] text-xs font-black text-zinc-400 transition-all shadow-sm"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleExecuteWithdraw} 
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg mt-auto ${
                    withdrawAmount && withdrawAmount !== '0' 
                      ? 'bg-gradient-to-r from-[#089981] to-emerald-500 text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(8,153,129,0.3)]' 
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                  }`}
                >
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