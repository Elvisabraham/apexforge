import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ streamUrl: propStreamUrl, currentTokenSymbol, activePage, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: propStreamUrl, symbol: currentTokenSymbol });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  const isCreator = !creatorAddress || (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

  // Keep positionRef in sync
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Sync stream data with Supabase
  useEffect(() => {
    const fetchActiveStream = async () => {
      if (supabase) {
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
            setStreamData({ url: data.stream_url, symbol: data.token_symbol });
          } else if (!propStreamUrl) {
            setStreamData({ url: null, symbol: null });
          }
        } catch (err) {
          if (!propStreamUrl) setStreamData({ url: null, symbol: null });
        }
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
              setStreamData({ url: null, symbol: null });
            } else if (payload.new && payload.new.stream_url) {
              setStreamData({ url: payload.new.stream_url, symbol: payload.new.token_symbol });
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
  }, [currentTokenSymbol, propStreamUrl]);

  // 🚀 GLOBAL DRAG LISTENERS (Window Scope - Never drops input)
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handlePointerDown = (e) => {
    // Prevent drag when tapping buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

    isDraggingRef.current = true;
    setIsDragging(true);

    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
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

  // 🚀 SCOPE GUARD: Hide if no stream or if user is NOT strictly in the token home
  if (!streamData.url) return null;

  const validTokenPages = ['trade', 'token', 'tokenhome', 'token_home'];
  const isTokenHome = activePage && validTokenPages.includes(activePage.toLowerCase());

  if (!isTokenHome) return null;

  const isSymbolMatching = 
    !currentTokenSymbol || 
    !streamData.symbol || 
    streamData.symbol.toUpperCase() === currentTokenSymbol.toUpperCase() ||
    currentTokenSymbol.toUpperCase().includes(streamData.symbol.toUpperCase()) ||
    streamData.symbol.toUpperCase().includes(currentTokenSymbol.toUpperCase());

  if (!isSymbolMatching) return null;

  // Show restore button when closed locally
  if (streamData.closedLocally) {
    return (
      <button
        onClick={handleReOpenLocal}
        className="fixed bottom-24 right-4 z-[999] bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-full shadow-[0_0_25px_rgba(225,29,72,0.6)] flex items-center gap-2 animate-bounce border border-white/20 cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <span>🔴 Restore Live View</span>
      </button>
    );
  }

  return (
    <div 
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none'
      }}
      className="fixed bottom-20 right-4 z-[999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none animate-slideUpNative"
    >
      {/* Header Bar - Drag Handle */}
      <div 
        onPointerDown={handlePointerDown}
        className="flex justify-between items-center px-4 py-2.5 bg-[#121217] border-b border-white/10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">
            ${streamData.symbol} LIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            title="Minimize Stream View"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Container - Pointer events disabled during drag so iframe never blocks pointer movement */}
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
  );
}