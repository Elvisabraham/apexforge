import React from 'react';

export default function TokenTrades({ currentToken }) {
  // Deterministic mock trades based on symbol
  const charSum = (currentToken?.symbol || 'TKN').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  const mockTrades = [
    { id: 1, type: 'BUY', sol: '2.5 SOL', token: '45,200', time: '12s ago', wallet: '7xKX...9a2b', pnl: '+12.5%' },
    { id: 2, type: 'SELL', sol: '15.0 SOL', token: '280,100', time: '45s ago', wallet: 'Whale_Alert', pnl: '+45.2%' },
    { id: 3, type: 'BUY', sol: '0.8 SOL', token: '14,500', time: '1m ago', wallet: '3yTR...1m8k', pnl: '-2.1%' },
    { id: 4, type: 'BUY', sol: '5.2 SOL', token: '98,000', time: '2m ago', wallet: 'Sniper_Pro', pnl: '+88.4%' },
    { id: 5, type: 'SELL', sol: '1.2 SOL', token: '21,000', time: '3m ago', wallet: '9zPL...4wQx', pnl: '+5.0%' },
  ];

  return (
    <div className="space-y-2 text-left pb-24">
      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider px-1 mb-1">
        <span>Transaction</span>
        <span>Amount / PnL</span>
      </div>
      
      {mockTrades.map((tx) => (
        <div key={tx.id} className="bg-[#121318] p-3 rounded-xl border border-white/5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-[#00f2a1]/20 text-[#00f2a1]' : 'bg-[#F23645]/20 text-[#F23645]'}`}>
              {tx.type}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tabular-nums">{tx.sol}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{tx.wallet} • {tx.time}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white tabular-nums">{tx.token}</span>
            <span className={`text-[10px] font-black tabular-nums ${tx.pnl.startsWith('+') ? 'text-[#089981]' : 'text-[#F23645]'}`}>
              {tx.pnl}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}