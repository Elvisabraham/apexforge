import React from 'react';
import { ExternalLink, MessageSquare, Repeat2 } from 'lucide-react';

// Temporary dummy data until you wire up the live Solana websocket
const dummyTrades = [
  { id: 1, type: 'buy', user: '0x7F...9A2b', avatar: '😎', solAmount: '2.5', tokenAmount: '14.2M', time: '12s ago', pnl: '+12.5%' },
  { id: 2, type: 'sell', user: 'Whale_Alert', avatar: '🐳', solAmount: '15.0', tokenAmount: '85.1M', time: '45s ago', pnl: '+45.2%' },
  { id: 3, type: 'buy', user: 'DegenApe', avatar: '🦍', solAmount: '0.5', tokenAmount: '2.8M', time: '1m ago', pnl: '-2.1%' },
  { id: 4, type: 'buy', user: '0x33...11cC', avatar: '🤖', solAmount: '1.2', tokenAmount: '6.5M', time: '3m ago', pnl: '+0.0%' },
  { id: 5, type: 'sell', user: 'PaperHands', avatar: '🧻', solAmount: '0.1', tokenAmount: '500K', time: '5m ago', pnl: '-15.4%' },
];

export default function TokenCallouts({ tokenSymbol = 'TOKEN' }) {
  return (
    <div className="flex flex-col gap-3 pb-4">
      {dummyTrades.map((trade) => (
        <div key={trade.id} className="bg-[#121318] border border-white/5 rounded-xl p-3 flex flex-col shadow-sm">
           
           {/* Header: Avatar, Name, Time, Link */}
           <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-full bg-[#1c1d24] flex items-center justify-center text-sm border border-white/10 shrink-0">
                 {trade.avatar}
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-white flex items-center gap-1.5">
                   {trade.user}
                   <span className="text-[8px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Trader</span>
                 </span>
                 <span className="text-[9px] text-zinc-500 font-mono mt-0.5">{trade.time}</span>
               </div>
             </div>
             <button className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-md">
               <ExternalLink className="w-3 h-3" />
             </button>
           </div>

           {/* Action Body */}
           <div className="flex items-center gap-2 mb-3">
             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
               trade.type === 'buy' ? 'bg-[#00f2a1]/10 text-[#00f2a1] border border-[#00f2a1]/20' : 'bg-[#F23645]/10 text-[#F23645] border border-[#F23645]/20'
             }`}>
               {trade.type === 'buy' ? 'Bought' : 'Sold'}
             </span>
             <span className="text-sm font-mono font-black text-white">{trade.solAmount} SOL</span>
           </div>

           {/* Footer: Position/PnL */}
           <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
             <div className="flex items-center gap-3">
               <button className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors">
                 <MessageSquare className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-bold">Reply</span>
               </button>
               <button className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors">
                 <Repeat2 className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-bold">Copy</span>
               </button>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Position PnL</span>
               <span className={`text-[11px] font-black ${trade.pnl.startsWith('+') ? 'text-[#00f2a1]' : 'text-[#F23645]'}`}>
                 {trade.pnl}
               </span>
             </div>
           </div>
        </div>
      ))}
    </div>
  );
}