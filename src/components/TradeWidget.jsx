import React from 'react';

// The REAL Official Solana Logo with proper colors
function SolIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 393.3 313.1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="solana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFA3" />
          <stop offset="100%" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solana-grad)"/>
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-grad)"/>
      <path d="M328.7 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H2.1c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-grad)"/>
    </svg>
  );
}

export default function TradeWidget({
  displayToken,
  tradeMode,
  setTradeMode,
  tradeAmount,
  setTradeAmount,
  userBalanceSol,
  userTokenBalance,
  handleExecuteTrade,
  isProcessing,
  curveState
}) {
  // 🚀 EXACT APEX FORGE BONDING CURVE ENGINE
  const cleanNumericAmount = parseFloat(tradeAmount.toString().replace(/,/g, '')) || 0;
  const currentVSol = 30 + (curveState?.solInCurve || 0);
  const currentVTokens = (30 * 1000000000) / currentVSol;

  let estOutputText = '0.00';
  let estPriceImpact = '0.00';

  if (cleanNumericAmount > 0) {
    if (tradeMode === 'buy') {
      const netSol = cleanNumericAmount * 0.99;
      const newVSol = currentVSol + netSol;
      const newVTokens = (30 * 1000000000) / newVSol;
      const tokensOut = currentVTokens - newVTokens;
      
      estOutputText = `${(tokensOut / 1000000).toFixed(2)}M ${displayToken?.symbol || 'TKN'}`;
      estPriceImpact = ((netSol / newVSol) * 100).toFixed(2);
    } else {
      const tokensIn = cleanNumericAmount;
      const newVTokens = currentVTokens + tokensIn;
      const newVSol = (currentVSol * currentVTokens) / newVTokens;
      const solOut = (currentVSol - newVSol) * 0.99;

      estOutputText = `${solOut.toFixed(4)} SOL`;
      estPriceImpact = ((tokensIn / newVTokens) * 100).toFixed(2);
    }
  }

  // 🚀 FIX: Streamlined Pro-level MAX calculation
  const handleMaxClick = () => {
    if (tradeMode === 'buy') {
      // BUY SIDE: Reserve 0.005 SOL for transaction gas fees
      const maxSol = Math.max(0, (userBalanceSol || 0) - 0.005).toFixed(4);
      setTradeAmount(maxSol.toString());
    } else {
      // SELL SIDE: Directly use the perfect live balance fed down from the parent component
      setTradeAmount(userTokenBalance ? userTokenBalance.toString() : "0");
    }
  };

  const handleHalfClick = () => {
    if (tradeMode === 'buy') {
      const halfSol = Math.max(0, ((userBalanceSol || 0) / 2)).toFixed(4);
      setTradeAmount(halfSol);
    } else {
      setTradeAmount(Math.floor((userTokenBalance || 0) / 2).toString());
    }
  };

  const onSubmitClick = async () => {
    if (!handleExecuteTrade) {
      console.log('Backend not connected yet for trade submission.');
      return;
    }
    const success = await handleExecuteTrade();
    if (success) {
      setTradeAmount('');
    }
  };

  return (
    <div className="w-full">
      {/* BUY / SELL TOGGLE */}
      <div className="flex bg-[#0A0A0A] rounded-xl p-1 mb-4 border border-white/5 shadow-inner">
        <button
          onClick={() => { setTradeMode('buy'); setTradeAmount(''); }}
          className={`flex-1 py-3 text-sm font-black tracking-widest rounded-lg transition-all ${
            tradeMode === 'buy' ? 'bg-[#089981] text-white shadow-md' : 'text-zinc-500 hover:text-white'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => { setTradeMode('sell'); setTradeAmount(''); }}
          className={`flex-1 py-3 text-sm font-black tracking-widest rounded-lg transition-all ${
            tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow-md' : 'text-zinc-500 hover:text-white'
          }`}
        >
          SELL
        </button>
      </div>

      {/* INPUT AREA */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5 shrink-0">
            {tradeMode === 'buy' ? (
              <SolIcon className="w-4 h-4 shrink-0" />
            ) : (
            <div className="relative w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
  <span className="absolute text-[9px] font-bold text-zinc-400 uppercase">
    {(displayToken?.symbol || 'T').charAt(0)}
  </span>
  <img 
    src={displayToken?.image_url || displayToken?.imagePreview || displayToken?.image || displayToken?.imageUrl || displayToken?.logoURI || ''} 
    alt={displayToken?.symbol} 
    className="absolute inset-0 w-full h-full object-cover z-10" 
    onError={(e) => { e.currentTarget.style.display = 'none'; }}
  />
</div>
            )}
            <span className="text-xs font-bold text-white uppercase">
              {tradeMode === 'buy' ? 'SOL' : displayToken?.symbol || 'TKN'}
            </span>
          </div>

          <input
          type="text"
          inputMode="decimal"
          value={
            tradeAmount
              ? (() => {
                  // 1. Strip existing commas to get the raw string
                  const cleanString = tradeAmount.toString().replace(/,/g, '');
                  // 2. Split by the decimal point
                  const parts = cleanString.split('.');
                  // 3. Add commas ONLY to the whole number side
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  // 4. Rejoin them (this protects your trailing dot and zeros!)
                  return parts.join('.');
                })()
              : ''
          }
          onChange={(e) => {
            const rawVal = e.target.value.replace(/,/g, '');
            // 🚀 Regex ensures only valid numbers and a single decimal point can pass
            if (rawVal === '' || /^\d*\.?\d*$/.test(rawVal)) {
              setTradeAmount(rawVal);
            }
          }}
          placeholder="0.00"
            className="bg-transparent text-right text-3xl font-black text-white outline-none w-[60%] placeholder:text-zinc-700 font-mono"
          />
        </div>
        
        {/* BALANCE & HALF/MAX CONTROLS */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Balance: {tradeMode === 'buy' ? `${(userBalanceSol || 0).toFixed(4)} SOL` : `${((userTokenBalance || 0) / 1000000).toLocaleString()}M ${displayToken?.symbol || 'TKN'}`}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleHalfClick}
              className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors"
            >
              Half
            </button>
            <button 
              onClick={handleMaxClick}
              className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* ESTIMATES OUT */}
      <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] border border-white/5 rounded-xl mb-6 shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">You Receive (Est.)</span>
          <span className={`text-sm font-black ${displayToken?.isGraduated ? 'text-amber-500' : (tradeMode === 'buy' ? 'text-[#089981]' : 'text-[#F23645]')}`}>
            {estOutputText}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Impact</span>
          <span className="text-[10px] font-black text-zinc-300">
            ~{estPriceImpact}%
          </span>
        </div>
      </div>

    {/* SUBMIT BUTTON */}
      {(userBalanceSol || 0) < 0.005 && tradeMode === 'buy' ? (
        <button
          type="button"
          onClick={() => console.log('Add SOL clicked')}
          className="w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest bg-[#089981] hover:bg-[#067a67] text-white transition-all shadow-md"
        >
          Add SOL for fees
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmitClick}
          disabled={!cleanNumericAmount || cleanNumericAmount <= 0 || isProcessing}
          className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
            displayToken?.isGraduated 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black' 
              : (tradeMode === 'buy' ? 'bg-[#089981] hover:bg-[#067a67] text-white' : 'bg-[#F23645] hover:bg-[#c92a38] text-white')
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? 'Confirming in Wallet... ⏳' : `Confirm ${tradeMode} ⚡`}
        </button>
      )}
    </div>
  );
} 