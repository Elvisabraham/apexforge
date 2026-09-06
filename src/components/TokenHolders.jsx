import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

// Dummy data to simulate live on-chain holder distribution
const dummyHolders = [
  { id: 1, address: 'Raydium Authority', avatar: '🏦', percentage: 22.45, value: '$2,442.50', isDex: true },
  { id: 2, address: '0xf971...8aB2', avatar: '👾', percentage: 8.12, value: '$883.45', isDev: true },
  { id: 3, address: '4bUk...9xg2', avatar: '🐋', percentage: 4.50, value: '$489.60', label: 'Top Sniper' },
  { id: 4, address: '7aZk...2qR1', avatar: '😎', percentage: 3.20, value: '$348.16' },
  { id: 5, address: '9cMm...5pL9', avatar: '🤖', percentage: 2.85, value: '$310.08', label: 'Bot' },
  { id: 6, address: '1yTr...8bN4', avatar: '🐱', percentage: 1.50, value: '$163.20' },
  { id: 7, address: '3wQp...7zX1', avatar: '🐶', percentage: 1.15, value: '$125.12' },
];

export default function TokenHolders({ top10Percentage = '50.64%' }) {
  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Holders Summary Header */}
      <div className="bg-[#121318] border border-white/5 rounded-xl p-3 flex justify-between items-center shadow-sm">
         <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Top 10 Holders</span>
            <span className="text-xs font-black text-amber-500 flex items-center gap-1.5 mt-0.5">
               <ShieldAlert className="w-3.5 h-3.5" />
               {top10Percentage}
            </span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Holders</span>
            <span className="text-xs font-black text-white mt-0.5">529</span>
         </div>
      </div>

      {/* Holders List */}
      <div className="flex flex-col gap-2">
        {dummyHolders.map((holder, index) => (
          <div key={holder.id} className="bg-[#121318] border border-white/5 rounded-xl p-3 flex items-center justify-between shadow-sm">
            
            {/* Left: Rank, Avatar, Address */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-zinc-600 w-3 text-center">{index + 1}</span>
              
              <div className="w-8 h-8 rounded-full bg-[#1c1d24] flex items-center justify-center text-sm border border-white/10 shrink-0">
                {holder.avatar}
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{holder.address}</span>
                  {holder.isDev && (
                    <span className="text-[8px] bg-[#00f2a1]/10 text-[#00f2a1] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-[#00f2a1]/20">
                      Dev
                    </span>
                  )}
                  {holder.isDex && (
                    <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-blue-500/20">
                      DEX
                    </span>
                  )}
                </div>
                {holder.label && !holder.isDev && !holder.isDex && (
                  <span className="text-[9px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                    {holder.label === 'Bot' && <Cpu className="w-2.5 h-2.5" />}
                    {holder.label}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Percentage & Value */}
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-white">{holder.percentage.toFixed(2)}%</span>
              <span className="text-[9px] text-zinc-500 font-mono mt-0.5">{holder.value}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}