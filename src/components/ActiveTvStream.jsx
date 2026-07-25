import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ currentTokenSymbol, activePage, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: null, symbol: null, closedLocally: false });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  const isCreator = !creatorAddress || (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

  // 🚀 Fetch Active Stream Globally from Supabase
  useEffect(() => {
    const fetchActiveStream = async () => {
      if (!supabase) return;
      try {
        let query = supabase
          .from('active_streams')
          .select('stream_url, token_symbol')
          .order('created_at', { ascending: false })
          .limit(1);

        if (currentTokenSymbol) {
          query = query.ilike('token_symbol', `%${currentTokenSymbol}%`);
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data && data.stream_url) {
          setStreamData(prev => ({ ...prev, url: data.stream_url, symbol: data.token_symbol }));
        } else {
          setStreamData({ url: null, symbol: null, closedLocally: false });
        }
      } catch (err) {
        setStreamData({ url: null, symbol: null, closedLocally: false });
      }
    };

    fetchActiveStream();

    let channel = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('global_active_streams_listener')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'active_streams' }, (payload) => {
            if (payload.eventType === 'DELETE') {
              setStreamData({ url: null, symbol: null, closedLocally: false });
            } else if (payload.new && payload.new.stream_url) {
              setStreamData({ url: payload.new.stream_url, symbol: payload.new.token_symbol, closedLocally: false });
            }
          })
          .subscribe();
      } catch (err) {
        console.log("Realtime subscription error");
      }
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentTokenSymbol]);

  // 🚀 DRAG HANDLERS WITH POINTER CAPTURE
  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };

    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      if (e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    }
  };

  const handleCloseLocal = (e) => {
    e.stopPropagation();
    setStreamData(prev => ({ ...prev, closedLocally: true }));
    if (closeStream) closeStream();
  };

  const handleReOpenLocal = (e) => {
    e.stopPropagation();
    setStreamData(prev => ({ ...prev, closedLocally: false }));
  };

  const handleEndBroadcastGlobal = async (e) => {
    e.stopPropagation();
    if (supabase && streamData.symbol) {
      try {
        await supabase.from('active_streams').delete().eq('token_symbol', streamData.symbol);
      } catch (err) {
        console.error("Error ending broadcast:", err);
      }
    }
    setStreamData({ url: null, symbol: null, closedLocally: false });
    if (closeStream) closeStream();
  };

  // 1. Hide if no active stream in Supabase
  if (!streamData.url) return null;

  // 2. Hide on main tabs (Directory/Home, Earn, Profile, Wallet, Ranks)
  const mainTabs = ['directory', 'home', 'explore', 'earn', 'profile', 'ranks', 'wallet'];
  const currentPage = (activePage || '').toLowerCase();
  if (currentPage && mainTabs.includes(currentPage)) {
    return null;
  }

  // 3. Match symbol if currentTokenSymbol is passed
  if (currentTokenSymbol && streamData.symbol) {
    const current = currentTokenSymbol.toUpperCase();
    const stream = streamData.symbol.toUpperCase();
    if (!current.includes(stream) && !stream.includes(current)) return null;
  }

  // Restore Button if minimized locally
  if (streamData.closedLocally) {
    return (
      <button
        onClick={handleReOpenLocal}
        className="fixed bottom-24 right-4 z-[999999] bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-full shadow-[0_0_25px_rgba(225,29,72,0.6)] flex items-center gap-2 animate-bounce border border-white/20 cursor-pointer pointer-events-auto"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <span>🔴 Restore Live View</span>
      </button>
    );
  }

  return (
    <>
      {/* Invisible Screen Shield during active drag */}
      {isDragging && (
        <div className="fixed inset-0 z-[999998] cursor-grabbing select-none bg-transparent touch-none" />
      )}

      <div 
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          touchAction: 'none'
        }}
        className="fixed bottom-20 right-4 z-[999999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none animate-slideUpNative pointer-events-auto"
      >
        {/* DRAGGABLE HEADER BAR */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex justify-between items-center px-4 py-3 bg-[#121217] border-b border-white/10 cursor-grab active:cursor-grabbing select-none pointer-events-auto touch-none"
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">
              ${streamData.symbol || 'CREATOR'} LIVE
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {isCreator && (
              <button 
                onClick={handleEndBroadcastGlobal}
                className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                End Broadcast
              </button>
            )}
            <button 
              onClick={handleCloseLocal}
              className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimize Stream"
            >
              ✕
            </button>
          </div>
        </div>

        {/* VIDEO FRAME */}
        <div className={`relative pt-[56.25%] w-full bg-black ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <iframe
            src={streamData.url}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Creator Live Stream"
          ></iframe>
        </div>
      </div>
    </>
  );
}