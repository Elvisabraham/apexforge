import React, { useState, useRef, useEffect } from 'react';

export default function LiveModal({ isOpen, onClose, token = { symbol: 'FORGE', name: 'Apex Forge' } }) {
  const [streamMode, setStreamMode] = useState('camera'); // 'camera' or 'obs'
  const [isLive, setIsLive] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);

  // Mock RTMP Details for OBS
  const rtmpUrl = "rtmp://live.apexforge.app/broadcast";
  const streamKey = `live_${token.symbol.toLowerCase()}_${Math.random().toString(36).substring(2, 10)}`;

  // Handle Camera Access
  useEffect(() => {
    let stream = null;
    if (isOpen && streamMode === 'camera' && !isLive) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => console.log("Camera access denied or unavailable", err));
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, streamMode, isLive]);

  // Live Timer
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setStreamTime(prev => prev + 1);
      }, 1000);
    } else {
      setStreamTime(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleGoLive = () => {
    setIsLive(!isLive);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
      <div className="absolute inset-0" onClick={!isLive ? onClose : undefined}></div>
      
      <div className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Broadcast Live</h3>
          </div>
          {!isLive && (
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full">
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        {!isLive ? (
          <>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Stream directly to your holders on the <strong className="text-white">${token.symbol}</strong> bonding page and the global Watch feed.
            </p>

            {/* Mode Selection */}
            <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setStreamMode('camera')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  streamMode === 'camera' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Device Camera
              </button>
              <button 
                onClick={() => setStreamMode('obs')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  streamMode === 'obs' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                OBS / RTMP
              </button>
            </div>

            {/* Camera Preview */}
            {streamMode === 'camera' && (
              <div className="w-full h-48 bg-black rounded-2xl border border-white/10 overflow-hidden relative mb-6">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-white tracking-widest uppercase border border-white/10">
                    Camera Preview
                  </span>
                </div>
              </div>
            )}

            {/* OBS Details */}
            {streamMode === 'obs' && (
              <div className="flex flex-col gap-4 mb-6">
                <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col gap-1 relative">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">RTMP URL</span>
                  <span className="text-xs font-mono text-white truncate pr-8">{rtmpUrl}</span>
                  <button onClick={() => handleCopy(rtmpUrl)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#089981]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
                <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col gap-1 relative">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stream Key</span>
                  <span className="text-xs font-mono text-white truncate pr-8">••••••••••••••••</span>
                  <button onClick={() => handleCopy(streamKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#089981]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
                {copied && <span className="text-[10px] font-bold text-[#089981] text-center">Copied to clipboard!</span>}
              </div>
            )}

            {/* Action Button */}
            <button 
              onClick={toggleGoLive}
              className="w-full bg-[#089981] hover:bg-[#06806b] text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)] active:scale-95"
            >
              {streamMode === 'camera' ? 'Go Live Now' : 'Await Stream Connection'}
            </button>
          </>
        ) : (
          // Active Live State
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
              <span className="text-3xl">📡</span>
            </div>
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest text-center">You are Live!</h2>
            <p className="text-sm text-zinc-400 mb-8 font-mono">{formatTime(streamTime)}</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={toggleGoLive}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
              >
                End Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}