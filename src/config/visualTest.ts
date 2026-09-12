import { useLocation } from 'react-router-dom';

/** One source of truth for deterministic visual-capture mode. */
export function isVisualTestSearch(search: string) {
  return new URLSearchParams(search).get('visualTest') === 'true';
}

export function useVisualTestMode() {
  const { search } = useLocation();
  return isVisualTestSearch(search);
}
