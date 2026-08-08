import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../supabaseClient';

export default function ActiveTvStream({ currentTokenSymbol, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: null, symbol: currentTokenSymbol, closedLocally: false });
  
  const modalRef = useRef(null);
  const handleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  
  // 🚀 Flexible & Normalized Creator Permission Check
  const isCreator = 
    !creatorAddress || 
    (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

  // Realtime Supabase Listener (STRICTLY FILTERED PER TOKEN)
  useEffect(() => {
    if (!currentTokenSymbol) return;

    const fetchActiveStream = async () => {
      if (supabase) {
        try {
          // 🚀 1. Exact match query instead of wildcard % search
          const { data, error } = await supabase
            .from('active_streams')
            .select('stream_url, token_symbol')
            .ilike('token_symbol', currentTokenSymbol)
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
          .on(
            'postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'active_streams'
            }, 
            (payload) => {
              if (payload.eventType === 'DELETE') {
                setStreamData({ url: null, symbol: null, closedLocally: false });
              } else if (payload.new && payload.new.stream_url) {
                // 🚀 2. Strict check: ONLY update state if the stream belongs to THIS exact token symbol!
                if (payload.new.token_symbol?.toLowerCase() === currentTokenSymbol.toLowerCase()) {
                  setStreamData({ url: payload.new.stream_url, symbol: payload.new.token_symbol, closedLocally: false });
                }
              }
            }
          )
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

  // 🚀 BULLETPROOF NATIVE TOUCH & MOUSE DRAG ENGINE
  useEffect(() => {
    const handleEl = handleRef.current;
    if (!handleEl || !streamData.url || streamData.closedLocally) return;

    const onTouchStart = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      e.preventDefault(); 
      e.stopPropagation();

      const touch = e.touches[0];
      isDraggingRef.current = true;

      dragStartRef.current = {
        x: touch.clientX - posRef.current.x,
        y: touch.clientY - posRef.current.y
      };
    };

    const onTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault(); 
      e.stopPropagation();

      const touch = e.touches[0];
      const newX = touch.clientX - dragStartRef.current.x;
      const newY = touch.clientY - dragStartRef.current.y;

      posRef.current = { x: newX, y: newY };

      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const onMouseDown = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y
      };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      posRef.current = { x: newX, y: newY };

      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`;
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    handleEl.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    handleEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      handleEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);

      handleEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [streamData.url, streamData.closedLocally]);

  const handleMinimizeLocal = (e) => {
    e.stopPropagation();
    setStreamData(prev => ({ ...prev, closedLocally: true }));
  };

  const handleRestoreLocal = (e) => {
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

  // 🔴 RESTORE LIVE VIEW PILL BUTTON
  if (streamData.closedLocally) {
    return ReactDOM.createPortal(
      <button
        onClick={handleRestoreLocal}
        className="fixed bottom-24 right-4 z-[9999999] bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-full shadow-[0_0_25px_rgba(225,29,72,0.6)] flex items-center gap-2 animate-bounce border border-white/20 cursor-pointer pointer-events-auto"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <span>🔴 Restore Live View</span>
      </button>,
      document.body
    );
  }

  // 📺 EXPANDED FLOATING PLAYER
  return ReactDOM.createPortal(
    <div 
      ref={modalRef}
      style={{ 
        transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0px)`,
        touchAction: 'none' 
      }}
      className="fixed bottom-20 right-4 z-[9999999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none pointer-events-auto"
    >
      {/* DRAGGABLE HEADER BAR */}
      <div 
        ref={handleRef}
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
            onClick={handleMinimizeLocal}
            className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Minimize Stream View"
          >
            ✕
          </button>
        </div>
      </div>

      {/* VIDEO FRAME */}
      <div className="relative pt-[56.25%] w-full bg-black pointer-events-auto">
        <iframe
          src={streamData.url}
          className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Creator Live Stream"
        ></iframe>
      </div>
    </div>,
    document.body
  );
}