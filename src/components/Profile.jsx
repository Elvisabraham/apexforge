import React, { useState } from 'react';

export default function Profile() {
  const [isOwnProfile, setIsOwnProfile] = useState(true); 
  const [activeTab, setActiveTab] = useState('callouts'); 
  const [quickSolAmount, setQuickSolAmount] = useState('0.5');
  const [slippage, setSlippage] = useState('1.0');
  const [isAntiMev, setIsAntiMev] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1420);
  const [isCopyTrading, setIsCopyTrading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [replyInputOpen, setReplyInputOpen] = useState({});
  const [replyText, setReplyText] = useState({});

  const displayUsername = "@ElvisAI";

  const [callouts, setCallouts] = useState([
    {
      id: 1,
      author: '@ElvisAI',
      time: '2m ago',
      symbol: '$WEN',
      name: 'Wen Coin',
      ca: 'WENw7K92PqL9...pump',
      entryMC: '$120K',
      currentMC: '$1.4M',
      multiplier: '11.6x',
      pnlPercent: '+1060%',
      liquidity: '$240K',
      devHolding: '0.8%',
      top10Holding: '14.2%',
      rugScore: '99/100',
      text: 'Double-bottom breakout on 1m chart. Top 10 wallet concentration under 15%. Smart money accumulating fast.',
      likes: 142,
      reposts: 28,
      replies: 19,
      views: '14.8K',
      bookmarks: 34,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      commentList: [
        { id: 101, user: '@SolTrenchRunner', text: 'Apocalypse entry point! Loaded up 2 SOL.' }
      ]
    },
    {
      id: 2,
      author: '@ElvisAI',
      time: '1h ago',
      symbol: '$SOLX',
      name: 'SolanaX AI',
      ca: 'SOLX99a...88k',
      entryMC: '$80K',
      currentMC: '$520K',
      multiplier: '6.5x',
      pnlPercent: '+550%',
      liquidity: '$110K',
      devHolding: '0.0%',
      top10Holding: '18.5%',
      rugScore: '94/100',
      text: 'Volume spiked 300% on Raydium. Liquidity locked permanently.',
      likes: 89,
      reposts: 14,
      replies: 8,
      views: '8.2K',
      bookmarks: 12,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      commentList: []
    }
  ]);

  const [positions, setPositions] = useState([
    {
      id: 101,
      symbol: '$SOLX',
      name: 'SolanaX AI',
      ca: 'SOLX99a...88k',
      type: 'LONG 3X',
      entryPrice: '$0.45',
      currentPrice: '$1.20',
      size: '12.5 SOL',
      pnlSol: '+20.8 SOL',
      pnlPercent: '+166.6%',
      tp: '$1.50',
      sl: '$0.38'
    }
  ]);

  const [deployedTokens] = useState([
    {
      id: 201,
      symbol: '$WEN',
      name: 'Wen Coin',
      platform: 'Apex Bonding Curve',
      ca: 'WENw7K92...pump',
      marketCap: '$1.4M',
      bondingCurve: 88,
      liquidity: '$240K',
      creatorFeesEarned: '48.2 SOL',
      lpStatus: '100% BURNED',
      age: '4 days ago'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLike = (id) => {
    setCallouts(prev => prev.map(item => {
      if (item.id === id) {
        const nextLiked = !item.isLiked;
        showToast(nextLiked ? 'Liked callout' : 'Removed like');
        return { ...item, isLiked: nextLiked, likes: nextLiked ? item.likes + 1 : item.likes - 1 };
      }
      return item;
    }));
  };

  const handleToggleRepost = (id) => {
    setCallouts(prev => prev.map(item => {
      if (item.id === id) {
        const nextReposted = !item.isReposted;
        showToast(nextReposted ? 'Reposted to your profile' : 'Undo repost');
        return { ...item, isReposted: nextReposted, reposts: nextReposted ? item.reposts + 1 : item.reposts - 1 };
      }
      return item;
    }));
  };

  const handleToggleBookmark = (id) => {
    setCallouts(prev => prev.map(item => {
      if (item.id === id) {
        const nextBookmark = !item.isBookmarked;
        showToast(nextBookmark ? 'Added to Bookmarks' : 'Removed from Bookmarks');
        return { ...item, isBookmarked: nextBookmark, bookmarks: nextBookmark ? item.bookmarks + 1 : item.bookmarks - 1 };
      }
      return item;
    }));
  };

  const toggleReplyBox = (id) => {
    setReplyInputOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddReply = (postId) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;

    setCallouts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies + 1,
          commentList: [
            ...post.commentList,
            { id: Date.now(), user: displayUsername, text: text.trim() }
          ]
        };
      }
      return post;
    }));

    setReplyText(prev => ({ ...prev, [postId]: '' }));
    showToast('Reply published!');
  };

  const handleClosePosition = (id, symbol) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    showToast(`Closed position for ${symbol}`);
  };

  return (
    <div className="h-screen bg-[#070708] text-zinc-100 flex flex-col font-sans text-xs selection:bg-[#089981] selection:text-white overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#089981] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg border border-emerald-400/40 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          ⚡ {toastMessage}
        </div>
      )}

      {/* Top Ticker Bar */}
      <div className="bg-[#0A0A0C] border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[10px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-6 font-bold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> 
            SOL/USD $184.20 (+6.4%)
          </span>
          <span>SOLANA TPS: <strong className="text-white font-semibold">2,840</strong></span>
          <span>GAS: <strong className="text-emerald-400 font-semibold">0.000005 SOL</strong></span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          <span className="text-[9px] text-zinc-400 font-bold">PREVIEW MODE:</span>
          <button 
            onClick={() => setIsOwnProfile(true)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${isOwnProfile ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-zinc-500 hover:text-white'}`}
          >
            IS ME (OWNER)
          </button>
          <button 
            onClick={() => setIsOwnProfile(false)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${!isOwnProfile ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-zinc-500 hover:text-white'}`}
          >
            IS YOURS (VISITOR)
          </button>
        </div>
      </div>

      {/* Navigation Sub Header */}
      <div className="bg-[#0A0A0C] border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-zinc-300 hover:text-white transition-all cursor-pointer font-medium">
            ← BACK
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-bold text-sm text-white">{displayUsername}</span>
          <span className="bg-[#089981]/20 text-[#089981] text-[9px] font-bold px-2 py-0.5 rounded border border-[#089981]/40 tracking-wider">
            TERMINAL PRO
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/10 text-[10px]">
            <span className="text-zinc-500">SLIPPAGE:</span>
            <button onClick={() => setSlippage(slippage === '1.0' ? '2.0' : '1.0')} className="text-emerald-400 font-bold hover:underline cursor-pointer">
              {slippage}%
            </button>
            <div className="w-[1px] h-3 bg-white/10 mx-1" />
            <button onClick={() => setIsAntiMev(!isAntiMev)} className={`font-bold cursor-pointer ${isAntiMev ? 'text-amber-400' : 'text-zinc-500'}`}>
              {isAntiMev ? '🛡️ MEV ON' : 'MEV OFF'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[10px] hidden sm:inline">QUICK BUY:</span>
            {['0.1', '0.5', '1.0', '2.5'].map((amt) => (
              <button
                key={amt}
                onClick={() => setQuickSolAmount(amt)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-all ${
                  quickSolAmount === amt 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30'
                }`}
              >
                {amt} SOL
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INDEPENDENT 3-COLUMN GRID (HIDDEN SCROLLBARS, CLEAN UN-SLASHED ZEROS) */}
      <div className="max-w-[1800px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN */}
        <div className="hidden xl:flex xl:col-span-3 flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1 pb-6">
          
          {/* Leaderboard Card */}
          <div className="bg-[#101012] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">TRADER RANKING</span>
              <span className="text-amber-400 font-bold text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">#4 APEX LEADERBOARD</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <span className="text-zinc-500 block">30D P&L</span>
                <strong className="text-emerald-400 text-sm font-bold">+482.4 SOL</strong>
              </div>
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <span className="text-zinc-500 block">WIN RATE</span>
                <strong className="text-emerald-400 text-sm font-bold">89.4%</strong>
              </div>
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <span className="text-zinc-500 block">AVG MULTIPLIER</span>
                <strong className="text-white text-xs font-bold">4.2x</strong>
              </div>
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <span className="text-zinc-500 block">TOTAL CALLS</span>
                <strong className="text-white text-xs font-bold">148 Calls</strong>
              </div>
            </div>
          </div>

          {/* Copy Trade Widget */}
          <div className="bg-[#101012] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 font-bold text-xs flex items-center gap-1.5">
                ⚡ AUTO COPY TRADER
              </span>
              <button 
                onClick={() => {
                  setIsCopyTrading(!isCopyTrading);
                  showToast(isCopyTrading ? 'Copy Trading Paused' : 'Copy Trading Activated!');
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  isCopyTrading 
                    ? 'bg-emerald-500 text-black border border-emerald-400' 
                    : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                }`}
              >
                {isCopyTrading ? '✓ ACTIVE' : 'ENABLE'}
              </button>
            </div>
            
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
              Automatically mirror all Apex bonding curve buys and Raydium breakouts made by {displayUsername}.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">MAX ALLOCATION / BUY:</span>
                <span className="text-emerald-400 font-bold">0.5 SOL</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">AUTO STOP LOSS:</span>
                <span className="text-rose-400 font-bold">-15%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">AUTO TAKE PROFIT:</span>
                <span className="text-emerald-400 font-bold">+100%</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#101012] border border-white/10 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">VERIFIED BADGES</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                ✓ 0x WHALE DEPLOYER
              </span>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                💎 TOP HOLDER
              </span>
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                ⚡ FAST EXECUTION
              </span>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN */}
        <div className="xl:col-span-6 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 pb-6">
          
          {/* Profile Card */}
          <div className="bg-[#101012] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-black border border-emerald-500/40 overflow-hidden shrink-0">
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{displayUsername}</h2>
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wider flex items-center gap-1 mt-0.5">
                    ⚡ TOP 0.1% APEX TRADER
                  </span>
                </div>
              </div>

              <div>
                {!isOwnProfile ? (
                  <button 
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
                      showToast(isFollowing ? `Unfollowed ${displayUsername}` : `Following ${displayUsername}`);
                    }}
                    className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      isFollowing 
                        ? 'bg-white/10 text-zinc-300 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isFollowing ? '✓ FOLLOWING' : '+ FOLLOW'}
                  </button>
                ) : (
                  <button 
                    onClick={() => showToast('Edit profile modal opened')}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    ⚙️ EDIT PROFILE
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
              Solana Trench Runner ⚡ Scalping early Apex bonding curve launches & Raydium CPMM breakouts. 0x Execution.
            </div>

            <div className="flex items-center justify-around text-[11px] border-t border-b border-white/5 py-2">
              <div>
                <strong className="text-white font-bold text-xs">{followersCount.toLocaleString()}</strong> <span className="text-zinc-500">Followers</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div>
                <strong className="text-white font-bold text-xs">184</strong> <span className="text-zinc-500">Following</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div>
                <strong className="text-emerald-400 font-bold text-xs">89.4%</strong> <span className="text-zinc-500">Copy Win Rate</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[#101012] border-b border-white/10 rounded-xl overflow-hidden shrink-0">
            {[
              { id: 'callouts', label: `🔥 ALPHA CALLS (${callouts.length})` },
              { id: 'positions', label: `📊 POSITIONS (${positions.length})` },
              { id: 'launches', label: `🚀 TOKENS (${deployedTokens.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-[11px] font-bold transition-all cursor-pointer relative flex items-center justify-center hover:bg-white/5 ${
                  activeTab === tab.id 
                    ? 'text-emerald-400 font-extrabold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 h-0.5 w-16 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Feed Content */}
          {activeTab === 'callouts' && (
            <div className="space-y-3">
              {callouts.map((post) => (
                <div key={post.id} className="bg-[#101012] border border-white/10 rounded-xl p-4 space-y-3 transition-all hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        ⚡
                      </div>
                      <span className="font-bold text-white text-xs">{post.author}</span>
                      <span className="text-zinc-500 text-[11px]">• {post.time}</span>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 font-bold text-xs px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                      🚀 {post.multiplier} ({post.pnlPercent})
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">{post.text}</p>

                  <div className="bg-black/80 p-3.5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          WE
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{post.symbol}</span>
                            <span className="text-zinc-400 text-[11px]">{post.name}</span>
                          </div>
                          <button 
                            onClick={() => showToast(`Copied CA: ${post.ca}`)}
                            className="text-[9px] text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            CA: {post.ca} 📋
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-[9px] text-zinc-500">ENTRY MC</div>
                          <div className="text-xs font-bold text-zinc-300">{post.entryMC}</div>
                        </div>
                        <div className="border-l border-white/10 pl-4">
                          <div className="text-[9px] text-zinc-500">CURRENT MC</div>
                          <div className="text-xs font-bold text-emerald-400">{post.currentMC}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] bg-white/5 p-2 rounded-lg border border-white/5">
                      <div>
                        <span className="text-zinc-500 block">LIQUIDITY</span>
                        <strong className="text-white font-semibold">{post.liquidity}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">DEV HOLDING</span>
                        <strong className="text-amber-400 font-semibold">{post.devHolding}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">TOP 10</span>
                        <strong className="text-emerald-400 font-semibold">{post.top10Holding}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">SAFETY</span>
                        <strong className="text-emerald-400 font-semibold">{post.rugScore}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-zinc-400 font-bold">INSTANT BUY:</span>
                      <div className="flex items-center gap-2">
                        {['0.1', '0.5', '1.0'].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => showToast(`Executed Buy order for ${amt} SOL of ${post.symbol}`)}
                            className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold text-[10px] transition-all cursor-pointer"
                          >
                            BUY {amt} SOL
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* REAL X (TWITTER) ENGAGEMENT METRICS ROW */}
                  <div className="flex items-center justify-between pt-2 px-2 text-zinc-500 text-xs border-t border-white/5">
                    
                    {/* Reply Icon */}
                    <button 
                      onClick={() => toggleReplyBox(post.id)}
                      className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group cursor-pointer"
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-sky-500/10 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.59-4 7.01v2.11c0 .82-.9 1.32-1.6.9l-2.6-1.56a10.16 10.16 0 0 1-1.9.18h-2.39c-4.42 0-8.005-3.58-8.005-8zm8.005-6c-3.313 0-6.005 2.69-6.005 6s2.692 6 6.005 6h2.39c.56 0 1.11.08 1.63.24l1.22.73v-1.29c0-.55.45-1 1-1 2.24 0 4.13-1.8 4.13-4.04 0-3.39-2.74-6.13-6.13-6.13h-4.24z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium group-hover:text-sky-400">{post.replies}</span>
                    </button>

                    {/* Repost Icon */}
                    <button 
                      onClick={() => handleToggleRepost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors group cursor-pointer ${post.isReposted ? 'text-emerald-400' : 'hover:text-emerald-400'}`}
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M4.5 3.88l4.42 4.42-1.42 1.42L5.5 7.72V15c0 1.66 1.34 3 3 3h7v2H8.5c-2.76 0-5-2.24-5-5V7.72L1.5 9.72.08 8.3 4.5 3.88zM19.5 20.12l-4.42-4.42 1.42-1.42 2 2V9c0-1.66-1.34-3-3-3h-7V4h7c2.76 0 5 2.24 5 5v8.28l2-2 1.42 1.42-4.42 4.42z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium">{post.reposts}</span>
                    </button>

                    {/* Like Icon */}
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors group cursor-pointer ${post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-rose-500/10 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          {post.isLiked ? (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          ) : (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zm-4.5-16.35C5.52 5 4 6.52 4 8.5c0 2.9 2.8 5.56 7.37 9.71L12 18.82l.63-.57c4.57-4.15 7.37-6.81 7.37-9.71 0-1.98-1.52-3.5-3.5-3.5-1.32 0-2.58.72-3.17 1.85h-1.66c-.59-1.13-1.85-1.85-3.17-1.85z"/>
                          )}
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium">{post.likes}</span>
                    </button>

                    {/* Views / Impressions Icon */}
                    <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group cursor-pointer">
                      <div className="p-1.5 rounded-full group-hover:bg-sky-500/10 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M8.75 21V3h2v18h-2zM18.75 21V11h2v10h-2zM3.75 21V15h2v6h-2zM13.75 21V7h2v14h-2z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium">{post.views}</span>
                    </div>

                    {/* Bookmark Icon */}
                    <button 
                      onClick={() => handleToggleBookmark(post.id)}
                      className={`flex items-center gap-1.5 transition-colors group cursor-pointer ${post.isBookmarked ? 'text-sky-400' : 'hover:text-sky-400'}`}
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-sky-500/10 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
                        </svg>
                      </div>
                    </button>

                  </div>

                  {/* Interactive Inline Reply Section */}
                  {replyInputOpen[post.id] && (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Post your reply..."
                          value={replyText[post.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                          className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleAddReply(post.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>

                      {post.commentList.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {post.commentList.map((c) => (
                            <div key={c.id} className="bg-white/5 p-2 rounded text-[11px] flex justify-between">
                              <span className="text-emerald-400 font-bold">{c.user}:</span>
                              <span className="text-zinc-300">{c.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {activeTab === 'positions' && (
            <div className="space-y-3">
              {positions.map((pos) => (
                <div key={pos.id} className="p-4 bg-[#101012] border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm">
                        {pos.symbol.substring(1, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{pos.symbol}</span>
                          <span className="text-zinc-400 text-xs">{pos.name}</span>
                          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                            {pos.type}
                          </span>
                        </div>
                        <button 
                          onClick={() => showToast(`Copied CA: ${pos.ca}`)}
                          className="text-[9px] text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          CA: {pos.ca} 📋
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-400">{pos.pnlPercent}</div>
                      <div className="text-xs font-bold text-zinc-300">{pos.pnlSol}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[10px] bg-black/60 p-2.5 rounded-lg border border-white/5">
                    <div>
                      <span className="text-zinc-500 block">ENTRY PRICE</span>
                      <strong className="text-zinc-200">{pos.entryPrice}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">MARK PRICE</span>
                      <strong className="text-emerald-400">{pos.currentPrice}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">SIZE</span>
                      <strong className="text-white">{pos.size}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">TP / SL</span>
                      <strong className="text-zinc-300">{pos.tp} / {pos.sl}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-500">MEV Protected execution</span>
                    <button
                      onClick={() => handleClosePosition(pos.id, pos.symbol)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-bold text-[10px] transition-all cursor-pointer"
                    >
                      CLOSE POSITION ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

         {activeTab === 'launches' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {deployedTokens.map((token) => (
      <div key={token.id} className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {token.symbol.substring(1, 3)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-white truncate">{token.symbol}</span>
                <span className="text-zinc-400 text-[10px] truncate">{token.name}</span>
              </div>
              <button 
                onClick={() => showToast(`Copied CA: ${token.ca}`)}
                className="text-[9px] text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer block truncate"
              >
                CA: {token.ca} 📋
              </button>
            </div>
          </div>

          <button 
            onClick={() => showToast(`Opening terminal chart for ${token.symbol}`)}
            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold text-[9px] cursor-pointer shrink-0"
          >
            TRADE 📈
          </button>
        </div>

        {/* Bonding Curve Bar */}
        <div className="space-y-1 bg-black/40 p-2 rounded-lg border border-white/5">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-zinc-400 font-bold">BONDING CURVE</span>
            <span className="text-emerald-400 font-bold">{token.bondingCurve}%</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${token.bondingCurve}%` }}
            />
          </div>
        </div>

        {/* 2x2 Grid Stats */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] bg-black/60 p-2 rounded-lg border border-white/5">
          <div>
            <span className="text-zinc-500 block">MARKET CAP</span>
            <strong className="text-emerald-400 font-semibold">{token.marketCap}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block">LIQUIDITY</span>
            <strong className="text-white font-semibold">{token.liquidity}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block">FEES EARNED</span>
            <strong className="text-amber-400 font-semibold">{token.creatorFeesEarned}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block">LP STATUS</span>
            <strong className="text-emerald-400 font-semibold">{token.lpStatus}</strong>
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 text-right">
          Deployed {token.age} • {token.platform}
        </div>

      </div>
    ))}
  </div>
)}

        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden xl:flex xl:col-span-3 flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-1 pb-6">
          
          {/* Wallet Balance Widget */}
          <div className="p-4 bg-[#101012] border border-white/10 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span className="font-bold uppercase tracking-wider">Trench Wallet Balance</span>
              <span className="text-emerald-400 font-bold">+14.2% (24h)</span>
            </div>
            {/* CLEAN UN-SLASHED ZEROS */}
            <div className="text-2xl font-black text-white tracking-tight">90.19 SOL</div>
            <div className="text-[10px] text-zinc-500">~$16,613.00 USD</div>
          </div>

          {/* Whale Radar */}
          <div className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/>
                WHALE RADAR
              </span>
              <span className="text-zinc-500">Live Stream</span>
            </div>

            <div className="space-y-2">
              <div className="p-2 bg-black/50 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
                <div>
                  <div className="text-emerald-400 font-bold">Whale Buy 45 SOL</div>
                  <div className="text-zinc-500">$WEN • Wallet 8xV...10</div>
                </div>
                <span className="text-zinc-500 text-[9px]">1m ago</span>
              </div>

              <div className="p-2 bg-black/50 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
                <div>
                  <div className="text-emerald-400 font-bold">Whale Buy 120 SOL</div>
                  <div className="text-zinc-500">$SOLX • Wallet 3pA...99</div>
                </div>
                <span className="text-zinc-500 text-[9px]">4m ago</span>
              </div>
            </div>
          </div>

          {/* Quick Launcher */}
          <div className="p-4 bg-[#101012] border border-emerald-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-xs">🚀 FORGE A TOKEN</span>
              <span className="text-emerald-400 text-[10px] font-bold">0.02 SOL FEE</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">
              Deploy your own bonding curve token straight from your terminal profile.
            </p>
            <button 
              onClick={() => showToast('Opening Apex Token Forge modal...')}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              + LAUNCH TOKEN NOW
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}