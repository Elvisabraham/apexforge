import React from 'react';
import { TokenCard } from './TokenCard';

export default function LaunchesView({ newTokens = [], migratingTokens = [], migratedTokens = [] }) {
  return (
    <div className="w-full h-full p-0 m-0 bg-[#0c0d10] flex flex-col overflow-hidden">
      
      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full h-full flex-1 min-h-0 px-2 pb-2 pt-0">
        
        {/* COLUMN 1: NEW */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">New</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {newTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!newTokens || newTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No new tokens</div>
            ) : (
              newTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="new" />)
            )}
          </div>
        </div>

        {/* COLUMN 2: MIGRATING */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">Migrating</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {migratingTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!migratingTokens || migratingTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No tokens migrating</div>
            ) : (
              migratingTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="migrating" />)
            )}
          </div>
        </div>

        {/* COLUMN 3: MIGRATED */}
        <div className="bg-[#121318] border-x border-b border-zinc-800/40 rounded-b-xl rounded-t-none border-t-0 p-2.5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-white tracking-wide">Migrated</span>
              <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {migratedTokens?.length || 0}
              </span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors text-xs font-bold px-1">•••</button>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-0.5">
            {(!migratedTokens || migratedTokens.length === 0) ? (
              <div className="flex items-center justify-center h-40 text-xs text-zinc-500 font-medium">No migrated tokens</div>
            ) : (
              migratedTokens.map(t => <TokenCard key={t.id || t.mintAddress || Math.random()} token={t} columnType="migrated" />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}