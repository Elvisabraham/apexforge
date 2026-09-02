import React, { useState } from 'react';

export default function Profile() {
  const [isOwnProfile, setIsOwnProfile] = useState(true); 
  const [activeTab, setActiveTab] = useState('callouts'); 
  const [quickSolAmount, setQuickSolAmount] = useState('0.5');
  const [slippage, setSlippage] = useState('1.0');
  const [isAntiMev, setIsAntiMev] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1420);
  const [toastMessage, setToastMessage] = useState(null);

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
      isLiked: false,
      isReposted: false,
      isBookmarked: false
    }
  ]);

  const [positions] = useState([
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
      isProfit: true,
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
      bondingCurve: '88%',
      liquidity: '$240K',
      devHolding: '0.8%',
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
        showToast(nextLiked ? 'Added to Liked Calls' : 'Removed Like');
        return { ...item, isLiked: nextLiked, likes: nextLiked ? item.likes + 1 : item.likes - 1 };
      }
      return item;
    }));
  };

  const handleToggleRepost = (id) => {
    setCallouts(prev => prev.map(item => {
      if (item.id === id) {
        const nextReposted = !item.isReposted;
        showToast(nextReposted ? 'Reposted to your feed!' : 'Undo repost');
        return { ...item, isReposted: nextReposted, reposts: nextReposted ? item.reposts + 1 : item.reposts - 1 };
      }
      return item;
    }));
  };

  const handleToggleBookmark = (id) => {
    setCallouts(prev => prev.map(item => {
      if (item.id === id) {
        const nextBM = !item.isBookmarked;
        showToast(nextBM ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
        return { ...item, isBookmarked: nextBM };
      }
      return item;
    }));
  };

  return (
    <div className="h-screen bg-[#070708] text-zinc-100 flex flex-col font-mono text-xs selection:bg-[#089981] selection:text-white overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#089981] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(8,153,129,0.5)] border border-emerald-400/40 animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          ⚡ {toastMessage}
        </div>
      )}

      {/* Top Marquee */}
      <div className="bg-[#0A0A0C] border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[10px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-6 font-bold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"/> 
            SOL/USD $184.20 (+6.4%)
          </span>
          <span>SOLANA TPS: <strong className="text-white">2,840</strong></span>
          <span>GAS: <strong className="text-emerald-400">0.000005 SOL</strong></span>
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

      {/* Main Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-zinc-300 hover:text-white transition-all cursor-pointer">
            ← BACK
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-black text-sm text-white">{displayUsername}</span>
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

      {/* Main Container */}
      <div className="max-w-[1600px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-y-auto">
        
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-3 pb-16">
          
          {/* Profile Card */}
          <div className="bg-[#101012] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-black border-2 border-emerald-500/60 shadow-xl overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">{displayUsername}</h2>
                  <span className="text-[10px] text-emerald-400 font-bold">⚡ TOP 0.1% APEX TRADER</span>
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
                    className={`px-4 py-2 rounded-lg text-[11px] font-black tracking-wider transition-all cursor-pointer ${
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
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[11px] font-black text-white transition-all cursor-pointer"
                  >
                    ⚙️ EDIT PROFILE
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
              Solana Trench Runner ⚡ Scalping early Apex bonding curve launches & Raydium CPMM breakouts. 0x Execution.
            </div>

            <div className="flex items-center gap-6 text-[11px] border-t border-b border-white/5 py-2">
              <div>
                <strong className="text-white font-mono text-xs">{followersCount.toLocaleString()}</strong> <span className="text-zinc-500">Followers</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div>
                <strong className="text-white font-mono text-xs">184</strong> <span className="text-zinc-500">Following</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div>
                <strong className="text-emerald-400 font-mono text-xs">89.4%</strong> <span className="text-zinc-500">Copy Win Rate</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[#101012] border border-white/10 rounded-lg p-1 gap-1">
            {[
              { id: 'callouts', label: `🔥 ALPHA CALLS (${callouts.length})` },
              { id: 'positions', label: `📊 OPEN POSITIONS (${positions.length})` },
              { id: 'launches', label: `🚀 DEPLOYED TOKENS (${deployedTokens.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-[11px] font-bold rounded transition-all cursor-pointer border ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(8,153,129,0.15)]' 
                    : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Callouts Feed */}
          {activeTab === 'callouts' && (
            <div className="space-y-3">
              {callouts.map((post) => (
                <div key={post.id} className="bg-[#101012] border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all shadow-xl p-4 space-y-3">
                  
                  {/* Main Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        ⚡
                      </div>
                      <span className="font-bold text-white text-xs">{post.author}</span>
                      <span className="text-zinc-500 text-[11px]">• {post.time}</span>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 font-black text-xs px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                      🚀 {post.multiplier} ({post.pnlPercent})
                    </span>
                  </div>

                  {/* Main Post Text */}
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">{post.text}</p>

                  {/* Quoted Token Box (X-Style Quote Card) */}
                  <div className="bg-black/80 hover:bg-black/90 p-3.5 rounded-2xl border border-white/10 space-y-3 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm shadow-[0_0_10px_rgba(8,153,129,0.2)]">
                          WE
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{post.symbol}</span>
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
                          <div className="text-xs font-mono font-bold text-zinc-300">{post.entryMC}</div>
                        </div>
                        <div className="border-l border-white/10 pl-4">
                          <div className="text-[9px] text-zinc-500">CURRENT MC</div>
                          <div className="text-xs font-mono font-black text-emerald-400">{post.currentMC}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] bg-white/5 p-2 rounded-lg border border-white/5">
                      <div>
                        <span className="text-zinc-500 block">LIQUIDITY</span>
                        <strong className="text-white font-mono">{post.liquidity}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">DEV HOLDING</span>
                        <strong className="text-amber-400 font-mono">{post.devHolding}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">TOP 10 HOLDERS</span>
                        <strong className="text-emerald-400 font-mono">{post.top10Holding}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">SAFETY SCORE</span>
                        <strong className="text-emerald-400 font-mono">{post.rugScore}</strong>
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

                  {/* X-Style Action Bar Below Quote Card */}
                  <div className="flex items-center justify-between pt-2 text-zinc-400 text-xs px-1">
                    
                    {/* Reply */}
                    <button 
                      onClick={() => showToast(`Opening replies for ${post.symbol}...`)}
                      className="flex items-center gap-1.5 hover:text-sky-400 transition-colors cursor-pointer group"
                    >
                      <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M1.751 10c0-4.42 3.584-8 8-8h4.498c4.416 0 8 3.58 8 8 0 4.42-3.584 8-8 8h-1.681l-4.908 4.91a.998.998 0 01-1.708-.707V18c-2.32-.29-4.201-2.02-4.201-4zm8-6c-3.313 0-6 2.69-6 6 0 3.31 2.687 6 6 6h2.152a.998.998 0 01.707.293L15 18.707V17a1 1 0 011-1h2.249c3.313 0 6-2.69 6-6s-2.687-6-6-6H9.751z"/>
                      </svg>
                      <span className="font-mono text-[11px]">{post.replies}</span>
                    </button>

                    {/* Repost */}
                    <button 
                      onClick={() => handleToggleRepost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
                        post.isReposted ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 20.12l-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14z"/>
                      </svg>
                      <span className="font-mono text-[11px]">{post.reposts}</span>
                    </button>

                    {/* Like */}
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
                        post.isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                      }`}
                    >
                      <svg className={`w-4 h-4 group-hover:scale-110 transition-transform ${post.isLiked ? 'fill-rose-500' : 'fill-current'}`} viewBox="0 0 24 24">
                        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.851 1.95 8.478c0-3.064 2.525-5.754 5.548-5.754 2.072 0 3.916 1.127 4.902 2.822 1.012-1.711 2.83-2.822 4.902-2.822 3.023 0 5.548 2.69 5.548 5.754 0 6.373-7.453 13.112-9.936 13.16L12 21.638z"/>
                      </svg>
                      <span className="font-mono text-[11px]">{post.likes}</span>
                    </button>

                    {/* Views */}
                    <div className="flex items-center gap-1.5 text-zinc-500 hover:text-sky-400 cursor-pointer">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21v-7h2v7H4zM13.25 21V11.5h2V21h-2z"/>
                      </svg>
                      <span className="font-mono text-[11px]">{post.views}</span>
                    </div>

                    {/* Right utilities: Bookmark & Share */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`hover:text-sky-400 transition-colors cursor-pointer ${post.isBookmarked ? 'text-sky-400' : ''}`}
                      >
                        <svg className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                          <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v16.73a.75.75 0 0 1-1.18.61L12 16.5l-6.82 5.34A.75.75 0 0 1 4 21.23V4.5z"/>
                        </svg>
                      </button>

                      <button 
                        onClick={() => showToast(`Share link copied for ${post.symbol}!`)}
                        className="hover:text-sky-400 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.591l5.707 5.707-1.414 1.414-3.293-3.293V16h-2V6.419L7.707 9.712 6.293 8.298 12 2.591zM4 19h16v2H4v-2z"/>
                        </svg>
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 sticky top-0 self-start font-mono pb-16">
          <div className="p-4 bg-[#101012] border border-white/10 rounded-xl space-y-2 shadow-xl">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span className="font-bold uppercase tracking-wider">Trench Wallet Balance</span>
              <span className="text-emerald-400">+14.2% (24h)</span>
            </div>
            <div className="text-2xl font-black text-white">90.19 SOL</div>
            <div className="text-[10px] text-zinc-500">~$16,613.00 USD</div>
          </div>

          <div className="p-3.5 bg-[#101012] border border-white/10 rounded-xl space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"/>
                WHALE RADAR
              </span>
              <span className="text-zinc-500">Live Stream</span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-lg flex justify-between items-center text-[10px]">
              <div>
                <div className="text-emerald-400 font-bold">Whale Buy 45 SOL</div>
                <div className="text-zinc-500">$WEN • Wallet 8xV...10</div>
              </div>
              <span className="text-zinc-500 text-[9px]">1m ago</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}