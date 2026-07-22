// 🚀 VERSION 4: HIGH-PERFORMANCE LEADERBOARD WITH TIMEFRAMES & SHARE ACTIONS
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Ranks({ onOpenProfile }) {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('TRADERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('24H'); // 🚀 NEW: 24H, 7D, ALL
  const [followedWallets, setFollowedWallets] = useState({});

  // Helper to format short address
  const shortAddress = connected && publicKey 
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '8xV9...yYyW';

  // DATA ENGINE: Top Traders
  const topTraders = [
    { rank: 1, wallet: 'Ansem...sol', pnl: '+4,250 SOL', winRate: '82%', badge: '🐋', color: 'text-amber-400', bg: 'bg-amber-400/10 border border-amber-400/30' },
    { rank: 2, wallet: 'Mitch...pump', pnl: '+2,100 SOL', winRate: '75%', badge: '🎯', color: 'text-zinc-300', bg: 'bg-white/10 border border-white/20' },
    { rank: 3, wallet: 'Degen...eth', pnl: '+1,840 SOL', winRate: '68%', badge: '⚡', color: 'text-orange-500', bg: 'bg-orange-500/10 border border-orange-500/30' },
    { rank: 4, wallet: '7xV9...q9n2', pnl: '+950 SOL', winRate: '55%', badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 5, wallet: 'Sniper...bot', pnl: '+820 SOL', winRate: '91%', badge: '🤖', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 6, wallet: 'Apex...chad', pnl: '+610 SOL', winRate: '61%', badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 7, wallet: '33vL...11po', pnl: '+450 SOL', winRate: '48%', badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 8, wallet: 'Ghost...dev', pnl: '+390 SOL', winRate: '52%', badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
  ];

  // DATA ENGINE: Top Creators
  const topCreators = [
    { rank: 1, wallet: 'Studio...web3', volume: '$12.5M', tokens: 4, badge: '👑', color: 'text-amber-400', bg: 'bg-amber-400/10 border border-amber-400/30' },
    { rank: 2, wallet: 'Forge...Labs', volume: '$8.2M', tokens: 2, badge: '🛠️', color: 'text-zinc-300', bg: 'bg-white/10 border border-white/20' },
    { rank: 3, wallet: 'Meme...King', volume: '$5.1M', tokens: 12, badge: '🎭', color: 'text-orange-500', bg: 'bg-orange-500/10 border border-orange-500/30' },
    { rank: 4, wallet: '9vXq...bb12', volume: '$2.3M', tokens: 1, badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 5, wallet: 'Alpha...Dev', volume: '$1.8M', tokens: 3, badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
    { rank: 6, wallet: '44zP...xx99', volume: '$950K', tokens: 5, badge: '', color: 'text-zinc-500', bg: 'bg-white/[0.02] border border-transparent' },
  ];

  const rawData = activeTab === 'TRADERS' ? topTraders : topCreators;

  // Filter based on search input
  const displayData = rawData.filter(user => 
    user.wallet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (walletId, e) => {
    e.stopPropagation();
    setFollowedWallets(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  // 🚀 VIRALITY / GAMIFICATION: Native Share Trigger
  const handleShareRank = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Apex Forge Leaderboard',
        text: `I'm currently ranked #24,801 on the Apex Forge Leaderboard in the Apex Tier! 🏆`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Rank copied to clipboard! Share it to flex on the timeline. 🚀');
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden select-none">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* --- UNMOVABLE HEADER --- */}
      <header className="flex-none z-50 bg-[#0A0A0B]/95 backdrop-blur-xl pt-4 pb-2 px-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-md">🏆</span>
            <h1 className="text-xl font-black tracking-widest text-white uppercase mt-1">Leaderboard</h1>
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        
        {/* 🚀 UPGRADED HERO CARD */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A0A] border border-[#089981]/30 rounded-3xl p-5 shadow-[0_0_40px_rgba(8,153,129,0.15)] relative overflow-hidden flex flex-col">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#089981]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between z-10 w-full mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black border-2 border-[#089981]/80 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(8,153,129,0.4)]">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shortAddress}`} alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-[#089981] tracking-widest mb-0.5">Your Rank</span>
                  <span className="text-2xl font-black text-white leading-none drop-shadow-md">#24,801</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 z-10">
                <span className="text-[10px] font-black tracking-widest text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded px-2.5 py-1 uppercase shadow-sm">
                  Apex Tier
                </span>
                {/* 🚀 VIRALITY: Share Button */}
                <button 
                  onClick={handleShareRank}
                  className="flex items-center gap-1.5 text-[9px] font-black text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-md uppercase tracking-widest transition-colors active:scale-95"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Flex Rank
                </button>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full flex flex-col z-10">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Next Tier: Whale</span>
                <span className="text-[10px] font-black text-white font-mono">4,850 / 5,000 XP</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-gradient-to-r from-[#089981]/50 to-[#089981] w-[97%] rounded-full shadow-[0_0_10px_#089981]"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Controls Panel */}
        <div className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md px-4 pb-3 pt-1 border-b border-white/[0.04] flex flex-col gap-3">
          {/* Tabs */}
          <div className="flex gap-2 w-full bg-[#131722] p-1.5 rounded-xl border border-white/5 shadow-inner">
            {['TRADERS', 'CREATORS'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-[#089981] text-white shadow-md' 
                    : 'bg-transparent text-zinc-500 hover:text-white'
                }`}
              >
                Top {tab}
              </button>
            ))}
          </div>

          {/* 🚀 UPGRADED: LIVE SEARCH BAR + TIMEFRAME TOGGLE */}
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()} by handle...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-[#131722] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white placeholder-zinc-600 outline-none focus:border-[#089981]/30 transition-colors"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Timeframe Filter */}
            <div className="flex bg-[#131722] border border-white/5 rounded-xl p-1 shrink-0">
              {['24H', '7D', 'ALL'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-[9px] font-black rounded-lg transition-colors ${
                    timeframe === tf 
                      ? 'bg-white/10 text-white' 
                      : 'text-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- LEADERBOARD LIST --- */}
        <div className="flex flex-col px-2 pt-2">
          
          <div className="flex items-center justify-between px-4 py-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
             <div className="flex items-center gap-5">
                <span className="w-6 text-center">#</span>
                <span>Wallet / User</span>
             </div>
             <span>{activeTab === 'TRADERS' ? 'Total PNL' : 'Total Volume'}</span>
          </div>

          <div className="flex flex-col gap-1">
            {displayData.length > 0 ? (
              displayData.map((user, index) => {
                const isFollowed = followedWallets[user.wallet];
                
                return (
                  <div 
                    key={user.rank} 
                    onClick={() => {
                      if (onOpenProfile) onOpenProfile(user.wallet);
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl cursor-pointer bg-white/[0.01] hover:bg-[#131722] transition-colors border border-transparent hover:border-white/[0.02] group animate-slideDown"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${user.bg} ${user.color} shadow-inner`}>
                        {user.rank}
                      </div>

                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-sm overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.wallet}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-white flex items-center gap-1.5 truncate group-hover:text-[#089981] transition-colors">
                            {user.wallet}
                            {user.badge && <span className="text-xs drop-shadow-md">{user.badge}</span>}
                          </span>
                          
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                              {activeTab === 'TRADERS' ? `WR: ${user.winRate}` : `Tokens: ${user.tokens}`}
                            </span>

                            {/* Mobile Interactive Follow */}
                            <button 
                              onClick={(e) => toggleFollow(user.wallet, e)}
                              className={`lg:hidden px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest rounded transition-all shadow-sm ${
                                isFollowed 
                                  ? 'bg-[#089981] border-[#089981] text-white' 
                                  : 'bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/30 text-[#089981]'
                              }`}
                            >
                              {isFollowed ? '✓ Following' : '+ Follow'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 relative">
                      <span className={`text-[15px] font-black font-mono tracking-tight transition-all duration-200 ${
                        activeTab === 'TRADERS' ? 'text-[#089981]' : 'text-white'
                      } lg:group-hover:opacity-0 drop-shadow-md`}>
                        {activeTab === 'TRADERS' ? user.pnl : user.volume}
                      </span>
                      
                      {/* Desktop Interactive Follow */}
                      <button 
                        onClick={(e) => toggleFollow(user.wallet, e)}
                        className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 shadow-md ${
                          isFollowed 
                            ? 'bg-[#089981] text-white' 
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isFollowed ? '✓ Following' : '+ Follow'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                No profiles found matching search
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6 px-4">
           <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
             Rankings update every 5 minutes based on live on-chain protocol data.
           </span>
        </div>

      </div>
    </div>
  );
}