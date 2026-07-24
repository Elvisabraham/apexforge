import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ActiveTvStream({ streamUrl: propStreamUrl, closeStream }) {
  const [streamUrl, setStreamUrl] = useState(propStreamUrl);

  useEffect(() => {
    // If no prop is passed, fetch the current active stream from Supabase
    const fetchActiveStream = async () => {
      if (!propStreamUrl) {
        const { data, error } = await supabase
          .from('active_streams')
          .select('stream_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data && data.stream_url) {
          setStreamUrl(data.stream_url);
        }
      } else {
        setStreamUrl(propStreamUrl);
      }
    };

    fetchActiveStream();

    // Subscribe to Supabase Realtime for global stream updates
    const channel = supabase
      .channel('public:active_streams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_streams' }, (payload) => {
        if (payload.new && payload.new.stream_url) {
          setStreamUrl(payload.new.stream_url);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propStreamUrl]);

  if (!streamUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Broadcast</span>
        </div>
        <button 
          onClick={closeStream}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Video Container */}
      <div className="relative pt-[56.25%] w-full bg-black">
        <iframe
          src={streamUrl}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}