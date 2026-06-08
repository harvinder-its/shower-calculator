'use client';

import React from 'react';
import { QuoteState } from '@/types';
import SectionHeader from '@/components/shared/SectionHeader';

interface Props {
  state: QuoteState;
  updateContact: (field: keyof QuoteState['contact'], value: string) => void;
  errors: Partial<Record<keyof QuoteState['contact'], string>>;
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs font-bold leading-none flex items-center justify-center hover:bg-gray-400"
        aria-label="Info"
      >?</button>
      {show && (
        <span className="absolute left-6 top-0 z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function Field({
  label, tooltip, error, children,
}: { label: string; tooltip?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

export default function Step4Contact({ state, updateContact, errors }: Props) {
  const c = state.contact;
  return (
    <div className="space-y-6">
      <SectionHeader title="Your Information" />
      <div className="grid grid-cols-1 gap-4 mt-3">
        <Field label="Full Name *" tooltip="Used to personalize your quote" error={errors.name}>
          <input
            type="text"
            value={c.name}
            onChange={e => updateContact('name', e.target.value)}
            placeholder="Jane Smith"
            className={`border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0070a6] ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
        </Field>

        <Field label="Phone *" tooltip="We'll call to schedule your measurement" error={errors.phone}>
          <input
            type="tel"
            value={c.phone}
            onChange={e => updateContact('phone', e.target.value)}
            placeholder="(555) 555-5555"
            className={`border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0070a6] ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
          />
        </Field>

        <Field label="Email *" tooltip="Your quote PDF will be sent here" error={errors.email}>
          <input
            type="email"
            value={c.email}
            onChange={e => updateContact('email', e.target.value)}
            placeholder="jane@example.com"
            className={`border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0070a6] ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          />
        </Field>

        <Field label="ZIP Code *" tooltip="Helps us confirm service area" error={errors.zip}>
          <input
            type="text"
            value={c.zip}
            onChange={e => updateContact('zip', e.target.value)}
            placeholder="90210"
            maxLength={10}
            className={`border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0070a6] ${errors.zip ? 'border-red-400' : 'border-gray-300'}`}
          />
        </Field>

        <Field label="Additional Notes">
          <textarea
            value={c.notes}
            onChange={e => updateContact('notes', e.target.value)}
            placeholder="Any special requirements, existing tile work, etc."
            rows={3}
            className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0070a6] resize-none"
          />
        </Field>
      </div>
    </div>
  );
}
