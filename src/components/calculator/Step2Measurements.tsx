'use client';

import React from 'react';
import { QuoteState } from '@/types';
import { GLASS_TYPES, GLASS_THICKNESSES } from '@/data/options';
import SectionHeader from '@/components/shared/SectionHeader';
import OptionCard from '@/components/shared/OptionCard';

interface Props {
  state: QuoteState;
  update: <K extends keyof QuoteState>(key: K, value: QuoteState[K]) => void;
}

function DimensionInput({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label} (inches)</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f6ebd]"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="accent-[#0f6ebd]"
      />
    </div>
  );
}

export default function Step2Measurements({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Dimensions" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <DimensionInput label="Width" value={state.width} min={24} max={96} onChange={v => update('width', v)} />
          <DimensionInput label="Height" value={state.height} min={60} max={96} onChange={v => update('height', v)} />
        </div>
      </div>

      <div>
        <SectionHeader title="Glass Type" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {GLASS_TYPES.map(g => (
            <OptionCard
              key={g.id}
              label={g.label}
              description={g.description}
              isSelected={state.glassType === g.id}
              onClick={() => update('glassType', g.id)}
            >
              <span className="text-xs text-[#0f6ebd] font-medium">${g.priceMin}–${g.priceMax}/sqft</span>
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Glass Thickness" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {GLASS_THICKNESSES.map(t => (
            <OptionCard
              key={t.id}
              label={t.label}
              description={t.description}
              isSelected={state.glassThickness === t.id}
              onClick={() => update('glassThickness', t.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
