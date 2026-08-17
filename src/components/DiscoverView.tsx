import React from 'react';

export default function LaunchesView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* New Tokens Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
          <span className="font-semibold text-gray-200">New</span>
          <span className="text-xs text-gray-500">...</span>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          <div className="bg-[#202024] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                DA
              </div>
              <div>
                <div className="font-medium text-sm">DARIO</div>
                <div className="text-xs text-gray-400">1m · 0.4K · TX 4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-400 font-medium">MC $4.2K</div>
              <div className="text-[10px] text-gray-500">VOL $6.2K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Migrating Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
          <span className="font-semibold text-gray-200">Migrating</span>
          <span className="text-xs text-gray-500">...</span>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          <div className="bg-[#202024] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                EO
              </div>
              <div>
                <div className="font-medium text-sm">E-Points</div>
                <div className="text-xs text-gray-400">19m · 3K · TX 164</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-400 font-medium">MC $16.3K</div>
              <div className="text-[10px] text-gray-500">VOL $93.5K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Migrated Column */}
      <div className="bg-[#18181b] border border-gray-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
          <span className="font-semibold text-gray-200">Migrated</span>
          <span className="text-xs text-gray-500">...</span>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          <div className="bg-[#202024] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold">
                GG
              </div>
              <div>
                <div className="font-medium text-sm">Grog</div>
                <div className="text-xs text-gray-400">45m · 12K · TX 194</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-400 font-medium">MC $19.4K</div>
              <div className="text-[10px] text-gray-500">VOL $65.3K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}