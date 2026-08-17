import React from 'react';

// Reusable Token Card to keep code clean
const TokenCard = ({ token }) => (
  <div className="bg-[#202024] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between cursor-pointer group">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-black border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-purple-500 transition-colors">
        {token.imagePreview ? <img src={token.imagePreview} className="w-full h-full object-cover" alt="icon"/> : token.icon}
      </div>
      <div className="flex flex-col">
        <div className="font-medium text-sm text-gray-200 truncate max-w-[100px]">{token.name}</div>
        <div className="text-xs text-gray-400 uppercase">
          {token.symbol} · {Math.floor(token.progress || 0)}%
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xs text-green-400 font-medium">{token.mcap || '$10K'} MC</div>
      <div className={`text-[10px] ${token.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {token.isPositive ? '▲' : '▼'} {token.change}
      </div>
    </div>
  </div>
);

export default function LaunchesView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      
      {/* New Tokens Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2 shrink-0">
          <span className="font-semibold text-gray-200">New</span>
          <span className="text-xs text-gray-500">{newTokens.length}</span>
        </div>
        <div className="space-y-3 overflow-y-auto scrollbar-hide flex-1">
          {newTokens.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No new tokens yet.</p>
          ) : (
            newTokens.map(t => <TokenCard key={t.id || t.mintAddress} token={t} />)
          )}
        </div>
      </div>

      {/* Migrating Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2 shrink-0">
          <span className="font-semibold text-gray-200">Migrating</span>
          <span className="text-xs text-gray-500">{migratingTokens.length}</span>
        </div>
        <div className="space-y-3 overflow-y-auto scrollbar-hide flex-1">
          {migratingTokens.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No tokens migrating.</p>
          ) : (
            migratingTokens.map(t => <TokenCard key={t.id || t.mintAddress} token={t} />)
          )}
        </div>
      </div>

      {/* Migrated Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2 shrink-0">
          <span className="font-semibold text-gray-200">Migrated</span>
          <span className="text-xs text-gray-500">{migratedTokens.length}</span>
        </div>
        <div className="space-y-3 overflow-y-auto scrollbar-hide flex-1">
          {migratedTokens.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No graduated tokens.</p>
          ) : (
            migratedTokens.map(t => <TokenCard key={t.id || t.mintAddress} token={t} />)
          )}
        </div>
      </div>

    </div>
  );
}