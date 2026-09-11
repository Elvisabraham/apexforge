import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path matches your project

export default function MediaUploader({ onMediaSelected, mediaType = 'image' }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadType, setUploadType] = useState(mediaType);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setUploadType(isVideo ? 'video' : 'image');
    
    // Set a temporary local preview immediately for snappy UI
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      // 1. Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // 2. Upload directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('token-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Get the permanent Public URL
      const { data: publicUrlData } = supabase.storage
        .from('token-media')
        .getPublicUrl(fileName);

      const permanentUrl = publicUrlData.publicUrl;

      // 4. Pass the permanent URL back to Launch.jsx
      if (onMediaSelected) {
        onMediaSelected({
          file,
          previewUrl: permanentUrl, // 🚀 This is now a safe, permanent https:// link!
          thumbnailUrl: permanentUrl,
          type: isVideo ? 'video' : 'image'
        });
      }
    } catch (error) {
      console.error("Storage Upload Error:", error);
      alert("Failed to upload media to Supabase. Check your bucket permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-white/15 bg-[#121212] rounded-2xl p-6 flex flex-col items-center justify-center transition-all group relative overflow-hidden min-h-[160px] shadow-inner ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#089981]/60 cursor-pointer'}`}
      >
        <input 
          type="file" 
          accept="image/*,video/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-[#00f2a1]">
            <div className="w-8 h-8 border-4 border-[#089981]/30 border-t-[#00f2a1] rounded-full animate-spin mb-2" />
            <span className="text-xs font-bold animate-pulse uppercase tracking-widest">Uploading...</span>
          </div>
        ) : previewUrl ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            {uploadType === 'video' ? (
              <video src={previewUrl} className="w-full h-full object-cover opacity-80" muted loop autoPlay playsInline />
            ) : (
              <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#089981] group-hover:border-[#089981]/40 transition-all mb-3 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-zinc-500 group-hover:text-[#089981] transition-colors">Tap to upload media</span>
          </div>
        )}
      </div>
    </div>
  );
}