import React, { useState } from 'react';

export default function SettingsDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('trading');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="w-full max-w-md h-full bg-[#0E0F14] border-l border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            ⚙️ Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#16171d] rounded-xl text-xs font-bold text-zinc-400">
          {['trading', 'profile', 'security', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 rounded-lg capitalize transition-all ${
                activeTab === tab ? 'bg-[#089981] text-white' : 'hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {activeTab === 'trading' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#16171d] rounded-xl border border-white/5">
                <label className="text-zinc-400 block mb-2 font-semibold">Slippage Tolerance</label>
                <div className="flex gap-2">
                  {['0.1%', '0.5%', '1.0%'].map((val) => (
                    <button key={val} className="px-3 py-1.5 bg-zinc-800 rounded-lg text-white font-bold hover:bg-[#089981]/20 border border-white/5">
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-3 bg-[#16171d] rounded-xl text-xs text-zinc-300">
              <p className="font-semibold">Two-Factor Authentication</p>
              <p className="text-zinc-500 mt-1">Manage wallet signing permissions and key security.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}