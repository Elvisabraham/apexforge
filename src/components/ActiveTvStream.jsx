import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';

export default function ActiveTvStream({ streamUrl: propStreamUrl, closeStream }) {
  const [streamUrl, setStreamUrl] = useState(propStreamUrl);

  // Keep state in sync with incoming prop
  useEffect(() => {
    setStreamUrl(propStreamUrl);
  }, [propStreamUrl]);

  // Fetch active stream and set up Supabase Realtime listener
  useEffect(() => {
    const fetchActiveStream = async () => {
      if (!propStreamUrl && supabase) {
        try {
          const { data } = await supabase
            .from('active_streams')
            .select('stream_url')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

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
            if (payload.new && payload.new.stream_url) {
              setStreamUrl(payload.new.stream_url);
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
  }, [propStreamUrl]);

  // Fix Close Button Handler
  const handleClose = (e) => {
    e.stopPropagation();
    setStreamUrl(null);
    if (closeStream) closeStream();
  };

  if (!streamUrl) return null;

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragElastic={0.05}
      className="fixed bottom-20 right-4 z-[999] w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
    >
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Broadcast</span>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-white p-1 rounded-full transition-colors z-50 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Video Container */}
      <div className="relative pt-[56.25%] w-full bg-black">
        <iframe
          src={streamUrl}
          className="absolute top-0 left-0 w-full h-full pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </motion.div>
  );
}