import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ currentTokenSymbol, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: null, symbol: currentTokenSymbol, closedLocally: false });
  
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  const isCreator = !creatorAddress || (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

  // Realtime Supabase Listener
  useEffect(() => {
    if (!currentTokenSymbol) return;

    const fetchActiveStream = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('active_streams')
            .select('stream_url, token_symbol')
            .ilike('token_symbol', `%${currentTokenSymbol}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && data && data.stream_url) {
            setStreamData({ url: data.stream_url, symbol: data.token_symbol, closedLocally: false });
          } else {
            setStreamData({ url: null, symbol: null, closedLocally: false });
          }
        } catch (err) {
          setStreamData({ url: null, symbol: null, closedLocally: false });
        }
      }
    };

    fetchActiveStream();

    let channel = null;
    if (supabase) {
      try {
        channel = supabase
          .channel(`token_stream_${currentTokenSymbol}`)
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

  // 🚀 TOUCH & MOUSE DRAG ENGINE
  const startDrag = (clientX, clientY, target) => {
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX - pos.x,
      y: clientY - pos.y
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    setPos({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y
    });
  };

  const endDrag = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
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

  if (!streamData.url) return null;

  // Restore Pill when closed locally
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
      {/* 🚀 INVISIBLE DRAG SHIELD: Blocks YouTube/Chart from stealing finger input during drag */}
      {isDragging && (
        <div 
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={endDrag}
          className="fixed inset-0 z-[999998] bg-transparent cursor-grabbing select-none touch-none" 
        />
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
          onMouseDown={(e) => startDrag(e.clientX, e.clientY, e.target)}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target)}
          onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={endDrag}
          className="flex justify-between items-center px-4 py-3 bg-[#121217] border-b border-white/10 cursor-grab active:cursor-grabbing select-none pointer-events-auto touch-none"
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
            className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Creator Live Stream"
          ></iframe>
        </div>
      </div>
    </>
  );
}