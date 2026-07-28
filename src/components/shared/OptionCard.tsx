'use client';

import React from 'react';

interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  description?: string;
}

export default function OptionCard({ label, isSelected, onClick, children, description }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all text-left w-full ${
        isSelected
          ? 'border-2 border-[#0f6ebd] bg-[#e6f3fa] shadow-sm'
          : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {children && <div className="text-2xl">{children}</div>}
      <span className={`font-medium text-sm ${isSelected ? 'text-[#0f6ebd]' : 'text-gray-800'}`}>{label}</span>
      {description && <span className="text-xs text-gray-400 text-center leading-relaxed">{description}</span>}
    </button>
  );
}
