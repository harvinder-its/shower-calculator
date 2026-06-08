'use client';

import React from 'react';
import { QuoteState } from '@/types';
import { HARDWARE_FINISHES, HANDLE_STYLES, HINGE_TYPES } from '@/data/options';
import SectionHeader from '@/components/shared/SectionHeader';
import OptionCard from '@/components/shared/OptionCard';

interface Props {
  state: QuoteState;
  update: <K extends keyof QuoteState>(key: K, value: QuoteState[K]) => void;
}

export default function Step3Hardware({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Hardware Finish" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {HARDWARE_FINISHES.map(f => (
            <OptionCard
              key={f.id}
              label={f.label}
              isSelected={state.hardwareFinish === f.id}
              onClick={() => update('hardwareFinish', f.id)}
            >
              <span
                className="w-8 h-8 rounded-full border-2 border-gray-300 block"
                style={{ backgroundColor: f.hex }}
              />
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Handle Style" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {HANDLE_STYLES.map(h => (
            <OptionCard
              key={h.id}
              label={h.label}
              description={h.description}
              isSelected={state.handleStyle === h.id}
              onClick={() => update('handleStyle', h.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Hinge Type" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          {HINGE_TYPES.map(h => (
            <OptionCard
              key={h.id}
              label={h.label}
              description={h.description}
              isSelected={state.hingeType === h.id}
              onClick={() => update('hingeType', h.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
