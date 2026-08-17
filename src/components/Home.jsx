import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Home({ 
  tokens = [], 
  trendingTokens = [], 
  graduatedTokens = [], 
  onTokenClick, 
  setActivePage, 
  userProfile, 
  onOpenSidebar,
  onOpenAccountDrawer,
  onOpenNotifications 
}) {
  const [activeTab, setActiveTab] = useState('EXPLORE');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveSymbols, setLiveSymbols] = useState(new Set());
  const [dbTokens, setDbTokens] = useState([]);

  // 🚀 1. Fetch & Subscribe to Global Tokens from Supabase across ALL Devices
  useEffect(() => {
    if (!supabase) return;

    const fetchGlobalTokens = async () => {
      try {
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map(item => ({
            id: item.id || item.mint_address,
            name: item.name,
            symbol: item.symbol,
            description: item.description,
            icon: item.icon || '🔥',
            imagePreview: item.image_url,
            mintAddress: item.mint_address,
            creatorAddress: item.creator_address,
            mcap: item.market_cap || '$10.0K',
            price: '0.0001',
            change: '+0.0%',
            isGraduated: (item.progress || 0) >= 100,
            progress: item.progress || 0,
            links: item.links || {},
            created_at: item.created_at,
          }));
          setDbTokens(formatted);
        }
      } catch (err) {
        console.error("Error fetching global tokens:", err);
      }
    };

    fetchGlobalTokens();

    // Realtime Listener: Instantly push newly created tokens from ANY device to screen
    const globalTokenChannel = supabase
      .channel('global_directory_tokens')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tokens' },
        (payload) => {
          if (payload.new) {
            const item = payload.new;
            const formatted = {
              id: item.id || item.mint_address,
              name: item.name,
              symbol: item.symbol,
              description: item.description,
              icon: item.icon || '🔥',
              imagePreview: item.image_url,
              mintAddress: item.mint_address,
              creatorAddress: item.creator_address,
              mcap: item.market_cap || '$10.0K',
              price: '0.0001',
              change: '+0.0%',
              isGraduated: (item.progress || 0) >= 100,
              progress: item.progress || 0,
              links: item.links || {},
              created_at: item.created_at,
            };

            setDbTokens(prev => {
              if (prev.some(t => t.mintAddress === formatted.mintAddress)) return prev;
              return [formatted, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalTokenChannel);
    };
  }, []);

  // 🚀 2. Fetch & Subscribe to Active Streams in Supabase for Live Badges
  useEffect(() => {
    if (!supabase) return;

    const fetchActiveStreams = async () => {
      const { data, error } = await supabase
        .from('active_streams')
        .select('token_symbol');

      if (!error && data) {
        const symbols = new Set(data.map(item => item.token_symbol).filter(Boolean));
        setLiveSymbols(symbols);
      }
    };

    fetchActiveStreams();

    const channel = supabase
      .channel('home_live_badges')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_streams' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            fetchActiveStreams();
          } else if (payload.new && payload.new.token_symbol) {
            setLiveSymbols(prev => new Set([...prev, payload.new.token_symbol]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🚀 3. Deduplicate and Merge Supabase Global Tokens + Props Tokens
  const combinedTokens = [...dbTokens];
  tokens.forEach(pt => {
    const exists = combinedTokens.some(
      dt => (dt.mintAddress && pt.mintAddress && dt.mintAddress === pt.mintAddress) ||
            (dt.symbol === pt.symbol && dt.name === pt.name)
    );
    if (!exists) {
      combinedTokens.push(pt);
    }
  });

  const enrichedTokens = combinedTokens.map(t => {
    const mcapValue = parseFloat((t.mcap || t.marketCap || '$10K').replace(/[^0-9.]/g, ''));
    const isPositive = (t.change || '').includes('+') || parseFloat(t.change || 0) >= 0;
    const isLive = liveSymbols.has(t.symbol);
    return { ...t, mcapValue, isPositive, isLive };
  });

  // 🚀 4. Filter by Search Query
  const filteredTokens = enrichedTokens.filter(t => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(query) || 
           t.symbol.toLowerCase().includes(query) || 
           (t.mintAddress && t.mintAddress.toLowerCase().includes(query));
  });

  // 🚀 5. Sort Tokens into Phantom's 3 Columns!
  const newTokens = filteredTokens
    .filter(t => !t.isGraduated && t.progress < 80)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const migratingTokens = filteredTokens
    .filter(t => !t.isGraduated && t.progress >= 80)
    .sort((a, b) => b.progress - a.progress);

  const migratedTokens = filteredTokens
    .filter(t => t.isGraduated || t.progress >= 100)
    .sort((a, b) => b.mcapValue - a.mcapValue);

  return (
    <div className="flex flex-col w-full h-full bg-[#121214] text-white font-sans overflow-hidden select-none relative">
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- UNMOVABLE HEADER (Kept Exactly As Yours) --- */}
      <header className="flex-none z-50 bg-[#121214] pt-4 pb-3 px-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => { if (onOpenAccountDrawer) onOpenAccountDrawer(); }} 
              className="w-10 h-10 rounded-full border-2 border-purple-500 hover:border-white bg-[#121212] flex items-center justify-center overflow-hidden cursor-pointer transition-colors shrink-0"
            >
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.username || 'Elvis'}`} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-widest text-white uppercase">Discover</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center bg-[#18181b] border border-gray-800 rounded-xl px-4 py-3.5 focus-within:border-purple-500 transition-colors">
          <svg className="w-5 h-5 text-zinc-500 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search tokens or CAs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[15px] font-bold text-white placeholder-zinc-600 outline-none"
          />
        </div>
      </header>

      {/* --- PHANTOM DISCOVER VIEW INJECTION --- */}
      <div className="flex-1 overflow-hidden relative">
        <DiscoverView 
          newTokens={newTokens} 
          migratingTokens={migratingTokens} 
          migratedTokens={migratedTokens} 
        />
      </div>
    </div>
  );
}