'use client';

import React, { useState, useRef } from 'react';
import { useShowerCalculator } from '@/hooks/useShowerCalculator';
import Step1Configuration from './Step1Configuration';
import Step2Measurements from './Step2Measurements';
import Step3Hardware from './Step3Hardware';
import Step4Contact from './Step4Contact';
import ShowerPreview3D from '@/components/shared/ShowerPreview3D';
import NavigationButtons from '@/components/shared/NavigationButtons';
import RestartModal from '@/components/shared/RestartModal';
import { QuoteState } from '@/types';

const STEPS = [
  { label: 'Configuration', icon: '⊞' },
  { label: 'Measurements',  icon: '⊡' },
  { label: 'Hardware',      icon: '⊙' },
  { label: 'Your Info',     icon: '⊛' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }, (_, i) => {
        const done = i + 1 < current;
        const active = i + 1 === current;
        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2 px-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  done   ? 'bg-[#0f6ebd] text-white' :
                  active ? 'bg-[#0f0f0f] text-white ring-4 ring-[#0f6ebd]/20' :
                           'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block transition-colors ${
                active ? 'text-[#0f0f0f]' : done ? 'text-[#0f6ebd]' : 'text-gray-400'
              }`}>
                {STEPS[i].label}
              </span>
            </div>
            {i < total - 1 && (
              <div className={`flex-1 h-px mx-2 transition-colors ${done ? 'bg-[#0f6ebd]' : 'bg-gray-200'}`} style={{ minWidth: 24 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function validateStep4(contact: QuoteState['contact']): Partial<Record<keyof QuoteState['contact'], string>> {
  const errors: Partial<Record<keyof QuoteState['contact'], string>> = {};
  if (!contact.name.trim())  errors.name  = 'Name is required';
  if (!contact.phone.trim()) errors.phone = 'Phone is required';
  if (!contact.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.email = 'Enter a valid email';
  if (!contact.zip.trim())   errors.zip   = 'ZIP code is required';
  return errors;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-[#0f0f0f] capitalize">{value}</span>
    </div>
  );
}

export default function ShowerCalculator() {
  const {
    state, currentStep, showRestartModal, submitSuccess, isSubmitting,
    update, updateContact, goNext, goPrev, restart, setShowRestartModal,
    setSubmitSuccess, submitQuote, priceEstimate,
  } = useShowerCalculator();

  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof QuoteState['contact'], string>>>({});

  const stepContentRef = useRef<HTMLDivElement>(null);

  function handleNext() {
    if (currentStep === 4) {
      const errors = validateStep4(state.contact);
      if (Object.keys(errors).length > 0) { setContactErrors(errors); return; }
      setContactErrors({});
      submitQuote();
    } else {
      goNext();
    }
  }

  const estimate = priceEstimate();

  return (
    <>
      {showRestartModal && (
        <RestartModal onConfirm={restart} onCancel={() => setShowRestartModal(false)} />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Top bar */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100 overflow-x-auto">
          <StepIndicator current={currentStep} total={4} />
        </div>

        {/* Success banner */}
        {submitSuccess && (
          <div className="mx-6 mt-6 bg-[#e6f3fa] border border-[#0f6ebd]/20 rounded-xl px-6 py-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f6ebd] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#0f0f0f] text-sm">Quote submitted, thank you, {state.contact.name}!</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  We&apos;ll be in touch at <span className="text-[#0f6ebd]">{state.contact.email}</span> shortly.
                  {estimate && <> Your estimated range is <strong className="text-[#0f6ebd]">${estimate.min.toLocaleString()}–${estimate.max.toLocaleString()}</strong>.</>}
                </p>
              </div>
            </div>
            <button onClick={() => setSubmitSuccess(false)}
              className="text-xs text-[#0f6ebd] hover:underline shrink-0 mt-1 font-medium">
              Edit
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
          {/* Left: form */}
          <div className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
            <div ref={stepContentRef}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#0f0f0f]">{STEPS[currentStep - 1].label}</h2>
              <p className="text-sm text-gray-400 mt-0.5">Step {currentStep} of 4</p>
            </div>

            {currentStep === 1 && <Step1Configuration state={state} update={update} />}
            {currentStep === 2 && <Step2Measurements  state={state} update={update} />}
            {currentStep === 3 && <Step3Hardware       state={state} update={update} />}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Step4Contact state={state} updateContact={updateContact} errors={contactErrors} />

                {/* Summary card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Order Summary</p>
                  {state.template     && <SummaryRow label="Template"   value={state.template.replace(/-/g, ' ')} />}
                  {state.enclosureType && <SummaryRow label="Enclosure"  value={state.enclosureType} />}
                  {state.installType   && <SummaryRow label="Install"    value={state.installType} />}
                  <SummaryRow label="Dimensions" value={`${state.width}" × ${state.height}"`} />
                  {state.glassType     && <SummaryRow label="Glass"      value={state.glassType.replace(/-/g, ' ')} />}
                  {state.glassThickness && <SummaryRow label="Thickness" value={state.glassThickness} />}
                  {state.hardwareFinish && <SummaryRow label="Finish"    value={state.hardwareFinish.replace(/-/g, ' ')} />}
                  {state.handleStyle   && <SummaryRow label="Handle"     value={state.handleStyle.replace(/-/g, ' ')} />}
                </div>
              </div>
            )}

            </div>{/* end stepContentRef */}
            <NavigationButtons
              currentStep={currentStep}
              onPrev={goPrev}
              onNext={handleNext}
              onRestart={() => setShowRestartModal(true)}
              onSubmit={handleNext}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right: 3D preview */}
          <div className="bg-gray-50/60 p-4 sm:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Live Preview</p>
              <span className="text-[10px] text-gray-300 font-medium">Three.js · WebGL</span>
            </div>

            <ShowerPreview3D state={state} />

            {/* Dimension pill */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs bg-white border border-gray-100 rounded-full px-3 py-1 text-gray-500 shadow-sm">
                {state.width}" wide × {state.height}" tall
              </span>
              {state.glassType && (
                <span className="text-xs bg-white border border-gray-100 rounded-full px-3 py-1 text-[#0f6ebd] font-medium shadow-sm capitalize">
                  {state.glassType.replace(/-/g, ' ')}
                </span>
              )}
            </div>

            {/* Price — only after submit */}
            {submitSuccess && estimate && (
              <div className="bg-white rounded-xl border border-[#0f6ebd]/20 p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Estimated Range</p>
                <p className="text-3xl font-bold text-[#0f6ebd]">
                  ${estimate.min.toLocaleString()} <span className="text-gray-300 font-light">–</span> ${estimate.max.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {state.width}" × {state.height}" · {state.glassType?.replace(/-/g, ' ')} glass · final price after site visit
                </p>
              </div>
            )}

            {/* Trust note */}
            <p className="text-[10px] text-gray-300 text-center leading-relaxed">
              Your information is never shared or sold.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
