import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

/**
 * Pre-typed version of `useDispatch` — avoids repeating the generic
 * `useDispatch<AppDispatch>()` call throughout the codebase.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Pre-typed version of `useSelector` — infers state shape from `RootState`.
 */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
