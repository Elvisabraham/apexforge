import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function SendModal({
  isOpen,
  onClose,
  sendAddress,
  setSendAddress,
  sendAmount,
  setSendAmount,
  portfolio = [],
  handleExecuteSend,
  formatNumber,
  formatBalance,
  handleCryptoPercentage
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef(null);

  if (!isOpen) return null;

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

  useEffect(() => {
    let html5QrcodeInstance = null;

    if (isScanning) {
      // Small timeout to ensure the DOM element #reader is rendered
      const timer = setTimeout(() => {
        html5QrcodeInstance = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrcodeInstance;

        html5QrcodeInstance.start(
          { facingMode: "environment" }, // Rear camera
          {
            fps: 10,
            qrbox: { width: 220, height: 220 }
          },
          (decodedText) => {
            // Clean scanned address (handles 'solana:' URI scheme if scanned from crypto QR)
            let cleanedAddress = decodedText.trim();
            if (cleanedAddress.startsWith('solana:')) {
              cleanedAddress = cleanedAddress.replace('solana:', '').split('?')[0];
            }
            setSendAddress(cleanedAddress);
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
  }, [isScanning]);

  const handleClose = () => {
    if (isScanning) stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-3xl animate-fadeIn overflow-y-auto">
      <div className="bg-[#050505] border border-white/[0.05] rounded-[2.5rem] w-full max-w-[420px] p-6 sm:p-8 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[95vh] overflow-y-auto scrollbar-hide my-auto">
        
        {/* --- MODAL HEADER --- */}
        <div className="flex justify-between items-center mb-6 relative">
          <div className="w-9 shrink-0"></div>

          <h2 className="text-[11px] font-black text-center uppercase tracking-[0.2em] text-zinc-400 truncate px-2">
            Send SOL
          </h2>

          <div className="flex items-center gap-1 shrink-0">
            <button className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all shrink-0" title="Support">
              <span className="text-base drop-shadow-lg block leading-none">🎧</span>
            </button>
            <button onClick={handleClose} className="text-zinc-500 hover:text-white p-2 rounded-full transition-all hover:bg-white/5 shrink-0">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* --- 🎥 CAMERA SCANNER OVERLAY VIEW --- */}
        {isScanning ? (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="w-full bg-[#111] rounded-3xl p-3 border border-white/10 relative overflow-hidden flex flex-col items-center">
              <div id="qr-reader" className="w-full rounded-2xl overflow-hidden"></div>
              
              {cameraError && (
                <p className="text-rose-500 text-xs font-bold my-3 text-center px-2">{cameraError}</p>
              )}
            </div>

            <button 
              onClick={stopScanner}
              className="mt-4 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors"
            >
              Cancel Camera Scan
            </button>
          </div>
        ) : (
          /* --- 💸 STANDARD SEND FORM --- */
          <div className="flex flex-col animate-fadeIn h-full">
            
            {/* Recipient Address Input Block with Camera Trigger */}
            <div className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col gap-1 mb-4 focus-within:border-[#089981]/50 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">To Address</span>
                
                {/* 📷 QR CAMERA SCAN BUTTON */}
                <button 
                  onClick={startScanner}
                  className="flex items-center gap-1.5 text-[#089981] hover:text-emerald-400 text-[10px] font-black uppercase tracking-wider bg-[#089981]/10 px-2 py-1 rounded-lg transition-colors"
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
                value={sendAddress} 
                onChange={(e) => setSendAddress(e.target.value)} 
                placeholder="Solana Address" 
                className="bg-transparent text-sm font-mono font-bold text-white outline-none w-full placeholder:text-zinc-700" 
              />
            </div>

            {/* Amount Display with Mobile-friendly Typing */}
            <div className="text-center mb-6 mt-2">
              <div className="flex justify-center items-center gap-2">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={sendAmount} 
                  onChange={(e) => setSendAmount(formatNumber(e.target.value.replace(/[^0-9.]/g, '')))}
                  placeholder="0" 
                  className="bg-transparent text-5xl font-sans font-bold text-white text-center w-full max-w-[200px] outline-none placeholder:text-zinc-600" 
                />
                <span className="text-xl font-bold text-zinc-500 mt-2">SOL</span>
              </div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">
                Balance: {formatBalance(solBalance)} SOL
              </div>
            </div>

            {/* Quick Percentage Presets */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {['25%', '50%', '75%', 'MAX'].map(pct => (
                <button 
                  key={pct} 
                  onClick={() => handleCryptoPercentage(pct, true)} 
                  className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-black text-zinc-300 transition-colors"
                >
                  {pct}
                </button>
              ))}
            </div>

            {/* Execute Button */}
            <button 
              onClick={handleExecuteSend} 
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-auto ${
                sendAmount && sendAmount !== '0' && sendAddress.length > 10 
                  ? 'bg-[#089981] text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(8,153,129,0.3)]' 
                  : 'bg-white/10 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Confirm Send
            </button>
          </div>
        )}

      </div>
    </div>
  );
}