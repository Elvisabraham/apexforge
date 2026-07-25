import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ streamUrl: propStreamUrl, currentTokenSymbol, closeStream }) {
  const [streamUrl, setStreamUrl] = useState(propStreamUrl);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Sync internal state with prop
  useEffect(() => {
    setStreamUrl(propStreamUrl);
  }, [propStreamUrl]);

  // Fetch active stream and subscribe to Supabase Realtime
  useEffect(() => {
    const fetchActiveStream = async () => {
      if (!propStreamUrl && supabase) {
        try {
          let query = supabase
            .from('active_streams')
            .select('stream_url, token_symbol')
            .order('created_at', { ascending: false })
            .limit(1);

          if (currentTokenSymbol) {
            query = query.eq('token_symbol', currentTokenSymbol);
          }

          const { data } = await query.single();

          if (data && data.stream_url) {
            setStreamUrl(data.stream_url);
          }
        } catch (err) {
          console.log("Stream table waiting for broadcast...");
        }
      }
    };

    fetchActiveStream();

    let channel = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('public:active_streams')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'active_streams' }, (payload) => {
            const newStream = payload.new;
            if (newStream && newStream.stream_url) {
              // Filter by current token symbol if provided
              if (!currentTokenSymbol || newStream.token_symbol === currentTokenSymbol) {
                setStreamUrl(newStream.stream_url);
              }
            }
          })
          .subscribe();
      } catch (err) {
        console.log("Realtime setup skipped");
      }
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [propStreamUrl, currentTokenSymbol]);

  // --- Drag Logic (Touch & Mouse) ---
  const handlePointerDown = (e) => {
    // Don't trigger drag when clicking close button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Close Button Handler
  const handleClose = (e) => {
    e.stopPropagation();
    setStreamUrl(null);
    if (closeStream) closeStream();
  };

  if (!streamUrl) return null;

  return (
    <div 
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed bottom-20 right-4 z-[999] w-80 sm:w-96 bg-[#0c0c0e] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden select-none cursor-grab active:cursor-grabbing animate-slideUpNative"
    >
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-[#121217] border-b border-white/10">
        <div className="flex items-center gap-2 pointer-events-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Creator Live</span>
        </div>
        <button 
          onClick={handleClose}
          className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors z-50 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Video Container */}
      <div className="relative pt-[56.25%] w-full bg-black pointer-events-auto">
        <iframe
          src={streamUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Creator Live Stream"
        ></iframe>
      </div>
    </div>
  );
}