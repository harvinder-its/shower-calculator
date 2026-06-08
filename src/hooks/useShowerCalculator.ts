'use client';

import { useState, useCallback } from 'react';
import { QuoteState, Step } from '@/types';

const initialState: QuoteState = {
  template: null,
  enclosureType: null,
  installType: null,
  width: 36,
  height: 78,
  glassType: null,
  glassThickness: null,
  hardwareFinish: null,
  handleStyle: null,
  hingeType: null,
  contact: { name: '', phone: '', email: '', zip: '', notes: '' },
};

export function useShowerCalculator() {
  const [state, setState] = useState<QuoteState>(initialState);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useCallback(<K extends keyof QuoteState>(key: K, value: QuoteState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateContact = useCallback((field: keyof QuoteState['contact'], value: string) => {
    setState(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4) as Step);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1) as Step);
  }, []);

  const restart = useCallback(() => {
    setState(initialState);
    setCurrentStep(1);
    setShowRestartModal(false);
    setSubmitSuccess(false);
  }, []);

  const submitQuote = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      }
    } catch (e) {
      console.error('Quote submission failed', e);
    } finally {
      setIsSubmitting(false);
    }
  }, [state]);

  const priceEstimate = useCallback(() => {
    if (!state.glassType || !state.width || !state.height) return null;
    const sqft = (state.width * state.height) / 144;
    const ranges: Record<string, [number, number]> = {
      'clear': [45, 55],
      'low-iron': [55, 70],
      'shower-guard': [65, 85],
    };
    const [min, max] = ranges[state.glassType];
    return { min: Math.round(sqft * min), max: Math.round(sqft * max) };
  }, [state.glassType, state.width, state.height]);

  return {
    state,
    currentStep,
    showRestartModal,
    submitSuccess,
    isSubmitting,
    update,
    updateContact,
    goNext,
    goPrev,
    restart,
    setShowRestartModal,
    setSubmitSuccess,
    submitQuote,
    priceEstimate,
  };
}
