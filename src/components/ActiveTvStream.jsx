import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ currentTokenSymbol, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: null, symbol: currentTokenSymbol });
  
  const modalRef = useRef(null);
  const handleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

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
            setStreamData({ url: data.stream_url, symbol: data.token_symbol });
          } else {
            setStreamData({ url: null, symbol: null });
          }
        } catch (err) {
          setStreamData({ url: null, symbol: null });
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
  }, [currentTokenSymbol]);

  // 🚀 BULLETPROOF NATIVE TOUCH & MOUSE DRAG ENGINE
  useEffect(() => {
    const handleEl = handleRef.current;
    if (!handleEl || !streamData.url) return;

    const onTouchStart = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      
      // Stop screen scrolling while dragging
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
      e.preventDefault(); // CRITICAL: Overrides mobile browser pull-to-refresh & screen scroll
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

    // Mouse handlers for desktop browser
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

    // Attach non-passive native listeners
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
  }, [streamData.url]);

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

  if (!streamData.url) return null;

  return ReactDOM.createPortal(
    <div 
      ref={modalRef}
      style={{ touchAction: 'none' }}
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
            onClick={handleCloseLocal}
            className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Stream"
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