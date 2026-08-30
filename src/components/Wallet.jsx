import React, { useState } from 'react';
import WalletProfileHeader from '../components/WalletProfileHeader';

// Safety buffer reserved for tx fees when selling native SOL
const SOL_GAS_RESERVE = 0.05;

export default function ProWalletDashboard({ 
  userProfile = { username: 'ElvisAI', address: '43pU..q2HR' },
  onOpenDeposit,
  onOpenSend,
  onOpenSwap,
  onOpenForge
}) {
  const [copied, setCopied] = useState(false);
  const [priorityFee, setPriorityFee] = useState('Turbo'); // Medium | Turbo | Ultra
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1-Click Sell 50% logic with native SOL gas protection
  const handleSell50 = (asset) => {
    let rawAmount = 0;
    
    if (typeof asset.amount === 'string') {
      const isMillion = asset.amount.includes('M');
      const cleanNum = parseFloat(asset.amount.replace(/[^0-9.]/g, ''));
      rawAmount = isMillion ? cleanNum * 1_000_000 : cleanNum;
    } else {
      rawAmount = Number(asset.amount);
    }

    let sellAmount = 0;

    if (asset.isNative || asset.symbol === 'SOL') {
      const spendableSol = Math.max(0, rawAmount - SOL_GAS_RESERVE);
      sellAmount = spendableSol * 0.5;
    } else {
      sellAmount = rawAmount * 0.5;
    }

    if (onOpenSwap) {
      onOpenSwap({
        asset,
        amountToSell: sellAmount,
        targetToken: 'USDC'
      });
    }
  };

  const assets = [
    { symbol: 'SOL', name: 'Solana', amount: '90.19', value: '13,077.07', change: '+5.2%', pnl: '+$2,140 (24%)', isProfit: true, ca: 'So11111111111111111111111111111111111111112', isNative: true },
    { symbol: 'BHH', name: 'bbjnbj', amount: '170.23M', value: '13,340.00', change: '+12.4%', pnl: '+$4,200 (45%)', isProfit: true, ca: 'BHH78x9a2kLp...99a' },
    { symbol: 'JAKMC', name: 'kdvl', amount: '157.28M', value: '12,325.00', change: '-2.1%', pnl: '-$310 (-2.4%)', isProfit: false, ca: 'JAK99z1mKq...44b' },
    { symbol: 'YY', name: 'tttrf56', amount: '16.65M', value: '1,305.00', change: '+85.6%', pnl: '+$980 (300%)', isProfit: true, ca: 'YY33xP8mNq...11c' },
    { symbol: 'OBY', name: 'oboyel', amount: '9.25M', value: '725.00', change: '+1.0%', pnl: '+$25 (3.5%)', isProfit: true, ca: 'OBY11aKkL9...77d' },
  ];

  const activities = [
    { type: 'Swap', details: 'SOL → BHH', time: '2m ago', txHash: '5x89a...91a2', fee: '0.00005 SOL' },
    { type: 'Mint', details: 'Forge Token #01', time: '1h ago', txHash: '3k22p...88z1', fee: '0.00120 SOL' },
    { type: 'Send', details: '10.0 SOL to 8x2...9a', time: '3h ago', txHash: '9m44q...11x7', fee: '0.00005 SOL' },
    { type: 'Swap', details: 'JAKMC → SOL', time: '1d ago', txHash: '1z77a...33k4', fee: '0.00008 SOL' },
  ];

  const createdTokens = [
    { symbol: 'WEN', name: 'Wen Token', supply: '1,000,000,000', mcap: '45K', bonding: '84%' },
    { symbol: 'APEX', name: 'Apex Forge', supply: '10,000,000', mcap: '120K', bonding: '100%' },
  ];

  const filteredAssets = assets.filter(a => 
    a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:h-screen lg:max-h-screen bg-[#040405] text-white p-3 lg:p-4 font-sans selection:bg-[#089981] selection:text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden [font-variant-numeric:normal]">
      <div className="max-w-[1650px] w-full mx-auto flex flex-col gap-3 h-full min-h-0">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between bg-[#090A0D] border border-white/10 rounded-xl px-4 py-2 gap-3 shrink-0">
          
          <WalletProfileHeader />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111318] border border-white/10 p-1 rounded-lg text-[10px]">
              <span className="text-zinc-400 font-bold px-1.5 uppercase tracking-wider text-[9px]">⚡ Fee:</span>
              {['Medium', 'Turbo', 'Ultra'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPriorityFee(mode)}
                  className={`px-2 py-0.5 rounded font-bold font-sans transition-all ${
                    priorityFee === mode 
                      ? 'bg-[#089981] text-white shadow-[0_0_10px_rgba(8,153,129,0.5)]' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-[#089981]/10 px-2.5 py-1.5 rounded-lg border border-[#089981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Solana Devnet
            </span>

          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch flex-1 min-h-0">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-2.5 justify-between shrink-0">
            
            {/* Portfolio Value Card */}
            <div className="p-4 bg-[#090A0D] border border-white/10 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Net Portfolio Value</span>
                  <span className="text-[9px] font-sans font-semibold tabular-nums text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">LIVE</span>
                </div>
                
                <div className="text-2xl font-bold text-white tracking-tight mt-1 font-sans tabular-nums">
                  <span className="text-zinc-400">$</span>45,702.07
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#089981] font-sans tabular-nums">
                    +$450.00
                  </span>
                  <span className="text-[10px] font-black text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded border border-[#089981]/20 font-sans tabular-nums">
                    +2.4% 24H
                  </span>
                </div>
              </div>

              {/* Gas Balance */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border border-white/5 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
                  <span className="text-[10px] font-black uppercase text-zinc-400">Gas SOL:</span>
                  <span className="font-sans tabular-nums font-bold text-white">90.19</span>
                </div>
                <span className="font-sans tabular-nums text-emerald-400 text-[11px] font-bold">
                  <span className="text-zinc-400">$</span>13,077.07
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={onOpenDeposit} className="py-2 bg-[#121419] hover:bg-[#089981]/20 border border-white/10 hover:border-[#089981] rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-200 transition-all">↓ Deposit</button>
                <button onClick={onOpenSend} className="py-2 bg-[#121419] hover:bg-[#089981]/20 border border-white/10 hover:border-[#089981] rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-200 transition-all">↑ Send</button>
                <button onClick={onOpenSwap} className="py-2 bg-[#121419] hover:bg-[#089981]/20 border border-white/10 hover:border-[#089981] rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-200 transition-all">⇄ Swap</button>
              </div>
            </div>

            {/* Terminal & Liquidity */}
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-[#090A0D] border border-white/5 hover:border-white/20 rounded-xl text-left transition-all group">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block">Terminal</span>
                <span className="text-xs font-bold text-white group-hover:text-[#089981]">Explore Market 🔍</span>
              </button>
              <button className="p-3 bg-gradient-to-br from-[#089981]/15 to-transparent border border-[#089981]/30 hover:border-[#089981] rounded-xl text-left transition-all group">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#089981] block">Liquidity</span>
                <span className="text-xs font-bold text-white group-hover:text-emerald-400">Earn Yield 💰</span>
              </button>
            </div>

            {/* Network Health */}
            <div className="p-2.5 bg-[#090A0D] border border-white/5 rounded-xl flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-zinc-400 font-bold uppercase">Devnet Status</span>
              </div>
              <span className="font-sans tabular-nums text-zinc-400">TPS: <strong className="text-white font-bold">2,840</strong></span>
            </div>

          </div>

          {/* RIGHT PANEL: 3 SIDE-BY-SIDE PRO COLUMNS */}
          <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-3 min-h-0 h-full">
            
            {/* COLUMN 1: ASSETS */}
            <div className="bg-[#090A0D] border border-white/10 rounded-2xl p-3 flex flex-col h-full min-h-0">
              <div className="flex flex-col gap-2 border-b border-white/5 pb-2 mb-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Assets</span>
                  <span className="text-[10px] font-sans tabular-nums text-zinc-500 font-semibold">{filteredAssets.length} Holdings</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Filter token or CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-[#089981] font-sans tabular-nums placeholder:text-zinc-600"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-800 min-h-0">
                {filteredAssets.map((asset, i) => (
                  <div key={i} className="p-2.5 bg-[#111318] hover:bg-[#151820] border border-white/5 hover:border-white/20 rounded-xl flex flex-col gap-2 transition-all group shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-sans tabular-nums text-xs font-bold text-emerald-400">
                          {asset.symbol[0]}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white leading-tight">{asset.symbol}</span>
                            <button 
                              onClick={() => handleCopy(asset.ca)}
                              className="text-[9px] text-zinc-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy Contract Address"
                            >
                              📋
                            </button>
                          </div>
                          <span className={`text-[9px] font-sans tabular-nums font-bold ${asset.isProfit ? 'text-[#089981]' : 'text-rose-400'}`}>
                            {asset.pnl}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs font-sans tabular-nums font-bold text-white">{asset.amount}</span>
                        <div className="flex items-center gap-1 text-[9px] font-sans tabular-nums">
                          <span className="text-zinc-400"><span className="text-zinc-500">$</span>{asset.value}</span>
                          <span className={`font-bold ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {asset.change}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden group-hover:flex items-center gap-1 pt-1 border-t border-white/5 text-[9px] font-sans tabular-nums">
                      <button onClick={() => onOpenSwap && onOpenSwap(asset)} className="flex-1 py-0.5 bg-[#089981]/20 hover:bg-[#089981] text-emerald-400 hover:text-white rounded border border-[#089981]/30 text-center transition-all font-bold">
                        Swap
                      </button>
                      <button onClick={() => handleSell50(asset)} className="flex-1 py-0.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded border border-rose-500/20 text-center transition-all font-bold">
                        Sell 50%
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: LIVE ACTIVITY */}
            <div className="bg-[#090A0D] border border-white/10 rounded-2xl p-3 flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-300">Live Activity</span>
                <span className="text-[10px] font-sans tabular-nums text-zinc-500 font-semibold">Solscan Sync</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-800 min-h-0">
                {activities.map((act, i) => (
                  <div key={i} className="p-2.5 bg-[#111318] hover:bg-[#151820] border border-white/5 rounded-xl flex items-center justify-between transition-all shrink-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{act.type}</span>
                      <span className="text-[9px] font-sans tabular-nums text-zinc-400">{act.details}</span>
                      <span className="text-[8px] font-sans tabular-nums text-zinc-600 mt-0.5">Fee: {act.fee}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-zinc-500 font-sans tabular-nums">{act.time}</span>
                      <a 
                        href={`https://solscan.io/tx/${act.txHash}?cluster=devnet`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9px] font-sans tabular-nums text-[#089981] hover:underline flex items-center gap-0.5"
                      >
                        {act.txHash} ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: CREATED TOKENS */}
            <div className="bg-[#090A0D] border border-white/10 rounded-2xl p-3 flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-300">Created Tokens</span>
                <span className="text-[10px] font-sans tabular-nums text-zinc-500 font-semibold">Deployed</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-800 min-h-0">
                {createdTokens.map((token, i) => (
                  <div key={i} className="p-2.5 bg-[#111318] hover:bg-[#151820] border border-white/5 rounded-xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#089981]/20 border border-[#089981]/40 flex items-center justify-center font-sans tabular-nums text-xs font-bold text-[#089981]">
                        🚀
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{token.symbol}</span>
                        <span className="text-[9px] text-zinc-500">{token.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-sans tabular-nums font-bold text-emerald-400">
                        <span className="text-zinc-400">$</span>{token.mcap}
                      </span>
                      <span className="text-[8px] font-sans tabular-nums text-zinc-400">Curve: {token.bonding}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA Widget */}
              <div className="p-3 bg-gradient-to-tr from-[#089981]/20 to-transparent border border-[#089981]/30 rounded-xl flex flex-col gap-1 mt-2 shrink-0">
                <span className="text-[10px] font-black uppercase text-[#089981] tracking-wider">Deploy New Token</span>
                <p className="text-[9px] text-zinc-400">Launch a token straight to Raydium/Devnet in 1-click.</p>
                <button 
                  onClick={onOpenForge}
                  className="mt-1 w-full py-1.5 bg-[#089981] hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-colors shadow-[0_0_10px_rgba(8,153,129,0.3)]"
                >
                  + Forge Token Now
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}