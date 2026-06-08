'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Hero entrance is now CSS-animated (globals.css .anim-* classes)
// This avoids GSAP opacity:0 flash in React 19 + Next.js dev mode
export function useHeroAnimation() {}

export function useFAQAnimation() {
  useGSAP(() => {
    gsap.from('[data-anim="faq-heading"]', {
      scrollTrigger: {
        trigger: '[data-anim="faq-section"]',
        start: 'top 85%',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });

    gsap.from('[data-anim="faq-item"]', {
      scrollTrigger: {
        trigger: '[data-anim="faq-section"]',
        start: 'top 80%',
      },
      opacity: 0,
      y: 20,
      duration: 0.45,
      ease: 'power2.out',
      stagger: 0.09,
    });
  });
}
