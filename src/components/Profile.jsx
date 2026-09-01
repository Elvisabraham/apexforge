import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Profile({ 
  onBack, 
  isOwnProfile = false, 
  userProfile,
  profileUsername = "@ElvisVision", 
  profileAddress = "8xV9pRqwK1z829104n289410492810" 
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [activeTab, setActiveTab] = useState('callouts');
  const [activeModal, setActiveModal] = useState(null); // 'report' | 'block' | 'tip' | 'followers' | 'following'
  const [reportReason, setReportReason] = useState('Scam / Phishing');
  const [tipAmount, setTipAmount] = useState('0.1');
  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic user details from userProfile prop or fallbacks
  const displayUsername = userProfile?.username || userProfile?.handle || profileUsername;
  const displayAddress = connected && publicKey 
    ? publicKey.toBase58() 
    : (userProfile?.address || profileAddress);
  const displayBio = userProfile?.bio || "Building decentralized Web3 tools on Solana. Trench trader & Apex Forge core builder. 🚀";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendTip = async () => {
    if (!connected || !publicKey) {
      showToast('Please connect your Solana wallet to tip!');
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

  const handleReportSubmit = () => {
    showToast(`Reported ${displayUsername} for: ${reportReason}`);
    setActiveModal(null);
  };

  const handleBlockUser = () => {
    showToast(`Blocked ${displayUsername}`);
    setActiveModal(null);
  };

  const mockUsersList = [
    { id: 1, name: 'SolTrader_99', address: '7xK1...mP9q', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SolTrader' },
    { id: 2, name: 'ApexWhale', address: '3mR8...vL4k', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ApexWhale' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col font-sans max-w-4xl mx-auto border-x border-white/5 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#089981] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-white/10 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Profile Header Navigation */}
      <div className="sticky top-0 z-30 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
            ←
          </button>
          <div>
            <h1 className="text-sm font-black tracking-wide uppercase">{displayUsername}</h1>
            <p className="text-[10px] text-zinc-500 font-mono">1.2k Callouts • 4 Tokens Launched</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwnProfile && (
            <>
              <button onClick={() => setActiveModal('report')} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors">🚩</button>
              <button onClick={() => setActiveModal('block')} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors">🚫</button>
            </>
          )}
        </div>
      </div>

      {/* Banner & Avatar */}
      <div className="relative h-44 bg-gradient-to-r from-emerald-900/40 via-zinc-900 to-black border-b border-white/5">
        <div className="absolute -bottom-10 left-6">
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-2xl bg-black border-4 border-[#0A0A0B] shadow-xl"
          />
        </div>
      </div>

      {/* Action Buttons & Bio Section */}
      <div className="px-6 pt-14 pb-6 border-b border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-black">{displayUsername}</h2>
            <p className="text-xs font-mono text-[#089981] mt-0.5">{displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOwnProfile && (
              <>
                <button 
                  onClick={() => setActiveModal('tip')} 
                  className="bg-[#089981]/10 hover:bg-[#089981]/20 text-[#089981] border border-[#089981]/30 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider transition-all"
                >
                  ⚡ Tip SOL
                </button>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)} 
                  className={`text-xs font-black px-5 py-2 rounded-xl uppercase tracking-wider transition-all ${
                    isFollowing 
                      ? 'bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white border border-white/10' 
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-4 max-w-xl">
          {displayBio}
        </p>

        {/* Stats Row */}
        <div className="flex gap-6 text-xs">
          <button onClick={() => setActiveModal('following')} className="hover:underline">
            <span className="font-bold text-white">412</span> <span className="text-zinc-500">Following</span>
          </button>
          <button onClick={() => setActiveModal('followers')} className="hover:underline">
            <span className="font-bold text-white">8.9k</span> <span className="text-zinc-500">Followers</span>
          </button>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-white/5">
        {['callouts', 'activity', 'launches'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-[#089981] text-[#089981]' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Profile Feed Content */}
      <div className="p-6 flex-1">
        {activeTab === 'callouts' && (
          <div className="space-y-4">
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-emerald-400">Bullish Callout</span>
                <span className="text-zinc-500 font-mono">2h ago</span>
              </div>
              <p className="text-xs text-zinc-300">$WEN breaking local resistance. Accumulation pattern looking prime on Solana.</p>
            </div>
          </div>
        )}
        {activeTab === 'activity' && <div className="text-xs text-zinc-500 text-center py-8">No recent trench activity logged.</div>}
        {activeTab === 'launches' && <div className="text-xs text-zinc-500 text-center py-8">4 Launchpad Tokens Minted.</div>}
      </div>

      {/* --- ALL MODALS CONTAINER --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">

            {/* 1. REPORT MODAL */}
            {activeModal === 'report' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest">Report Profile</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-zinc-400 mb-4">Select the primary reason for reporting this profile to the Apex moderation DAO:</p>
                <div className="flex flex-col gap-2 mb-6">
                  {['Scam / Phishing', 'Bot / Automated Spam', 'Impersonation', 'Harassment or Toxic Behavior'].map((reason) => (
                    <label key={reason} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                      <input 
                        type="radio" 
                        name="reportReason" 
                        checked={reportReason === reason} 
                        onChange={() => setReportReason(reason)} 
                        className="accent-[#089981]"
                      />
                      <span className="text-xs font-bold text-zinc-200">{reason}</span>
                    </label>
                  ))}
                </div>
                <button onClick={handleReportSubmit} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all">
                  Submit Report
                </button>
              </>
            )}

            {/* 2. BLOCK MODAL */}
            {activeModal === 'block' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest">Block {displayUsername}?</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">They will no longer be able to message you in chat rooms, view your portfolio activity, or tag you in token callouts.</p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveModal(null)} className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">Cancel</button>
                  <button onClick={handleBlockUser} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Confirm Block</button>
                </div>
              </>
            )}

            {/* 3. TIP MODAL */}
            {activeModal === 'tip' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Tip {displayUsername}</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <p className="text-xs text-zinc-400 mb-4">Support this builder by sending SOL directly to their wallet via micro-tip:</p>
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
                  {['0.05', '0.1', '0.5', '1.0'].map(amt => (
                    <button key={amt} onClick={() => setTipAmount(amt)} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-mono font-bold text-zinc-300">{amt} SOL</button>
                  ))}
                </div>
                <button onClick={handleSendTip} className="w-full bg-[#089981] hover:bg-[#06806b] text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)]">
                  Send {tipAmount} SOL Tip ⚡
                </button>
              </>
            )}

            {/* 4. FOLLOWERS / FOLLOWING LIST MODAL */}
            {(activeModal === 'followers' || activeModal === 'following') && (
              <>
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{activeModal === 'followers' ? 'Followers' : 'Following'}</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 text-zinc-400 hover:text-white">✕</button>
                </div>
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
                  {mockUsersList.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="User" className="w-9 h-9 rounded-full bg-black border border-white/10" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{u.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{u.address}</span>
                        </div>
                      </div>
                      <button onClick={() => showToast(`Following state updated for ${u.name}`)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-colors">
                        Following
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}