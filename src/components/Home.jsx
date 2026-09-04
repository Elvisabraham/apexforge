import React, { useState } from 'react';
import { 
  MessageSquare, 
  Repeat2, 
  Heart, 
  BarChart2, 
  Share2, 
  ChevronDown,
  TrendingUp,
  Flame,
  Users,
  Activity,
  Check,
  Search,
  Globe
} from 'lucide-react';
import DiscoverView from './DiscoverView';

// Professional DEX Dollar Sign (Solid vertical line "cross up down")
const DexDollarIcon = ({ className = "w-4 h-4", strokeWidth = 2.5 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

// Official Solana SVG Logo Component (Fixed Gradient Mismatch)
const SolanaIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M64.6 237.9c2.4-2.4-5.7-3.8-9.1-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.1 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol_a)"/>
    <path d="M64.6 3.8C67 1.4 70.3 0 73.7 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.1 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol_b)"/>
    {/* Fixed: changed fill="url(#sol_grad_c)" to fill="url(#sol_c)" to match the defs */}
    <path d="M332.5 120.9c-2.4-2.4-5.7-3.8-9.1-3.8H5.9c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.1 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.6-62.7z" fill="url(#sol_c)"/>
    <defs>
      <linearGradient id="sol_a" x1="363.8" y1="311.7" x2="33.4" y2="234.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="sol_b" x1="363.8" y1="77.6" x2="33.4" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="sol_c" x1="33.4" y1="194.7" x2="363.8" y2="117.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

// X (Twitter) Logo Icon
const XIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Telegram Icon
const TelegramIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

// SHARED DATA POOL
const defaultNewTokens = [
  { id: 1, symbol: 'FRESH', name: 'fresh token', mc: '$5.2K', vol: '$1.1K', sol: '0.1', progress: 14, holders: 4, txCount: 12, time: '2s' },
  { id: 2, symbol: 'BABY', name: 'baby coin', mc: '$6.8K', vol: '$2.4K', sol: '0.1', progress: 22, holders: 9, txCount: 28, time: '14s' },
  { id: 3, symbol: 'NEWBIE', name: 'newbie', mc: '$8.1K', vol: '$3.5K', sol: '0.1', progress: 35, holders: 14, txCount: 45, time: '45s' },
  { id: 4, symbol: 'START', name: 'starting up', mc: '$10.5K', vol: '$5.2K', sol: '0.1', progress: 44, holders: 21, txCount: 60, time: '1m' },
  { id: 5, symbol: 'ALPHA', name: 'alpha launch', mc: '$12.4K', vol: '$7.8K', sol: '0.1', progress: 52, holders: 32, txCount: 95, time: '2m' }
];

const defaultMigratingTokens = [
  { id: 6, symbol: 'YAYA', name: 'yayayaya', mc: '$45.4K', vol: '$32.4K', sol: '0.1', progress: 82, holders: 64, txCount: 242, time: '5m' },
  { id: 7, symbol: 'HHHH', name: 'hduhx', mc: '$51.2K', vol: '$38.9K', sol: '0.1', progress: 88, holders: 78, txCount: 310, time: '8m' },
  { id: 8, symbol: 'KMDFKEML', name: 'jefl,lg', mc: '$58.7K', vol: '$45.1K', sol: '0.1', progress: 94, holders: 92, txCount: 405, time: '12m' },
  { id: 9, symbol: 'JUHSJUOADS', name: 'kzmxszl', mc: '$62.1K', vol: '$50.2K', sol: '0.1', progress: 98, holders: 115, txCount: 520, time: '15m' },
  { id: 10, symbol: 'UJHIOIRJD', name: 'jxvoifkdk', mc: '$63.8K', vol: '$55.4K', sol: '0.1', progress: 99, holders: 128, txCount: 612, time: '18m' }
];

const defaultMigratedTokens = [
  { id: 11, symbol: 'JAKMC', name: 'kdvl', mc: '$69.0K', vol: '$80.4K', sol: '0.1', progress: 100, holders: 150, txCount: 842, time: '1h' },
  { id: 12, symbol: 'SENDIT', name: 'send it', mc: '$120.5K', vol: '$150.2K', sol: '0.1', progress: 100, holders: 340, txCount: 1520, time: '2h' }
];

export function TokenCard({ token = {}, onClick, onQuickBuy, isActive = false }) {
  const ticker = (token.symbol || 'YAYA').replace('$', '').toUpperCase();
  const name = (token.name || token.handle || 'token').replace('$', '');
  const progressVal = token.progress !== undefined 
    ? parseInt(token.progress, 10) 
    : parseInt(token.bondingCurvePct || '82', 10);

  const rectSize = 58;
  const rx = 16;
  const strokeWidth = 2.5; 
  const perimeter = 2 * (rectSize + rectSize) - 8 * rx + 2 * Math.PI * rx;
  const strokeDashoffset = perimeter - (progressVal / 100) * perimeter;

  return (
    <div 
      onClick={() => onClick && onClick(token)}
      className="py-3.5 bg-black hover:bg-[#0c0d12] transition-colors cursor-pointer flex items-center justify-between gap-3 w-full border-b border-[#1c1d22] select-none"
    >
      <div className="relative shrink-0 w-[62px] h-[62px] flex items-center justify-center p-0.5">
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 64 64">
          <rect x="3" y="3" width={rectSize} height={rectSize} rx={rx} className="stroke-[#1c1d22]" strokeWidth={strokeWidth} fill="none" />
          <rect
            x="3"
            y="3"
            width={rectSize}
            height={rectSize}
            rx={rx}
            stroke="#00FFA3"
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
          />
        </svg>

        <div className="w-[52px] h-[52px] rounded-[13px] bg-gradient-to-br from-[#121318] to-[#1a1c23] flex items-center justify-center font-black text-white text-[14px] shadow-inner overflow-hidden z-10 border border-white/5">
          {token.image || token.imagePreview ? (
            <img src={token.image || token.imagePreview} alt={ticker} className="w-full h-full object-cover" />
          ) : (
            <span>{token.icon || ticker.slice(0, 2)}</span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <h4 className="text-xs font-black text-white truncate leading-none">
            {ticker}
          </h4>
          <span className="text-[11px] text-[#089981] font-mono font-bold truncate leading-none">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <div className="flex items-center gap-1">
            <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
              <Search className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-neutral-500 font-mono font-bold leading-none">
              {token.time || token.timeAgo || '1s'}
            </span>
          </div>

          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <XIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <TelegramIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:text-[#089981] transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono pt-0.5">
          <span className="flex items-center gap-1 text-neutral-300">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{token.holders || 14}</span>
          </span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{token.txCount || 42} TX</span>
          </span>
          <span className="flex items-center gap-1 text-[#00FFA3] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progressVal}%</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-1">
        <div className="text-right font-mono">
          <p className="text-xs font-bold">
            <span className="text-[10px] text-neutral-500 mr-1 uppercase">MC</span>
            <span className="text-white">{token.mc || token.marketCap || '$18.4K'}</span>
          </p>
          <p className="text-[10px] text-neutral-500 uppercase">
            <span className="mr-1">VOL</span>
            <span className="text-neutral-300">{token.vol || token.volume || '$12.4K'}</span>
          </p>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickBuy && onQuickBuy(token);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
            isActive 
              ? 'bg-[#089981] text-black border-[#089981] scale-95 shadow-md shadow-[#089981]/20' 
              : 'bg-[#089981]/10 hover:bg-[#089981]/20 border-[#089981]/40 active:scale-95'
          }`}
        >
          <SolanaIcon className="w-3.5 h-3.5" />
          <span className="text-[#089981]">{token.sol || token.buySol || '0.1'}</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ 
  activeRoute = 'discover',
  setActiveRoute = () => {},
  trendingTokens = [], 
  migratingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  searchQuery = ''
}) {
  const [activePortfolioTab, setActivePortfolioTab] = useState('Alpha Calls');
  const [launchFilter, setLaunchFilter] = useState('New');
  const [tokenTimeframe, setTokenTimeframe] = useState('24h');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  // Engagement States
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [reposts, setReposts] = useState(28);
  const [isReposted, setIsReposted] = useState(false);
  const [comments, setComments] = useState(19);
  const [copied, setCopied] = useState(false);
  const [activeBuyBtn, setActiveBuyBtn] = useState(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setReposts(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleComment = () => setComments(prev => prev + 1);

  const handleShare = () => {
    setCopied(true);
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuySOL = (id, amount) => {
    setActiveBuyBtn(`${id}-${amount}`);
    setTimeout(() => setActiveBuyBtn(null), 600);
  };

  const filterList = (list) => list.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mintAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeNewList = trendingTokens.length > 0 ? trendingTokens : defaultNewTokens;
  const activeMigratingList = migratingTokens.length > 0 ? migratingTokens : defaultMigratingTokens;
  const activeMigratedList = graduatedTokens.length > 0 ? graduatedTokens : defaultMigratedTokens;

  const filteredTrending = filterList(activeNewList);
  const filteredMigrating = filterList(activeMigratingList);
  const filteredGraduated = filterList(activeMigratedList);

  const displayLaunches = 
    launchFilter === 'New' 
      ? filteredTrending 
      : launchFilter === 'Migrating' 
      ? filteredMigrating 
      : filteredGraduated;

  const alphaCallsData = [
    {
      id: 1,
      author: 'Elvis AI',
      handle: '@ElvisAI',
      badge: '#4 LEADERBOARD',
      timeAgo: '2m',
      multiplier: '11.6x (+1060%)',
      symbol: 'WEN',
      name: 'Wen Coin',
      ca: 'WENw7K92PqL9...pump',
      entryMC: '$120K',
      currentMC: '$1.4M',
      liquidity: '$240K',
      safetyScore: '99/100',
      text: 'Double-bottom breakout on 1m chart. Top 10 wallet concentration under 15%. Smart money accumulating fast. 🚀 📈',
      viewsCount: '14.8K',
    }
  ];

  const leaderboardData = [
    { symbol: 'ANSEM', name: 'Ansem Coin', mcap: '$272.5M', change: '+14.2%', isPositive: true, volume: '$12.4M', icon: '🐵', hot: true },
    { symbol: 'EYE', name: 'Eye Protocol', mcap: '$5.0M', change: '+8.7%', isPositive: true, volume: '$820K', icon: '👁️', hot: false },
    { symbol: 'Z500', name: 'Z500 Sol', mcap: '$876.7K', change: '-3.1%', isPositive: false, volume: '$140K', icon: '⚡', hot: false },
    { symbol: 'BULLSHIT', name: 'Bull Shit', mcap: '$1.1M', change: '+42.0%', isPositive: true, volume: '$310K', icon: '💩', hot: true },
    { symbol: 'CATE', name: 'Cate Token', mcap: '$13.1M', change: '+2.1%', isPositive: true, volume: '$2.1M', icon: '🐱', hot: false },
    { symbol: 'JIMOTHY', name: 'Jimothy AI', mcap: '$6.6M', change: '-1.4%', isPositive: false, volume: '$950K', icon: '🧸', hot: false },
    { symbol: 'LAYOOO', name: 'Layooo Coin', mcap: '$2.4M', change: '+105.8%', isPositive: true, volume: '$1.8M', icon: '🚀', hot: true },
  ];

  const currentTab = (activeRoute || 'discover').toLowerCase();

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans select-none antialiased">
      {currentTab === 'discover' ? (
        <div className="grid grid-cols-12 h-[calc(100vh-60px)] divide-y lg:divide-y-0 lg:divide-x divide-[#1c1d22] overflow-hidden">
          
          {/* LEFT COLUMN: Feed */}
          <div className="col-span-12 lg:col-span-4 bg-black flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-4 border-b border-[#1c1d22] bg-black sticky top-0 z-10">
              <div className="flex justify-between items-center text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                <span>Portfolio Balance</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">+14.2% (24h)</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {/* FIXED: The DEX Dollar sign now scales down to match the normal typography size cleanly */}
                <div className="flex items-baseline text-2xl font-black text-white tracking-tight">
                  <DexDollarIcon className="w-5 h-5 text-neutral-400 inline-block mr-0.5 self-center" strokeWidth={2.5} />
                  <span>16,613.00</span>
                </div>
                <span className="text-xs text-neutral-400 font-medium ml-1">90.19 SOL</span>
              </div>

              <div className="flex items-center gap-6 mt-4 text-xs font-bold text-neutral-400 border-b border-neutral-800/50 pb-2">
                {['Alpha Calls', 'Positions', 'Activities', 'Follows'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActivePortfolioTab(sub)}
                    className={`transition-all duration-150 relative pb-1 ${
                      activePortfolioTab === sub 
                        ? 'text-emerald-400 border-b-2 border-emerald-400' 
                        : 'hover:text-white'
                    }`}
                  >
                    {sub === 'Alpha Calls' ? '🔥 Alpha Calls' : sub}
                  </button>
                ))}
              </div>
            </div>

            {activePortfolioTab === 'Alpha Calls' && alphaCallsData.map((call) => (
              <div key={call.id} className="p-4 border-b border-[#1c1d22] bg-black hover:bg-neutral-950/50 transition-colors">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-base shadow-sm">
                      ⚡
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm hover:underline cursor-pointer">{call.author}</span>
                        <span className="text-xs text-neutral-500">{call.handle}</span>
                        <span className="text-xs text-neutral-500">·</span>
                        <span className="text-xs text-neutral-500">{call.timeAgo}</span>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-1.5 py-0.2 rounded ml-1">
                          {call.badge}
                        </span>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1 shrink-0">
                        🚀 {call.multiplier}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed mb-3">
                      {call.text}
                    </p>

                    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 mb-3">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl border-2 border-emerald-400 bg-neutral-950 p-0.5 shrink-0 overflow-hidden shadow-md shadow-emerald-500/20">
                            <div className="w-full h-full rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                              {call.symbol.slice(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            {/* FIXED: Scaled down DEX Dollar Icon for the Ticker */}
                            <div className="text-sm font-black text-white flex items-center gap-1">
                              <span className="flex items-center">
                                <DexDollarIcon className="w-3.5 h-3.5 text-neutral-300 inline-block mr-[1px]" strokeWidth={2.5} />
                                {call.symbol}
                              </span> 
                              <span className="text-neutral-400 font-medium text-xs ml-1">{call.name}</span>
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono mt-0.5">CA: {call.ca}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Entry MC</span>
                          <div className="text-xs font-bold text-emerald-400">{call.entryMC}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-neutral-800 text-neutral-400 font-mono">
                        <div><span>CURR MC</span><div className="font-bold text-white text-xs">{call.currentMC}</div></div>
                        <div><span>LIQUIDITY</span><div className="font-bold text-white text-xs">{call.liquidity}</div></div>
                        <div><span>SAFETY</span><div className="font-bold text-emerald-400 text-xs">{call.safetyScore}</div></div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {['0.1', '0.5', '1.0'].map((amt) => {
                          const btnKey = `call-${call.id}-${amt}`;
                          const isActive = activeBuyBtn === btnKey;
                          return (
                            <button
                              key={amt}
                              onClick={() => handleBuySOL(`call-${call.id}`, amt)}
                              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                                isActive
                                  ? 'bg-emerald-500 text-black border-emerald-400 scale-95 shadow-md shadow-emerald-500/20'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              <SolanaIcon className="w-3 h-3" />
                              <span>{amt} SOL</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400 text-xs max-w-md pt-1">
                      <button onClick={handleComment} className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group">
                        <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
                        <span className="text-[11px]">{comments}</span>
                      </button>
                      
                      <button onClick={handleRepost} className={`flex items-center gap-1.5 transition-colors group ${isReposted ? 'text-emerald-400 font-semibold' : 'hover:text-emerald-400'}`}>
                        <Repeat2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
                        <span className="text-[11px]">{reposts}</span>
                      </button>
                      
                      <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'}`}>
                        <Heart className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current text-rose-500' : ''}`} /> 
                        <span className="text-[11px]">{likes}</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <BarChart2 className="w-3.5 h-3.5" /> 
                        <span className="text-[11px]">{call.viewsCount}</span>
                      </div>
                      
                      <button onClick={handleShare} className="p-1 hover:text-white transition-colors">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER COLUMN: Launches Feed */}
          <div className="col-span-12 lg:col-span-5 bg-black p-4 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center shrink-0 pb-3 border-b border-[#1c1d22]">
              <h3 className="font-black text-xs text-white tracking-wider flex items-center gap-1.5 uppercase">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" /> Launches
              </h3>
              <div className="flex bg-[#121318] p-0.5 rounded-lg border border-[#1c1d22] text-xs font-bold text-neutral-400">
                {['New', 'Migrating', 'Migrated'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setLaunchFilter(filter)} 
                    className={`px-2.5 py-1 text-[11px] rounded transition-all ${
                      launchFilter === filter ? 'bg-neutral-800 text-white shadow' : 'hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
              {displayLaunches.map((token, idx) => {
                const solAmt = token.sol || '0.1';
                const btnKey = `launch-${token.id || idx}-${solAmt}`;
                const isActive = activeBuyBtn === btnKey;
                
                return (
                  <TokenCard 
                    key={token.id || idx}
                    token={{...token, sol: solAmt}} 
                    onClick={() => onTokenClick && onTokenClick(token)}
                    onQuickBuy={() => handleBuySOL(`launch-${token.id || idx}`, solAmt)}
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Tokens / Leaderboard */}
          <div className="col-span-12 lg:col-span-3 bg-black p-4 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center shrink-0 pb-3 border-b border-[#1c1d22]">
              <h3 className="font-black text-xs text-white tracking-wider flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Tokens
              </h3>
              
              <div className="relative">
                <button 
                  onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                  className="flex items-center gap-1 text-xs text-neutral-300 border border-[#1c1d22] bg-[#121318] hover:border-neutral-700 rounded-lg px-2.5 py-1 font-semibold"
                >
                  <span>{tokenTimeframe}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>
                {isTimeframeOpen && (
                  <div className="absolute right-0 mt-1 w-20 bg-[#121318] border border-[#1c1d22] rounded-lg shadow-2xl py-1 z-20 text-xs font-semibold">
                    {['1h', '6h', '24h', '7d'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => { setTokenTimeframe(tf); setIsTimeframeOpen(false); }}
                        className={`w-full text-left px-3 py-1 hover:bg-neutral-800 ${tokenTimeframe === tf ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#1c1d22] custom-scrollbar pr-1 pb-4">
              {leaderboardData.map((item, idx) => (
                <div 
                  key={item.symbol || idx}
                  onClick={() => onTokenClick && onTokenClick(item)}
                  className="flex justify-between items-center py-3 px-2 hover:bg-[#0c0d12] rounded-lg transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#121318] border border-[#1c1d22] flex items-center justify-center text-sm shrink-0 shadow-inner">
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate">{item.symbol}</span>
                        {item.hot && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">Vol {item.volume}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-white">{item.mcap}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      item.isPositive 
                        ? 'text-[#00FFA3] bg-[#00FFA3]/10 border-[#00FFA3]/20' 
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <DiscoverView 
          activeRoute={activeRoute} 
          setActiveRoute={setActiveRoute} 
          newTokens={activeNewList} 
          migratingTokens={activeMigratingList} 
          migratedTokens={activeMigratedList} 
        />
      )}
    </div>
  );
}