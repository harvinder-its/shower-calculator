'use client';

import React from 'react';
import { Step } from '@/types';

interface NavigationButtonsProps {
  currentStep: Step;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canNext?: boolean;
}

export default function NavigationButtons({
  currentStep,
  onPrev,
  onNext,
  onRestart,
  onSubmit,
  isSubmitting,
  canNext = true,
}: NavigationButtonsProps) {
  const isLast = currentStep === 4;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0070a6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ↺ Start over
        </button>
      </div>

      {isLast ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canNext}
          className="flex items-center gap-2 bg-[#0070a6] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#005a87] transition-colors disabled:opacity-40 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Submitting…
            </>
          ) : (
            <>
              Get My Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex items-center gap-2 bg-[#0070a6] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#005a87] transition-colors disabled:opacity-40 shadow-sm"
        >
          Continue
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
