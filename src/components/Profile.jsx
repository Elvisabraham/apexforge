import React, { useState } from 'react';
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

  const [activeTab, setActiveTab] = useState('callouts'); // 'callouts' | 'activity' | 'positions' | 'launches'
  const [activeModal, setActiveModal] = useState(null); 
  const [reportReason, setReportReason] = useState('Scam / Phishing');
  const [tipAmount, setTipAmount] = useState('0.1');
  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const displayUsername = userProfile?.username || userProfile?.handle || profileUsername;
  const displayAddress = connected && publicKey 
    ? publicKey.toBase58() 
    : (userProfile?.address || profileAddress);
  const displayBio = userProfile?.bio || "Algorithmic Trench Trader & Apex Forge Core Developer. High-conviction Solana meme & utility play callouts.";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendTip = async () => {
    if (!connected || !publicKey) {
      showToast('Connect wallet to tip!');
      return;
    }

    try {
      const recipientPubKey = new PublicKey(displayAddress);
      const lamports = parseFloat(tipAmount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      showToast(`Tip sent! Tx: ${signature.slice(0, 8)}...`);
      setActiveModal(null);
    } catch (err) {
      showToast(`Tip failed: ${err.message || 'Transaction rejected'}`);
    }
  };

  // Pro Trader Mock Data
  const proCallouts = [
    {
      id: 1,
      symbol: '$WEN',
      name: 'Wen Coin',
      calledAt: '2h ago',
      entryMC: '$120K',
      peakMC: '$1.4M',
      multiplier: '11.6x',
      type: 'BULLISH SNIPE',
      status: 'PROFIT TAKEN',
      notes: 'Clean double-bottom accumulation on 15m chart. Volume spiking on Raydium.',
      ca: 'WENw...pump'
    },
    {
      id: 2,
      symbol: '$APEX',
      name: 'Apex Token',
      calledAt: '5h ago',
      entryMC: '$450K',
      peakMC: '$2.1M',
      multiplier: '4.6x',
      type: 'BREAKOUT',
      status: 'ACTIVE RUN',
      notes: 'Token launch platform utility. Smart money wallet inflow detected.',
      ca: 'APEX...sol'
    }
  ];

  const proTrades = [
    { id: 1, type: 'BUY', symbol: '$WEN', amount: '15.0 SOL', price: '$0.00014', time: '12 mins ago', hash: '5K9...xPq' },
    { id: 2, type: 'SELL', symbol: '$BONK', amount: '42.5 SOL', price: '$0.000028', time: '1 hour ago', hash: '8mL...2wR' },
    { id: 3, type: 'SWAP', symbol: '$SOL ➔ $USDC', amount: '20.0 SOL', price: '$180.20', time: '3 hours ago', hash: '2vN...9qK' }
  ];

  const openPositions = [
    { symbol: '$APEX', entry: '$0.042', current: '$0.098', pnl: '+133.3%', size: '35 SOL', value: '$6,300' },
    { symbol: '$WIF', entry: '$2.10', current: '$2.45', pnl: '+16.6%', size: '50 SOL', value: '$9,000' }
  ];

  return (
    // FIX: Removed static overflow lock, enabled smooth document-level scrolling
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col font-sans relative overflow-y-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#089981] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-white/20 animate-pulse">
          ⚡ {toastMessage}
        </div>
      )}

      {/* Profile Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer">
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black tracking-wide uppercase">{displayUsername}</h1>
            <span className="bg-[#089981]/20 text-[#089981] text-[10px] font-mono px-2 py-0.5 rounded border border-[#089981]/30 font-bold">
              PRO TRADER
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile ? (
            <button 
              onClick={onOpenSettings}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold text-zinc-200 transition-all cursor-pointer"
            >
              ⚙️ Terminal Settings
            </button>
          ) : (
            <>
              <button onClick={() => setActiveModal('report')} className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer" title="Report">🚩</button>
              <button onClick={() => setActiveModal('block')} className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer" title="Block">🚫</button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / MAIN COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Card Wrapper */}
          <div className="bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header Banner */}
            <div className="relative h-44 bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-black border-b border-white/10">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono font-bold text-emerald-400">
                  🟢 LIVE ON-CHAIN
                </span>
              </div>
              <div className="absolute -bottom-10 left-6">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-2xl bg-black border-4 border-[#0A0A0B] shadow-2xl"
                />
              </div>
            </div>

            {/* Profile Info & Actions */}
            <div className="px-6 pt-14 pb-6 border-b border-white/10">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">{displayUsername}</h2>
                    <span className="text-emerald-400 text-xs">✓ Verified Alpha</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>{displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}</span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(displayAddress); showToast('Address Copied!'); }}
                      className="text-[10px] hover:text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 cursor-pointer"
                    >
                      Copy CA
                    </button>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <button 
                      onClick={onOpenSettings}
                      className="bg-[#089981] hover:bg-emerald-500 text-white text-xs font-black px-5 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)] cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setActiveModal('tip')} 
                        className="bg-[#089981]/15 hover:bg-[#089981]/30 text-[#089981] border border-[#089981]/40 text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                      >
                        ⚡ Tip SOL
                      </button>
                      <button 
                        onClick={() => setIsFollowing(!isFollowing)} 
                        className={`text-xs font-black px-5 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                          isFollowing 
                            ? 'bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white border border-white/10' 
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {isFollowing ? 'Following' : '+ Follow Trader'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-6 max-w-2xl font-medium">
                {displayBio}
              </p>

              {/* Pro Trader Metric Dashboard Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-black/50 border border-white/5 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Win Rate</p>
                  <p className="text-base font-black text-emerald-400">78.4%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Avg Return</p>
                  <p className="text-base font-black text-emerald-400">4.8x</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Realized PnL</p>
                  <p className="text-base font-black text-white">+142.8 SOL</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Trench Score</p>
                  <p className="text-base font-black text-amber-400">98 / 100</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/40">
              {[
                { id: 'callouts', label: '🔥 Callouts' },
                { id: 'positions', label: '📊 Open Positions' },
                { id: 'activity', label: '⚡ DEX Activity' },
                { id: 'launches', label: '🚀 Launched Tokens' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'border-[#089981] text-[#089981] bg-[#089981]/5' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Content Panel */}
            <div className="p-6 bg-black/20">
              
              {/* TAB 1: CALLOUTS */}
              {activeTab === 'callouts' && (
                <div className="space-y-4">
                  {proCallouts.map((c) => (
                    <div key={c.id} className="p-5 bg-[#161619] border border-white/10 rounded-2xl space-y-3 hover:border-[#089981]/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-white">{c.symbol}</span>
                          <span className="text-xs text-zinc-400 font-mono">{c.name}</span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                            {c.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#089981] bg-[#089981]/10 px-2.5 py-1 rounded-lg border border-[#089981]/30">
                            PEAK: {c.multiplier}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{c.calledAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300">{c.notes}</p>

                      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex gap-4">
                          <div><span className="text-zinc-500">Entry MC:</span> <span className="text-zinc-200 font-bold">{c.entryMC}</span></div>
                          <div><span className="text-zinc-500">Peak MC:</span> <span className="text-emerald-400 font-bold">{c.peakMC}</span></div>
                        </div>
                        <button 
                          onClick={() => showToast(`Opening DexScreener for ${c.symbol}...`)}
                          className="text-[11px] font-bold text-[#089981] hover:underline cursor-pointer"
                        >
                          View Chart 📈
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: OPEN POSITIONS */}
              {activeTab === 'positions' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-500 uppercase text-[10px] font-mono">
                        <th className="pb-3">Token</th>
                        <th className="pb-3">Entry</th>
                        <th className="pb-3">Current</th>
                        <th className="pb-3">PnL</th>
                        <th className="pb-3 text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {openPositions.map((pos, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 font-bold text-white">{pos.symbol}</td>
                          <td className="py-3.5 text-zinc-400">{pos.entry}</td>
                          <td className="py-3.5 text-zinc-200">{pos.current}</td>
                          <td className="py-3.5 font-bold text-emerald-400">{pos.pnl}</td>
                          <td className="py-3.5 text-right font-bold text-white">{pos.size} <span className="text-zinc-500 text-[10px]">({pos.value})</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: DEX ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="space-y-3 font-mono">
                  {proTrades.map((t) => (
                    <div key={t.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {t.type}
                        </span>
                        <span className="font-bold text-white">{t.symbol}</span>
                        <span className="text-zinc-500 text-[11px]">{t.amount}</span>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-400">
                        <span>@{t.price}</span>
                        <span className="text-zinc-600 text-[10px]">{t.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: LAUNCHES */}
              {activeTab === 'launches' && (
                <div className="text-xs text-zinc-400 text-center py-10 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                  <p className="font-bold text-white">4 Pump.fun / Apex Tokens Deployed</p>
                  <p className="text-zinc-500 font-mono text-[11px]">Total Volume Generated: 2,490 SOL</p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (4 Cols - Sticky Pro Dashboard) */}
        {/* FIX: Set `sticky top-20` so sidebar stays visible during scrolling */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-20">
          
          {/* Widget 1: Wallet Net Worth */}
          <div className="p-5 rounded-3xl bg-[#121214] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Portfolio Value</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+14.2% 24h</span>
            </div>
            <div>
              <p className="text-3xl font-black text-white">90.19 SOL</p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">~$16,234.20 USD</p>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between text-xs font-mono">
              <span className="text-zinc-500">Active Positions</span>
              <span className="text-zinc-300 font-bold">2 Open</span>
            </div>
          </div>

          {/* Widget 2: Pro Trader Execution Quick Stats */}
          <div className="p-5 rounded-3xl bg-[#121214] border border-white/10 space-y-4 shadow-xl">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Execution Stats</span>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Volume</span>
                <span className="font-bold text-white">$482,910</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Creator Fees</span>
                <span className="font-bold text-[#089981]">3.45 SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Avg Hold Time</span>
                <span className="font-bold text-zinc-200">42 Mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Apex Tier</span>
                <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[10px]">DIAMOND HANDS</span>
              </div>
            </div>
          </div>

          {/* Widget 3: Referral & Copy Trading */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121214] to-emerald-950/40 border border-white/10 space-y-3 shadow-xl">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Copy Trade Bot</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatically replicate {displayUsername}'s on-chain snipes via Apex Telegram Bot.
            </p>
            <button 
              onClick={() => showToast('Telegram Copy-Bot Link Copied!')}
              className="w-full py-2.5 rounded-xl bg-[#089981] hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer"
            >
              Enable Copy-Trading 🤖
            </button>
          </div>

        </div>

      </div>

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">

            {/* TIP MODAL */}
            {activeModal === 'tip' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Tip {displayUsername}</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-zinc-400 mb-4">Send SOL directly to support high-conviction callouts:</p>
                <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-bold text-zinc-400">Amount (SOL)</span>
                  <input 
                    type="number" 
                    value={tipAmount} 
                    onChange={(e) => setTipAmount(e.target.value)} 
                    className="bg-transparent text-right text-2xl font-black text-white w-32 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 mb-6">
                  {['0.1', '0.5', '1.0', '2.5'].map(amt => (
                    <button key={amt} onClick={() => setTipAmount(amt)} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-mono font-bold text-zinc-300 cursor-pointer">{amt} SOL</button>
                  ))}
                </div>
                <button onClick={handleSendTip} className="w-full bg-[#089981] hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)] cursor-pointer">
                  Send {tipAmount} SOL Tip ⚡
                </button>
              </>
            )}

            {/* REPORT / BLOCK MODALS */}
            {(activeModal === 'report' || activeModal === 'block') && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest">{activeModal.toUpperCase()} USER</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-zinc-400 mb-6">Are you sure you want to perform this action against {displayUsername}?</p>
                <button onClick={() => { showToast('Action processed.'); setActiveModal(null); }} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-widest cursor-pointer">
                  Confirm
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}