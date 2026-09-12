import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

const visibilitySubscribers = new Set<() => void>();
const motionSubscribers = new Set<() => void>();
let visibilityListening = false;
let motionListening = false;

function notifyVisibility() { visibilitySubscribers.forEach(callback => callback()); }
function notifyMotion() { motionSubscribers.forEach(callback => callback()); }

function subscribeVisibility(callback: () => void) {
  visibilitySubscribers.add(callback);
  if (!visibilityListening) { document.addEventListener('visibilitychange', notifyVisibility); visibilityListening = true; }
  return () => {
    visibilitySubscribers.delete(callback);
    if (!visibilitySubscribers.size && visibilityListening) { document.removeEventListener('visibilitychange', notifyVisibility); visibilityListening = false; }
  };
}

function subscribeMotion(callback: () => void) {
  motionSubscribers.add(callback);
  if (!motionListening) { window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', notifyMotion); motionListening = true; }
  return () => {
    motionSubscribers.delete(callback);
    if (!motionSubscribers.size && motionListening) { window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', notifyMotion); motionListening = false; }
  };
}

export function useDocumentVisible() {
  return useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);
}

/** True only while an animated component is on-screen, the tab is visible and motion is allowed. */
export function useAnimationActivity(ref: RefObject<Element | null>, enabled = true) {
  const documentVisible = useDocumentVisible();
  const reducedMotion = useReducedMotion();
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return enabled && documentVisible && inViewport && !reducedMotion;
}
