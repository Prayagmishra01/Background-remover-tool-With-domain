'use client';

import { useEffect } from 'react';
import { initGlobalErrorTracking } from '@/lib/errorTracker';

export function ErrorTrackingInitializer() {
  useEffect(() => {
    initGlobalErrorTracking();
  }, []);
  return null;
}
