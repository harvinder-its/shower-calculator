'use client';

import React from 'react';
import { QuoteState } from '@/types';
import { TEMPLATES, ENCLOSURE_TYPES, INSTALL_TYPES } from '@/data/options';
import SectionHeader from '@/components/shared/SectionHeader';

interface Props {
  state: QuoteState;
  update: <K extends keyof QuoteState>(key: K, value: QuoteState[K]) => void;
}

export default function Step1Configuration({ state, update }: Props) {

  return (
    <div className="space-y-6">
      {/* Templates – 4-column grid with floor-plan SVG thumbnails */}
      <div>
        <SectionHeader title="Shower Template" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {TEMPLATES.map(t => {
            const selected = state.template === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => update('template', t.id)}
                title={t.description}
                data-anim="template-card"
                className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-all text-center ${
                  selected
                    ? 'border-2 border-[#0f6ebd] bg-[#e6f3fa] shadow-md'
                    : 'border border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
                }`}
              >
                {/* Floor-plan SVG thumbnail */}
                <div
                  className="w-full rounded overflow-hidden bg-white"
                  dangerouslySetInnerHTML={{ __html: t.planSvg }}
                />
                <span className="text-[10px] font-semibold text-gray-700 leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title="Enclosure Type" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {ENCLOSURE_TYPES.map(e => {
            const selected = state.enclosureType === e.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => update('enclosureType', e.id)}
                className={`flex flex-col gap-1 p-3 rounded-lg text-left transition-all ${
                  selected ? 'border-2 border-[#0f6ebd] bg-[#e6f3fa] shadow-md' : 'border border-gray-200 bg-white hover:shadow-md'
                }`}
              >
                <span className="font-semibold text-gray-800 text-sm">{e.label}</span>
                <span className="text-xs text-gray-500">{e.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title="Installation Type" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {INSTALL_TYPES.map(i => {
            const selected = state.installType === i.id;
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => update('installType', i.id)}
                className={`flex flex-col gap-1 p-3 rounded-lg text-left transition-all ${
                  selected ? 'border-2 border-[#0f6ebd] bg-[#e6f3fa] shadow-md' : 'border border-gray-200 bg-white hover:shadow-md'
                }`}
              >
                <span className="font-semibold text-gray-800 text-sm">{i.label}</span>
                <span className="text-xs text-gray-500">{i.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
