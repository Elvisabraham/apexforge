import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ streamUrl: propStreamUrl, currentTokenSymbol, activePage, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: propStreamUrl, symbol: currentTokenSymbol });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  const isCreator = !creatorAddress || (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

  // 🚀 Keep stream state strictly synced with current token page
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

  // 🚀 FIXED DRAG LOGIC (Works smoothly on Touch & Mouse)
  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    if (containerRef.current && e.pointerId) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Pointer capture release safety
      }
    }
  };

  const handleCloseLocal = (e) => {
    e.stopPropagation();
    setStreamData({ url: null, symbol: null });
    if (closeStream) closeStream();
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
    setStreamData({ url: null, symbol: null });
    if (closeStream) closeStream();
  };

  // 🚀 FLEXIBLE PAGE & TOKEN SCOPE GUARDS:
  // 1. Must have active stream URL
  if (!streamData.url) return null;

  // 2. Hide if user is NOT inside a active token/trading view
  if (activePage && activePage !== 'trade' && activePage !== 'token') return null;

  // 3. Flexible Symbol Matching (Case-Insensitive & Partial Match)
  const isSymbolMatching = 
    !currentTokenSymbol || 
    !streamData.symbol || 
    streamData.symbol.toUpperCase() === currentTokenSymbol.toUpperCase() ||
    currentTokenSymbol.toUpperCase().includes(streamData.symbol.toUpperCase()) ||
    streamData.symbol.toUpperCase().includes(currentTokenSymbol.toUpperCase());

  if (!isSymbolMatching) return null;

  return (
    <div 
      ref={containerRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed bottom-20 right-4 z-[999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none cursor-grab active:cursor-grabbing animate-slideUpNative"
    >
      {/* Header Bar - Drag Handle */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-[#121217] border-b border-white/10">
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
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Frame */}
      <div className="relative pt-[56.25%] w-full bg-black pointer-events-auto">
        <iframe
          src={streamData.url}
          className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Creator Live Stream"
        ></iframe>
      </div>
    </div>
  );
}