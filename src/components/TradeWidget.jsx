import React from 'react';

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
      estPriceImpact = ((netSol / currentVSol) * 100).toFixed(2);
    } else {
      // Raw token input mapping
      const tokensIn = cleanNumericAmount;
      const newVTokens = currentVTokens + tokensIn;
      const newVSol = (currentVSol * currentVTokens) / newVTokens;
      const solOut = (currentVSol - newVSol) * 0.99;

      estOutputText = `${solOut.toFixed(4)} SOL`;
      estPriceImpact = ((tokensIn / currentVTokens) * 100).toFixed(2);
    }
  }

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
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
            {/* Fallback avatar if no image exists */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-[8px]">
               {tradeMode === 'buy' ? '◎' : '🚀'}
            </div>
            <span className="text-xs font-bold text-white uppercase">
              {tradeMode === 'buy' ? 'SOL' : displayToken?.symbol || 'TKN'}
            </span>
          </div>
          <input
            type="number"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent text-right text-3xl font-black text-white outline-none w-[60%] placeholder:text-zinc-700"
          />
        </div>
        
        {/* BALANCE & HALF/MAX CONTROLS */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Balance: {tradeMode === 'buy' ? `${(userBalanceSol || 0).toFixed(2)} SOL` : `${((userTokenBalance || 0) / 1000000).toFixed(2)}M ${displayToken?.symbol || 'TKN'}`}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setTradeAmount(tradeMode === 'buy' ? ((userBalanceSol || 0) * 0.5).toFixed(2) : Math.floor((userTokenBalance || 0) * 0.5))} 
              className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1 rounded-md transition-colors"
            >
              Half
            </button>
            <button 
              onClick={() => setTradeAmount(tradeMode === 'buy' ? (userBalanceSol || 0).toFixed(2) : Math.floor(userTokenBalance || 0))} 
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
      <button
        onClick={handleExecuteTrade}
        disabled={!cleanNumericAmount || cleanNumericAmount <= 0 || isProcessing}
        className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
          displayToken?.isGraduated 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black' 
            : (tradeMode === 'buy' ? 'bg-[#089981] hover:bg-[#067a67] text-white' : 'bg-[#F23645] hover:bg-[#c92a38] text-white')
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? 'Confirming in Wallet... ⏳' : `Confirm ${tradeMode} ⚡`}
      </button>
    </div>
  );
}