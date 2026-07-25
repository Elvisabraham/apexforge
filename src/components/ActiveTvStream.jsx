import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ currentTokenSymbol, creatorAddress, closeStream }) {
  const { publicKey } = useWallet();
  const [streamData, setStreamData] = useState({ url: null, symbol: currentTokenSymbol });
  const [isDragging, setIsDragging] = useState(false);

  const modalRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  const connectedAddress = publicKey ? publicKey.toBase58() : null;
  
  // 🚀 Flexible Creator Check: Case-insensitive match or fallback if creator address is missing
  const isCreator = 
    !creatorAddress || 
    (connectedAddress && connectedAddress.toLowerCase() === creatorAddress.toLowerCase());

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
        console.log("Realtime error");
      }
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentTokenSymbol]);

  // 🚀 DIRECT DOM DRAG HANDLERS (Native Touch & Mouse)
  const handleTouchStart = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    setIsDragging(true);

    dragStartRef.current = {
      x: touch.clientX - currentPosRef.current.x,
      y: touch.clientY - currentPosRef.current.y
    };
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    
    const newX = touch.clientX - dragStartRef.current.x;
    const newY = touch.clientY - dragStartRef.current.y;

    currentPosRef.current = { x: newX, y: newY };

    if (modalRef.current) {
      modalRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    isDraggingRef.current = true;
    setIsDragging(true);

    dragStartRef.current = {
      x: e.clientX - currentPosRef.current.x,
      y: e.clientY - currentPosRef.current.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    currentPosRef.current = { x: newX, y: newY };

    if (modalRef.current) {
      modalRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
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

  if (!streamData.url) return null;

  return ReactDOM.createPortal(
    <>
      {/* Invisible Touch Shield during Drag */}
      {isDragging && (
        <div 
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="fixed inset-0 z-[9999998] bg-transparent cursor-grabbing select-none touch-none" 
        />
      )}

      <div 
        ref={modalRef}
        className="fixed bottom-20 right-4 z-[9999999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none animate-slideUpNative pointer-events-auto touch-none"
      >
        {/* DRAGGABLE HEADER BAR */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
    </>,
    document.body
  );
}