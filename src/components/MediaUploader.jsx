import React, { useState, useRef } from 'react';

export default function MediaUploader({ onMediaSelected, mediaType = 'image' }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedThumbnail, setExtractedThumbnail] = useState(null);
  const [uploadType, setUploadType] = useState(mediaType); // 'image' or 'video'
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setUploadType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      setPreviewUrl(result);

      if (isVideo) {
        // Extract first frame as thumbnail for token logo
        const videoElement = document.createElement('video');
        videoElement.src = result;
        videoElement.crossOrigin = 'anonymous';
        videoElement.currentTime = 0.5; // grab frame at 0.5s

        videoElement.onloadeddata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth || 320;
          canvas.height = videoElement.videoHeight || 320;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          setExtractedThumbnail(thumbnailUrl);

          // Pass media back to parent form
          if (onMediaSelected) {
            onMediaSelected({
              file,
              previewUrl: result,
              thumbnailUrl,
              type: 'video'
            });
          }
        };
      } else {
        setExtractedThumbnail(result);
        if (onMediaSelected) {
          onMediaSelected({
            file,
            previewUrl: result,
            thumbnailUrl: result,
            type: 'image'
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/15 hover:border-[#089981]/60 bg-[#121212] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden min-h-[160px] shadow-inner"
      >
        <input 
          type="file" 
          accept="image/*,video/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            {uploadType === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video 
                  src={previewUrl} 
                  className="w-full h-full object-cover opacity-80" 
                  muted 
                  loop 
                  autoPlay 
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="bg-[#089981] text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    ▶ Video Trailer Active
                  </span>
                </div>
              </div>
            ) : (
              <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {/* 🚀 FIXED: Pristine Cloud Upload Icon */}
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#089981] group-hover:border-[#089981]/40 transition-all mb-3 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-zinc-500 group-hover:text-[#089981] transition-colors">Tap to upload media</span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 opacity-50">Videos generate static logo thumbnails ⚡</span>
          </div>
        )}
      </div>
    </div>
  );
}