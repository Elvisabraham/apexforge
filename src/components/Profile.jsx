import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Profile({ 
  onBack, 
  onOpenSettings, 
  userProfile, 
  isOwnProfile = false, 
  isFollowingUser = false,
  onFollowToggle,
  profileUsername = '@degen_forge'
}) {
  const { publicKey, connected } = useWallet();

  // 🚀 PERMANENT IDENTITY & FOLLOW STORAGE SYNC
  const targetUserKey = profileUsername.replace('@', '');
  const followStorageKey = `apex_follow_state_${targetUserKey}`;
  const blockStorageKey = `apex_blocked_users`;

  const [isFollowing, setIsFollowing] = useState(() => {
    const cached = localStorage.getItem(followStorageKey);
    return cached !== null ? JSON.parse(cached) : isFollowingUser;
  });

  const [isBlocked, setIsBlocked] = useState(() => {
    const blockedList = JSON.parse(localStorage.getItem(blockStorageKey) || '[]');
    return blockedList.includes(targetUserKey);
  });

  useEffect(() => {
    localStorage.setItem(followStorageKey, JSON.stringify(isFollowing));
  }, [isFollowing, followStorageKey]);

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (onFollowToggle) onFollowToggle(nextState);
  };

  const displayUsername = profileUsername.startsWith('@') ? profileUsername : `@${profileUsername}`;
  const displayBio = userProfile?.bio || 'Independent Web3 builder & trench sniper. Forging the next wave of decentralized multi-chain liquidities on Solana ⚡';
  const displayAvatar = userProfile?.avatar;

  const displayAddress = connected && publicKey 
    ? publicKey.toBase58() 
    : '8xV9pRqwHGZ1T8ZwbZ6L7V2wXyCqY9n2M4PqZzXvYyW';
    
  const shortAddress = `${displayAddress.slice(0, 4)}...${displayAddress.slice(-4)}`;

  const [activeTab, setActiveTab] = useState('activity'); 
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsMuted, setNotificationsMuted] = useState(false);

  // MODALS STATE
  const [activeModal, setActiveModal] = useState(null); // 'share', 'report', 'block', 'tip', 'followers', 'following'
  const [reportReason, setReportReason] = useState('Scam / Phishing');
  const [tipAmount, setTipAmount] = useState('0.1');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayNetWorth = isOwnProfile ? '$16,530.00' : '$142,400.00';

  const mockForgedAssets = [
    { id: 1, name: 'Apex Forge', symbol: 'FORGE', mcap: '$2.4M', change: '+1,420%', supplyBonded: '100%', status: 'Graduated', isRaydium: true },
    { id: 2, name: 'Trench Runner', symbol: 'RUNNER', mcap: '$45K', change: '-4%', supplyBonded: '42%', status: 'Bonding', isRaydium: false }
  ];

  const [mockActivity, setMockActivity] = useState([
    { 
      id: 1, 
      type: 'bought', 
      tokenName: 'Hunter Biden 2028',
      tokenSymbol: 'HUNTER', 
      amount: '147.87', 
      price: '$0.00001492',
      pnl: '+1.26%',
      isPositive: true,
      time: '1mo', 
      lossText: '$0.32',
      lossPct: '-99.32%',
      currentValue: '$0.00220565',
      iconUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter',
      reactions: { '😄': 3, '🚀': 12 }
    },
    { 
      id: 2, 
      type: 'bought', 
      tokenName: 'Sellategy',
      tokenSymbol: 'SELL', 
      amount: '21.7K', 
      price: '$0.00000199',
      pnl: '+0.58%',
      isPositive: true,
      time: '1mo', 
      lossText: '$3.47',
      lossPct: '-98.77%',
      currentValue: '$0.0432',
      iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Sell',
      reactions: { '🔥': 5, '💎': 8 }
    }
  ]);

  const mockCallouts = [
    { id: 1, tokenName: 'Apex Forge', symbol: 'FORGE', calloutText: 'Massive volume breakout incoming on the 4-hour chart. Don’t fade the trench leader!', time: '2d ago', mcap: '$2.4M' },
    { id: 2, tokenName: 'Trench Runner', symbol: 'RUNNER', calloutText: 'Bonding curve filling up fast. Dev is based and marketing wallet is unlocked.', time: '4d ago', mcap: '$45K' }
  ];

  const mockUsersList = [
    { id: 1, name: '@ApexSniper', address: '7xK2...9pQ1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper' },
    { id: 2, name: '@SolWhale', address: '3fR8...2vL4', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale' },
    { id: 3, name: '@DegenToly', address: '9pQ1...4xK2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toly' }
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    showToast('Wallet Address Copied to Clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = () => {
    const profileLink = `https://apexforge.app/profile/${targetUserKey}`;
    navigator.clipboard.writeText(profileLink);
    showToast(`Profile Link for ${displayUsername} Copied!`);
    setIsMenuOpen(false);
  };

  const handleNotificationToggle = () => {
    setNotificationsMuted(!notificationsMuted);
    showToast(notificationsMuted ? 'Notifications Unmuted 🔔' : 'Notifications Muted 🔕');
  };

  const handleBlockUser = () => {
    const blockedList = JSON.parse(localStorage.getItem(blockStorageKey) || '[]');
    if (!blockedList.includes(targetUserKey)) {
      blockedList.push(targetuserKey);
      localStorage.setItem(blockStorageKey, JSON.stringify(blockedList));
    }
    setIsBlocked(true);
    setActiveModal(null);
    showToast(`Successfully blocked ${displayUsername}`);
  };

  const handleReportSubmit = () => {
    setActiveModal(null);
    showToast(`Report submitted for ${reportReason}. Thank you for keeping the trenches clean.`);
  };

  const handleSendTip = () => {
    setActiveModal(null);
    showToast(`Successfully sent ${tipAmount} SOL tip to ${displayUsername} ⚡`);
  };

  const handleAddReaction = (actId, emoji) => {
    setMockActivity(prev => prev.map(item => {
      if (item.id === actId) {
        const current = item.reactions || {};
        return {
          ...item,
          reactions: { ...current, [emoji]: (current[emoji] || 0) + 1 }
        };
      }
      return item;
    }));
    showToast(`Reacted with ${emoji}!`);
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-[#0A0A0B] text-white p-6 text-center">
        <span className="text-4xl mb-4">🚫</span>
        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300">User Blocked</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">You have blocked {displayUsername}. Their profile and activity are hidden.</p>
        <button onClick={onBack} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden animate-fadeIn relative">
      
      {/* 🚀 WORLD-CLASS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-[#121212]/95 backdrop-blur-2xl border border-[#089981]/40 shadow-[0_10px_40px_rgba(8,153,129,0.2)] px-4 py-2.5 rounded-2xl flex items-center gap-3 animate-slideUpNative">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping"></span>
          <span className="text-xs font-black text-white tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#0A0A0B]/95 backdrop-blur-xl pt-4 pb-3 px-4 border-b border-white/[0.04] flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 rounded-full shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-black text-white leading-tight truncate">{displayUsername}</h1>
            <span className="text-[10px] text-zinc-500 font-bold">{mockForgedAssets.length} tokens forged</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative shrink-0">
          
          {!isOwnProfile && (
            <button 
              onClick={handleNotificationToggle} 
              className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 rounded-full border border-white/5 shadow-sm relative"
            >
              {notificationsMuted ? (
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-[#089981] rounded-full"></span>
                </>
              )}
            </button>
          )}

          {isOwnProfile ? (
            <>
              <button onClick={onOpenSettings} className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 rounded-full border border-white/5 shadow-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button onClick={handleShareProfile} className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 rounded-full border border-white/5 shadow-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </button>
            </>
          ) : (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-95 bg-white/5 rounded-full border border-white/5 shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
          )}

          {isMenuOpen && !isOwnProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute top-12 right-0 w-44 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden py-1 animate-fadeIn">
                <button onClick={handleShareProfile} className="w-full text-left px-4 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share Profile
                </button>
                <div className="h-px bg-white/5 my-1 w-full"></div>
                <button onClick={() => { setIsMenuOpen(false); setActiveModal('block'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  Block User
                </button>
                <button onClick={() => { setIsMenuOpen(false); setActiveModal('report'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  Report User
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="w-full h-32 bg-gradient-to-r from-[#121212] via-[#1A1A24] to-[#0A0A0A] relative border-b border-white/[0.05]">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex justify-between items-end -mt-10 mb-3 relative z-10 px-1">
            <div className="w-20 h-20 bg-[#0A0A0A] rounded-full border-4 border-[#0A0A0B] flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-zinc-500">👤</span>
              )}
            </div>
            
            {isOwnProfile ? (
              <div className="flex flex-col items-end pb-1 animate-fadeIn">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Net Worth</span>
                <span className="text-xl font-black text-white font-mono tracking-tight leading-none">{displayNetWorth}</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] font-black text-[#089981] font-mono leading-none">+$450.00</span>
                  <span className="text-[8px] font-black bg-[#089981]/10 text-[#089981] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[#089981]/25 shadow-[0_0_10px_rgba(8,153,129,0.1)] leading-none">+2.4% Today</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pb-1">
                {/* 🚀 FIXED TIP BUTTON */}
                <button 
                  onClick={() => setActiveModal('tip')}
                  className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#089981]/20 hover:text-[#089981] hover:border-[#089981]/40 transition-all active:scale-95 shadow-sm"
                  title="Send Tip"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                {/* 🚀 FIXED PERMANENT FOLLOW BUTTON */}
                <button 
                  onClick={handleToggleFollow}
                  className={`px-5 py-2.5 shrink-0 rounded-full text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center min-w-[100px] shadow-lg ${
                    isFollowing 
                      ? 'bg-transparent border border-white/25 text-white hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/40' 
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            )}
          </div>

          <div className="animate-slideUpDelay1 flex flex-col px-1">
            <div className="flex items-center gap-4 mb-3">
              <div onClick={() => setActiveModal('following')} className="flex items-center gap-1.5 cursor-pointer group">
                <span className="text-sm font-black text-white group-hover:text-[#089981] transition-colors">340</span>
                <span className="text-[11px] text-zinc-500 font-medium">Following</span>
              </div>
              <div onClick={() => setActiveModal('followers')} className="flex items-center gap-1.5 cursor-pointer group">
                <span className="text-sm font-black text-white group-hover:text-[#089981] transition-colors">1,240</span>
                <span className="text-[11px] text-zinc-500 font-medium">Followers</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[9px] font-black tracking-widest text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded px-2 py-0.5 uppercase shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                  Apex Tier
                </span>
              </div>
            </div>

            <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap">{displayBio}</p>

            <div className="flex items-center mt-3 gap-3">
              <button onClick={handleCopyAddress} className="flex items-center gap-1.5 bg-[#121212] hover:bg-[#1A1A24] border border-white/5 px-2.5 py-1 rounded-md transition-colors text-[10px] font-mono text-zinc-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {copied ? <span className="text-[#089981]">Copied!</span> : shortAddress}
              </button>
            </div>
            
            {!isOwnProfile && (
              <div className="flex flex-col mt-4 bg-gradient-to-r from-white/5 to-transparent p-4 rounded-xl border-l-2 border-[#089981] shadow-sm">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Estimated Net Worth</span>
                <p className="text-2xl font-black text-white font-mono tracking-tight leading-none">{displayNetWorth}</p>
                <div className="flex items-center gap-2 mt-3">
                   <span className="text-sm font-black text-[#089981] font-mono leading-none">+$12,450.00</span>
                   <span className="text-[9px] font-black bg-[#089981]/10 text-[#089981] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[#089981]/20 shadow-[0_0_10px_rgba(8,153,129,0.1)] leading-none">+8.2% Today</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="animate-slideUpDelay2">
          <div className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/[0.05] flex">
            {['activity', 'created', 'callouts'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#089981] rounded-t-full shadow-[0_0_10px_rgba(8,153,129,0.5)]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col w-full pb-32">
            
            {/* ACTIVITY TAB */}
            {activeTab === 'activity' && (
              <div className="flex flex-col p-3 gap-4">
                {mockActivity.map(act => (
                  <div key={act.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/10">
                         {displayAvatar ? <img src={displayAvatar} className="w-full h-full object-cover" alt="Avatar" /> : <span className="text-[10px] flex items-center justify-center h-full bg-[#121212]">👤</span>}
                      </div>
                      <span className="text-xs font-bold text-white">
                        {displayUsername} <span className="text-zinc-400 font-medium">bought {act.amount} {act.tokenSymbol}</span>
                      </span>
                      <span className="text-[10px] font-bold text-zinc-600 ml-auto shrink-0">• {act.time}</span>
                    </div>

                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:bg-[#151515] transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img src={act.iconUrl} alt="Token" className="w-10 h-10 rounded-full border border-white/10 bg-black shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-white truncate">{act.tokenName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono text-zinc-400">{act.price}</span>
                              <span className={`text-[10px] font-black ${act.isPositive ? 'text-[#089981]' : 'text-rose-500'}`}>{act.pnl}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => showToast(`Opening trade terminal for ${act.tokenSymbol}...`)} className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors shrink-0 ml-2">
                          Buy
                        </button>
                      </div>

                      <div className="w-full h-16 border-b border-dashed border-white/10 relative flex items-end justify-between px-1 pb-1">
                        <div className="w-full h-10 bg-gradient-to-t from-rose-500/10 to-transparent absolute bottom-0 left-0"></div>
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0,20 Q20,30 40,80 T100,90" fill="none" stroke="#F23645" strokeWidth="2" />
                           <circle cx="100" cy="90" r="3" fill="#F23645" />
                           <circle cx="0" cy="20" r="3" fill="#F23645" stroke="white" strokeWidth="1" />
                        </svg>
                        <span className="text-[9px] font-mono text-zinc-600 relative z-10">{act.price}</span>
                        <span className="text-[9px] font-mono text-zinc-600 relative z-10">0.00001338</span>
                      </div>

                      <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-zinc-500 font-bold">Loss</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-black text-rose-500 truncate">↓ {act.lossText}</span>
                            <span className="text-[9px] font-bold bg-rose-500/10 text-rose-500 px-1 rounded shrink-0">{act.lossPct}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[40%] ml-2">
                          <span className="text-[10px] text-zinc-500 font-bold">Current value</span>
                          <span className="text-sm font-black text-white mt-0.5 font-mono truncate w-full text-right">{act.currentValue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-2 mt-1">
                      <button onClick={handleShareProfile} className="text-zinc-500 hover:text-white transition-colors p-1" title="Share Activity"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></button>
                      <button onClick={() => handleAddReaction(act.id, '🔥')} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-full text-xs transition-colors">
                        🔥 <span className="text-[10px] font-bold text-zinc-400">{act.reactions?.['🔥'] || 5}</span>
                      </button>
                      <button onClick={() => handleAddReaction(act.id, '🚀')} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-full text-xs transition-colors">
                        🚀 <span className="text-[10px] font-bold text-zinc-400">{act.reactions?.['🚀'] || 12}</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* CREATED TAB */}
            {activeTab === 'created' && (
              <div className="flex flex-col gap-3 p-3 animate-fadeIn">
                {mockForgedAssets.map(asset => (
                  <div key={asset.id} className="p-5 bg-[#0A0A0A] border border-white/[0.03] rounded-2xl hover:border-[#089981]/30 transition-all shadow-lg flex flex-col gap-4 group cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#089981]/20 to-emerald-500/20 flex items-center justify-center font-bold text-sm text-[#089981] border border-[#089981]/30 shadow-inner group-hover:scale-105 transition-transform">
                          {asset.symbol.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-wide">{asset.name}</span>
                          <span className="text-[10px] text-zinc-500 font-bold">{asset.symbol}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${asset.isRaydium ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-[#00FF66] bg-[#00FF66]/10 border-[#00FF66]/20'}`}>
                        {asset.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.03]">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Bonding Curve</span>
                        <span className="text-xs font-black text-zinc-200 mt-0.5">{asset.supplyBonded} Sold</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Market Cap</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-white">{asset.mcap}</span>
                          <span className={`text-[10px] font-bold ${asset.change.includes('+') ? 'text-[#089981]' : 'text-rose-500'}`}>{asset.change}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CALLOUTS TAB */}
            {activeTab === 'callouts' && (
              <div className="flex flex-col gap-3 p-3 animate-fadeIn">
                {mockCallouts.map(callout => (
                  <div key={callout.id} className="p-4 bg-[#121212] border border-white/5 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#089981] uppercase tracking-wider">📌 {callout.tokenName} ({callout.symbol})</span>
                      <span className="text-[9px] font-mono text-zinc-500">{callout.time}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">{callout.calloutText}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] text-zinc-400 font-mono">
                      <span>Market Cap: <strong className="text-white">{callout.mcap}</strong></span>
                      <span className="text-[#00FF66]">Active Alpha</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- INTERACTIVE MODALS (REPORT, BLOCK, TIP, FOLLOWERS, FOLLOWING) --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-[#121212] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 relative z-10 animate-slideUpNative flex flex-col shadow-2xl">
            
            {/* 1. REPORT MODAL */}
            {activeModal === 'report' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Report {displayUsername}</h3>
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
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
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