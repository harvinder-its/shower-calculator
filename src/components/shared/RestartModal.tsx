'use client';

import React from 'react';

interface RestartModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RestartModal({ onConfirm, onCancel }: RestartModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <div className="w-10 h-10 rounded-full bg-[#e6f3fa] flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#0f6ebd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#0f0f0f] mb-1">Start over?</h2>
        <p className="text-sm text-gray-500 mb-6">All your selections will be cleared and you'll return to step 1.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#0f6ebd] text-white text-sm font-medium hover:bg-[#005a87] transition-colors">
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
