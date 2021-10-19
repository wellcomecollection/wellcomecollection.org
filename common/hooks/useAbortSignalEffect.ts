import { DependencyList, EffectCallback, useEffect } from 'react';

export const abortErrorHandler = (error: Error): void => {
  if (error.name !== 'AbortError') {
    throw error;
  }
};

export const useAbortSignalEffect = (
  callback: (abortSignal: AbortSignal) => ReturnType<EffectCallback>,
  dependencies?: DependencyList
): void =>
  useEffect(() => {
    const abortController = new AbortController();
    const cbReturn = callback(abortController.signal);
    return () => {
      if (cbReturn) {
        cbReturn();
      }
      abortController.abort();
    };
  }, dependencies);
