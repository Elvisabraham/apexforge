import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Profile({ 
  onBack, 
  isOwnProfile = false, 
  userProfile,
  profileUsername = "@ElvisAi", 
  profileAddress = "43pU...q2HR",
  onOpenSettings
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [activeTab, setActiveTab] = useState('callouts');
  const [activeModal, setActiveModal] = useState(null);
  const [quickSolAmount, setQuickSolAmount] = useState('0.5');
  const [toastMessage, setToastMessage] = useState(null);

  // Simulated real-time streaming transactions (making the screen feel live & busy)
  const [liveStream, setLiveStream] = useState([
    { id: 1, type: 'BUY', symbol: '$WEN', sol: '12.4', price: '$0.000142', wallet: '7xK...9q', time: 'Just now' },
    { id: 2, type: 'BUY', symbol: '$APEX', sol: '5.0', price: '$0.089000', wallet: '3mR...4k', time: '2s ago' },
    { id: 3, type: 'SELL', symbol: '$BONK', sol: '42.1', price: '$0.000028', wallet: '9vL...1p', time: '5s ago' },
    { id: 4, type: 'BUY', symbol: '$WIF', sol: '8.2', price: '$2.410000', wallet: '43p...HR', time: '8s ago' },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayUsername = userProfile?.username || userProfile?.handle || profileUsername;
  const displayAddress = connected && publicKey ? publicKey.toBase58() : (userProfile?.address || profileAddress);

  // Dense Callout Cards with Direct Quick-Buy Triggers
  const denseCallouts = [
    {
      id: 1,
      symbol: '$WEN',
      name: 'Wen Coin',
      ca: 'WENw...pump',
      entryMC: '$120K',
      currentMC: '$1.4M',
      multiplier: '11.6x',
      type: 'SNIPE',
      liquidity: '$240K',
      devHolding: '0.8%',
      top10: '14.2%',
      rugScore: '99/100 (SAFE)',
      notes: 'Double-bottom breakout on 1m chart. Top 10 wallet concentration under 15%.',
      time: '2m ago'
    },
    {
      id: 2,
      symbol: '$APEX',
      name: 'Apex Token',
      ca: 'APEX...sol',
      entryMC: '$450K',
      currentMC: '$2.1M',
      multiplier: '4.6x',
      type: 'BREAKOUT',
      liquidity: '$510K',
      devHolding: '0.0%',
      top10: '18.5%',
      rugScore: '95/100 (SAFE)',
      notes: 'Raydium CPMM pool initialized. Smart money inflow spiking.',
      time: '14m ago'
    },
    {
      id: 3,
      symbol: '$SOLAR',
      name: 'Solar AI',
      ca: 'SOL...pump',
      entryMC: '$35K',
      currentMC: '$180K',
      multiplier: '5.1x',
      type: 'EARLY PUMP',
      liquidity: '$65K',
      devHolding: '1.2%',
      top10: '22.0%',
      rugScore: '88/100 (MED)',
      notes: 'High volume momentum. Auto-snipe triggered.',
      time: '42m ago'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col font-mono text-xs selection:bg-[#089981] selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#089981] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg shadow-2xl border border-white/20 animate-pulse">
          ⚡ {toastMessage}
        </div>
      )}

      {/* 1. TOP LIVE TICKER MARQUEE (Busy Terminal Bar) */}
      <div className="bg-[#0C0C0E] border-b border-white/10 px-4 py-1.5 flex items-center justify-between overflow-x-auto whitespace-nowrap text-[10px] gap-6 text-zinc-400">
        <div className="flex items-center gap-6 font-bold">
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"/> SOL/USD $184.20 (+6.4%)</span>
          <span>SOLANA TPS: <strong className="text-white">2,840</strong></span>
          <span>GAS: <strong className="text-emerald-400">0.000005 SOL</strong></span>
          <span>$WEN: <strong className="text-emerald-400">+142% 🔥</strong></span>
          <span>$APEX: <strong className="text-emerald-400">+48% 🚀</strong></span>
          <span>$BONK: <strong className="text-rose-400">-2.1%</strong></span>
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <span>RPC: mainnet-beta (14ms)</span>
          <span className="text-emerald-400">● Live Connection</span>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <div className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-zinc-300 hover:text-white transition-all cursor-pointer">
            ← BACK
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-black text-sm text-white">{displayUsername}</span>
          <span className="bg-[#089981]/20 text-[#089981] text-[9px] font-bold px-2 py-0.5 rounded border border-[#089981]/40">
            PRO TRENCH RADAR
          </span>
        </div>

        {/* Global Quick Buy SOL Bar */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[10px]">PRESET SNIPE:</span>
          {['0.1', '0.5', '1.0', '2.5'].map((amt) => (
            <button
              key={amt}
              onClick={() => setQuickSolAmount(amt)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-all ${
                quickSolAmount === amt 
                  ? 'bg-[#089981] text-white border-[#089981]' 
                  : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30'
              }`}
            >
              {amt} SOL
            </button>
          ))}
          <button onClick={onOpenSettings} className="ml-2 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-zinc-300">
            ⚙️
          </button>
        </div>
      </div>

      {/* 3. DENSE WORKSPACE GRID */}
      <div className="max-w-[1600px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
        
        {/* LEFT & CENTER TERMINAL (8 COLS) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* USER MINI PROFILE & METRIC HUD */}
          <div className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-lg bg-black border border-white/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">{displayUsername}</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">VERIFIED ALPHA</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                    <span>CA: {displayAddress}</span>
                    <button onClick={() => { navigator.clipboard.writeText(displayAddress); showToast('CA Copied'); }} className="text-zinc-400 hover:text-white underline">Copy</button>
                  </p>
                </div>
              </div>

              {/* QUICK STAT METRICS */}
              <div className="grid grid-cols-4 gap-2 text-center bg-black/60 p-2 rounded-lg border border-white/5">
                <div className="px-2">
                  <div className="text-[9px] text-zinc-500">WIN RATE</div>
                  <div className="text-sm font-black text-emerald-400">78.4%</div>
                </div>
                <div className="px-2 border-l border-white/10">
                  <div className="text-[9px] text-zinc-500">AVG MULTI</div>
                  <div className="text-sm font-black text-emerald-400">4.8x</div>
                </div>
                <div className="px-2 border-l border-white/10">
                  <div className="text-[9px] text-zinc-500">REALIZED PNL</div>
                  <div className="text-sm font-black text-white">+142.8 SOL</div>
                </div>
                <div className="px-2 border-l border-white/10">
                  <div className="text-[9px] text-zinc-500">TRENCH SCORE</div>
                  <div className="text-sm font-black text-amber-400">98/100</div>
                </div>
              </div>
            </div>
          </div>

          {/* DENSE TAB CONTROLS */}
          <div className="flex bg-[#101012] border border-white/10 rounded-lg p-1 gap-1">
            {[
              { id: 'callouts', label: '🔥 LIVE CALLOUTS (3)' },
              { id: 'stream', label: '⚡ DEX SWAP STREAM' },
              { id: 'positions', label: '📊 OPEN POSITIONS (2)' },
              { id: 'watchlist', label: '👀 RADAR WATCHLIST' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#089981] text-white shadow' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: DENSE CALLOUTS FEED */}
          {activeTab === 'callouts' && (
            <div className="space-y-2">
              {denseCallouts.map((item) => (
                <div key={item.id} className="p-3 bg-[#101012] border border-white/10 rounded-xl hover:border-[#089981] transition-all space-y-2">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">{item.symbol}</span>
                      <span className="text-zinc-500 text-[10px]">{item.name}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {item.type}
                      </span>
                      <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded">
                        RUGCHECK: {item.rugScore}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        PEAK: {item.multiplier}
                      </span>
                      <span className="text-zinc-500 text-[10px]">{item.time}</span>
                    </div>
                  </div>

                  {/* Micro Stats Grid */}
                  <div className="grid grid-cols-5 gap-2 bg-black/50 p-2 rounded-lg text-[10px] border border-white/5 font-mono">
                    <div><span className="text-zinc-500">Entry MC:</span> <strong className="text-zinc-200">{item.entryMC}</strong></div>
                    <div><span className="text-zinc-500">Current MC:</span> <strong className="text-emerald-400">{item.currentMC}</strong></div>
                    <div><span className="text-zinc-500">Liquidity:</span> <strong className="text-zinc-200">{item.liquidity}</strong></div>
                    <div><span className="text-zinc-500">Dev Hold:</span> <strong className="text-zinc-200">{item.devHolding}</strong></div>
                    <div><span className="text-zinc-500">Top 10:</span> <strong className="text-zinc-200">{item.top10}</strong></div>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-tight">{item.notes}</p>

                  {/* Bottom Action Strip with 1-Click Quick Buy */}
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-zinc-500">CA: {item.ca}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => showToast(`Executing ${quickSolAmount} SOL Snipe on ${item.symbol}...`)}
                        className="bg-[#089981] hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(8,153,129,0.3)]"
                      >
                        ⚡ SNIPE {quickSolAmount} SOL
                      </button>
                      <button onClick={() => showToast(`Chart opened for ${item.symbol}`)} className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded">
                        DEX 📈
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LIVE DEX SWAP STREAM */}
          {activeTab === 'stream' && (
            <div className="bg-[#101012] border border-white/10 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold border-b border-white/10 pb-2">
                <span>ACTION</span>
                <span>TOKEN</span>
                <span>AMOUNT (SOL)</span>
                <span>EXECUTION PRICE</span>
                <span>WALLET</span>
                <span>TIME</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {liveStream.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-2 bg-black/40 border border-white/5 rounded hover:bg-white/5 transition-colors">
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {tx.type}
                    </span>
                    <span className="font-bold text-white">{tx.symbol}</span>
                    <span className="text-zinc-200">{tx.sol} SOL</span>
                    <span className="text-zinc-400">{tx.price}</span>
                    <span className="text-zinc-500">{tx.wallet}</span>
                    <span className="text-zinc-600 text-[10px]">{tx.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OPEN POSITIONS */}
          {activeTab === 'positions' && (
            <div className="bg-[#101012] border border-white/10 rounded-xl p-3">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 text-[9px] uppercase">
                    <th className="pb-2">Token</th>
                    <th className="pb-2">Entry Price</th>
                    <th className="pb-2">Current</th>
                    <th className="pb-2">PnL (%)</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 font-bold text-white">$APEX</td>
                    <td className="py-2.5 text-zinc-400">$0.042</td>
                    <td className="py-2.5 text-zinc-200">$0.098</td>
                    <td className="py-2.5 font-bold text-emerald-400">+133.3%</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => showToast('Position Closed (+133%)')} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold">
                        SELL ALL
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 font-bold text-white">$WIF</td>
                    <td className="py-2.5 text-zinc-400">$2.10</td>
                    <td className="py-2.5 text-zinc-200">$2.45</td>
                    <td className="py-2.5 font-bold text-emerald-400">+16.6%</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => showToast('Position Closed (+16%)')} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold">
                        SELL ALL
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR - DENSE TERMINAL WIDGETS (4 COLS) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 sticky top-14 self-start">
          
          {/* WIDGET 1: PORTFOLIO REAL-TIME SUMMARY */}
          <div className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span className="font-bold uppercase tracking-wider">Trench Balance</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+14.2% 24h</span>
            </div>
            <div>
              <div className="text-2xl font-black text-white">90.19 SOL</div>
              <div className="text-[10px] text-zinc-500 font-mono">~$16,613.00 USD</div>
            </div>
          </div>

          {/* WIDGET 2: SMART MONEY / WHALE FEED */}
          <div className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-zinc-400 uppercase tracking-wider">🐋 Whale Radar</span>
              <span className="text-zinc-500 text-[9px]">Live Alerts</span>
            </div>
            <div className="space-y-2 text-[10px]">
              <div className="p-2 bg-black/50 border border-white/5 rounded">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">Whale Buy 45 SOL</span>
                  <span className="text-zinc-500">1m ago</span>
                </div>
                <div className="text-zinc-400">$WEN • Wallet: 8xV...10</div>
              </div>
              <div className="p-2 bg-black/50 border border-white/5 rounded">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">Whale Buy 120 SOL</span>
                  <span className="text-zinc-500">4m ago</span>
                </div>
                <div className="text-zinc-400">$APEX • Wallet: 3mR...4k</div>
              </div>
            </div>
          </div>

          {/* WIDGET 3: TELEGRAM AUTO COPY-TRADER */}
          <div className="p-3.5 bg-gradient-to-br from-[#101012] to-[#089981]/10 border border-white/10 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">🤖 Auto Copy-Bot</span>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Replicate all callouts instantly with zero-latency MEV protection.
            </p>
            <button 
              onClick={() => showToast('Copy-bot initialized!')}
              className="w-full py-2 bg-[#089981] hover:bg-emerald-500 text-white font-bold rounded text-[11px] transition-all cursor-pointer shadow-lg"
            >
              START AUTO-COPY TRADING
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}