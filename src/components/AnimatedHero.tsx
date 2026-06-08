'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useHeroAnimation, useFAQAnimation } from '@/hooks/usePageAnimations';

// Register plugin once at module level
gsap.registerPlugin(useGSAP);

export function HeroAnimations() {
  useHeroAnimation();
  useFAQAnimation();
  return null;
}
