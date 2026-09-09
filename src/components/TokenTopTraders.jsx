import React from 'react';

export default function TokenTopTraders({ currentToken }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center px-4 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
        <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <span className="text-sm font-bold text-zinc-300 mb-1">Whale Tracking</span>
      <span className="text-xs text-zinc-500">Analyzing top wallets and smart money movements for {currentToken?.symbol || 'this token'}...</span>
    </div>
  );
}