import React, { useState } from 'react';

const MOCK_TRADERS = [
  { rank: 1, handle: 'Ansem...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ansem', winRate: '82%', volume: '$1.4M', trades: 1420, pnl: '+4,250 SOL', pnlPercent: '+342.5%', pnlUsd: '+$637.5K', isFollowing: false },
  { rank: 2, handle: 'Mitch...pump', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mitch', winRate: '75%', volume: '$980K', trades: 890, pnl: '+2,100 SOL', pnlPercent: '+215.8%', pnlUsd: '+$315.0K', isFollowing: true },
  { rank: 3, handle: 'Cobie...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cobie', winRate: '71%', volume: '$750K', trades: 620, pnl: '+1,850 SOL', pnlPercent: '+184.2%', pnlUsd: '+$277.5K', isFollowing: false },
  { rank: 4, handle: 'Toly...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Toly', winRate: '68%', volume: '$620K', trades: 510, pnl: '+1,420 SOL', pnlPercent: '+142.0%', pnlUsd: '+$213.0K', isFollowing: false },
  { rank: 5, handle: 'Hsaka...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hsaka', winRate: '65%', volume: '$510K', trades: 430, pnl: '+1,150 SOL', pnlPercent: '+118.4%', pnlUsd: '+$172.5K', isFollowing: false },
  { rank: 6, handle: 'GCR...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GCR', winRate: '63%', volume: '$490K', trades: 390, pnl: '+980 SOL', pnlPercent: '+105.2%', pnlUsd: '+$147.0K', isFollowing: false },
  { rank: 7, handle: 'Murad...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Murad', winRate: '61%', volume: '$420K', trades: 340, pnl: '+840 SOL', pnlPercent: '+94.1%', pnlUsd: '+$126.0K', isFollowing: true },
  { rank: 8, handle: 'Rookie...pump', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rookie', winRate: '59%', volume: '$380K', trades: 310, pnl: '+720 SOL', pnlPercent: '+81.5%', pnlUsd: '+$108.0K', isFollowing: false },
  { rank: 9, handle: 'Wizard...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Wizard', winRate: '57%', volume: '$310K', trades: 270, pnl: '+610 SOL', pnlPercent: '+69.3%', pnlUsd: '+$91.5K', isFollowing: false },
  { rank: 10, handle: 'WhaleWatch', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Whale', winRate: '55%', volume: '$290K', trades: 250, pnl: '+540 SOL', pnlPercent: '+58.0%', pnlUsd: '+$81.0K', isFollowing: false },
  { rank: 11, handle: 'DegenKing', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Degen', winRate: '53%', volume: '$240K', trades: 210, pnl: '+450 SOL', pnlPercent: '+49.2%', pnlUsd: '+$67.5K', isFollowing: false },
  { rank: 12, handle: 'SolChad...pump', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SolChad', winRate: '51%', volume: '$210K', trades: 190, pnl: '+390 SOL', pnlPercent: '+41.0%', pnlUsd: '+$58.5K', isFollowing: false },
];

const MOCK_CREATORS = [
  { rank: 1, handle: 'MemeGod...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemeGod', tokensLaunched: 14, totalMcap: '$12.4M', totalVolume: '$4.2M', pnl: '+5,800 SOL', isFollowing: true },
  { rank: 2, handle: 'PumpKing...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PumpKing', tokensLaunched: 9, totalMcap: '$8.1M', totalVolume: '$2.9M', pnl: '+3,400 SOL', isFollowing: false },
  { rank: 3, handle: 'AlphaDev...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlphaDev', tokensLaunched: 6, totalMcap: '$5.6M', totalVolume: '$1.8M', pnl: '+2,150 SOL', isFollowing: false },
  { rank: 4, handle: 'SolForge...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SolForge', tokensLaunched: 5, totalMcap: '$3.9M', totalVolume: '$1.2M', pnl: '+1,600 SOL', isFollowing: false },
  { rank: 5, handle: 'CoinCraft...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CoinCraft', tokensLaunched: 4, totalMcap: '$2.4M', totalVolume: '$850K', pnl: '+980 SOL', isFollowing: false },
  { rank: 6, handle: 'Trenches...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Trenches', tokensLaunched: 8, totalMcap: '$2.1M', totalVolume: '$720K', pnl: '+850 SOL', isFollowing: false },
  { rank: 7, handle: 'MoonShot...pump', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MoonShot', tokensLaunched: 11, totalMcap: '$1.9M', totalVolume: '$650K', pnl: '+790 SOL', isFollowing: true },
  { rank: 8, handle: 'RocketMan...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RocketMan', tokensLaunched: 3, totalMcap: '$1.5M', totalVolume: '$510K', pnl: '+620 SOL', isFollowing: false },
  { rank: 9, handle: 'TokenFactory', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TokenFactory', tokensLaunched: 15, totalMcap: '$1.2M', totalVolume: '$430K', pnl: '+510 SOL', isFollowing: false },
  { rank: 10, handle: 'GemsHunter...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GemsHunter', tokensLaunched: 7, totalMcap: '$980K', totalVolume: '$380K', pnl: '+440 SOL', isFollowing: false },
  { rank: 11, handle: 'DevGuru...pump', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DevGuru', tokensLaunched: 4, totalMcap: '$850K', totalVolume: '$310K', pnl: '+370 SOL', isFollowing: false },
  { rank: 12, handle: 'ApexCreator...sol', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ApexCreator', tokensLaunched: 2, totalMcap: '$720K', totalVolume: '$260K', pnl: '+290 SOL', isFollowing: false },
];

export default function Ranks() {
  const [timeframe, setTimeframe] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    // Minimized outer padding (p-2 lg:p-3) and gaps to maximize space for tables
    <div className="w-full h-full bg-[#0c0d10] text-white p-2 lg:p-3 flex flex-col gap-2 overflow-hidden font-sans [font-feature-settings:'zero'_0]">
      
      {/* TOP LOCKED SECTION - EXTREMELY COMPACT */}
      <div className="shrink-0 flex flex-col gap-2">
        {/* HEADER TITLE */}
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-lg">🏆</span>
          <h1 className="text-base lg:text-lg font-black uppercase tracking-wider">Leaderboard</h1>
        </div>

        {/* COMPACT TOP HERO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* User Rank Card */}
          <div className="md:col-span-8 bg-[#121318] border border-white/5 rounded-xl p-2.5 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#089981]/10 border border-[#089981]/30 flex items-center justify-center text-sm">
                  🤠
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">Your Rank</span>
                  <span className="text-lg font-black text-white leading-tight">#24,801</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black rounded-md uppercase tracking-wider">
                  Apex Tier
                </span>
                <button type="button" className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-[9px] font-bold rounded-md border border-white/10 transition-colors">
                  Flex Rank
                </button>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-400">NEXT TIER: <strong className="text-white">WHALE</strong></span>
                <span className="text-[#00f2a1] font-bold">4,850 / 5,000 XP</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#089981] to-[#00f2a1] rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          {/* Quick User Stats */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-1.5">
            <div className="bg-[#121318] border border-white/5 rounded-xl px-2.5 py-1.5 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-bold">24h PnL</span>
              <span className="text-[11px] font-bold text-[#00f2a1]">+14.2 SOL</span>
            </div>
            <div className="bg-[#121318] border border-white/5 rounded-xl px-2.5 py-1.5 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-bold">Win Rate</span>
              <span className="text-[11px] font-bold text-white">64.5%</span>
            </div>
          </div>
        </div>

        {/* COMBINED SEARCH BAR & TIMEFRAME PILLS ROW */}
        <div className="w-full bg-[#121318] border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-zinc-500 text-[11px]">🔍</span>
            <input
              type="text"
              placeholder="Search handles or wallet addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-[11px] text-white placeholder-zinc-500 font-sans"
            />
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-[#0a0b0e] border border-white/5 p-0.5 rounded-lg gap-0.5 shrink-0">
            {['24h', '7d', 'all'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md transition-all ${
                  timeframe === tf 
                    ? 'bg-[#089981] text-white shadow-sm shadow-[#089981]/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN SPLIT DUAL CARD GRID (EXPANDS TO FILL REMAINING SPACE) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 flex-1 min-h-0 overflow-hidden">
        
        {/* CARD 1: TOP TRADERS */}
        <div className="bg-[#121318] border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-xl h-full min-h-0">
          <div className="px-3 py-2 bg-[#0a0b0e] border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00f2a1] shadow-[0_0_6px_#00f2a1]" />
              <h2 className="text-[11px] font-black tracking-wider uppercase text-white">Top Traders</h2>
            </div>
            <span className="text-[8px] text-zinc-500 uppercase">Ranked by Total PnL</span>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0a0b0e] z-10 border-b border-white/5">
                <tr className="text-[8px] text-zinc-500 uppercase tracking-wider">
                  <th className="py-1.5 px-2 w-8 text-center">#</th>
                  <th className="py-1.5 px-2">Trader</th>
                  <th className="py-1.5 px-2 text-right">Win Rate</th>
                  <th className="py-1.5 px-2 text-right">Total PnL</th>
                  <th className="py-1.5 px-2 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {MOCK_TRADERS.map((item) => (
                  <tr key={item.rank} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-1.5 px-2 text-center font-black">
                      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] ${
                        item.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        item.rank === 2 ? 'bg-zinc-300/20 text-zinc-200 border border-zinc-300/40' :
                        item.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                        'text-zinc-500'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <img src={item.avatar} alt="" className="w-5 h-5 rounded-full bg-zinc-800" />
                        <span className="font-bold text-white group-hover:text-[#00f2a1] transition-colors truncate max-w-[90px] sm:max-w-none">{item.handle}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-zinc-300">{item.winRate}</td>
                    <td className="py-1.5 px-2 text-right">
                      <div className="font-bold text-[#00f2a1]">{item.pnl}</div>
                      <div className="flex items-center justify-end gap-1 text-[8px]">
                        <span className="text-[#00f2a1] font-bold">{item.pnlPercent}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">{item.pnlUsd}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        className={`px-1.5 py-0.5 rounded flex items-center justify-center w-full text-[9px] font-bold transition-all ${
                          item.isFollowing
                            ? 'bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5'
                            : 'bg-[#089981]/10 hover:bg-[#089981] text-[#00f2a1] hover:text-white border border-[#089981]/30'
                        }`}
                      >
                        {item.isFollowing ? 'Following' : '+ Follow'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD 2: TOP CREATORS */}
        <div className="bg-[#121318] border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-xl h-full min-h-0">
          <div className="px-3 py-2 bg-[#0a0b0e] border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#089981] shadow-[0_0_6px_#089981]" />
              <h2 className="text-[11px] font-black tracking-wider uppercase text-white">Top Creators</h2>
            </div>
            <span className="text-[8px] text-zinc-500 uppercase">Ranked by Market Cap</span>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0a0b0e] z-10 border-b border-white/5">
                <tr className="text-[8px] text-zinc-500 uppercase tracking-wider">
                  <th className="py-1.5 px-2 w-8 text-center">#</th>
                  <th className="py-1.5 px-2">Creator</th>
                  <th className="py-1.5 px-2 text-right">Tokens</th>
                  <th className="py-1.5 px-2 text-right">Total MCap</th>
                  <th className="py-1.5 px-2 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {MOCK_CREATORS.map((item) => (
                  <tr key={item.rank} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-1.5 px-2 text-center font-black">
                      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] ${
                        item.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        item.rank === 2 ? 'bg-zinc-300/20 text-zinc-200 border border-zinc-300/40' :
                        item.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                        'text-zinc-500'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <img src={item.avatar} alt="" className="w-5 h-5 rounded-full bg-zinc-800" />
                        <span className="font-bold text-white group-hover:text-[#00f2a1] transition-colors truncate max-w-[90px] sm:max-w-none">{item.handle}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-zinc-300">{item.tokensLaunched}</td>
                    <td className="py-1.5 px-2 text-right font-bold text-[#00f2a1]">{item.totalMcap}</td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        className={`px-1.5 py-0.5 rounded flex items-center justify-center w-full text-[9px] font-bold transition-all ${
                          item.isFollowing
                            ? 'bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5'
                            : 'bg-[#089981]/10 hover:bg-[#089981] text-[#00f2a1] hover:text-white border border-[#089981]/30'
                        }`}
                      >
                        {item.isFollowing ? 'Following' : '+ Follow'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}