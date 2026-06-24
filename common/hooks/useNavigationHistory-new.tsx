import { useRouter } from 'next/router';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type HistoryContextType = {
  back: () => void;
  forward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isNavigating: boolean;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

const STORAGE_KEY = 'kiosk-navigation-history';

export const HistoryProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [stack, setStack] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const [isNavigating /*, setIsNavigating*/] = useState(false);
  const isInitialized = useRef(false);

  // Step 1: Initialize on mount - handles all page loads (fresh and full-page navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialized.current) return; // Prevent re-runs (React Strict Mode)

    const currentPath = router.asPath;
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const { stack: storedStack, index: storedIndex } = JSON.parse(stored);

        // Validate: index must be within stack bounds
        if (
          storedIndex >= 0 &&
          storedIndex < storedStack.length &&
          Array.isArray(storedStack)
        ) {
          // Check if current page matches what's at the stored index
          if (storedStack[storedIndex] === currentPath) {
            // Page reload on same page - just restore
            setStack(storedStack);
            setIndex(storedIndex);
          } else {
            // Navigated to different page via full page load - add it
            const newStack = storedStack.slice(0, storedIndex + 1);
            newStack.push(currentPath);
            setStack(newStack);
            setIndex(storedIndex + 1);
          }
          isInitialized.current = true;
          return;
        }
      } catch (error) {
        console.error('[History] Failed to restore:', error);
      }
    }

    // No valid stored state - initialize fresh
    setStack([currentPath]);
    setIndex(0);
    isInitialized.current = true;
  }, [router.asPath]);

  // TODO: Step 2 - Track client-side navigation changes
  // TODO: Step 3 - Implement back/forward
  // TODO: Step 4 - Add persistence

  return (
    <HistoryContext.Provider
      value={{
        back: () => {},
        forward: () => {},
        canGoBack: index > 0,
        canGoForward: index < stack.length - 1,
        isNavigating,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useNavigationHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx)
    throw new Error('useNavigationHistory must be used within HistoryProvider');
  return ctx;
};
