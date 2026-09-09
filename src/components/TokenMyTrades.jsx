import React from 'react';

const DexDollarIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function TokenMyTrades({ currentToken }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center px-4 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
        <DexDollarIcon className="w-5 h-5 text-zinc-500" />
      </div>
      <span className="text-sm font-bold text-zinc-300 mb-1">No Trade History</span>
      <span className="text-xs text-zinc-500">Connect your wallet to view your personal trades and PNL for {currentToken?.symbol || 'this token'}.</span>
    </div>
  );
}