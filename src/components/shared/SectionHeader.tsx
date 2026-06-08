import React from 'react';

export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="block w-1 h-4 rounded-full bg-[#0070a6]" />
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</h3>
    </div>
  );
}
