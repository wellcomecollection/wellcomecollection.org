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
  reset: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isNavigating: boolean;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export const NAVIGATION_HISTORY_STORAGE_KEY = 'kiosk-navigation-history';

export const HistoryProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [stack, setStack] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const isInitialized = useRef(false);
  const isNavigatingRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);
  const shouldPersist = useRef(true);

  // Step 1: Initialize on mount - handles all page loads (fresh and full-page navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialized.current) return; // Prevent re-runs (React Strict Mode) - no harm doing this on prod too

    const currentPath = router.asPath;
    const stored = sessionStorage.getItem(NAVIGATION_HISTORY_STORAGE_KEY);

    if (stored) {
      try {
        const { stack: storedStack, index: storedIndex } = JSON.parse(stored);

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
        previousPathRef.current = currentPath;
        isInitialized.current = true;
        return;
      } catch (error) {
        // If restore fails, fall through to initialize fresh
        console.error('[History] Failed to restore:', error);
      }
    }

    // No valid stored state - initialize fresh
    setStack([currentPath]);
    setIndex(0);
    previousPathRef.current = currentPath;
    shouldPersist.current = true; // Re-enable persistence for fresh start
    isInitialized.current = true;
  }, [router.asPath]);

  // Step 2: Track client-side navigation changes (Next.js Link clicks)
  useEffect(() => {
    if (!isInitialized.current) return; // Don't run until initialized
    const pathname = router.asPath;

    // Skip if path hasn't actually changed
    if (previousPathRef.current === pathname) return;

    // If this was our programmatic navigation (back/forward)
    // then we don't want to add change the stack
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      setIsNavigating(false);
      previousPathRef.current = pathname;
      return;
    }

    // New client-side navigation - add to stack
    const newStack = stack.slice(0, index + 1);
    newStack.push(pathname);
    setStack(newStack);
    setIndex(index + 1);
    previousPathRef.current = pathname;
  }, [router.asPath]);

  // Step 3: Implement back/forward functions
  const back = () => {
    if (index <= 0) return; // Can't go back
    if (isNavigating) return; // Already navigating

    const targetPath = stack[index - 1];
    isNavigatingRef.current = true;
    setIsNavigating(true);
    setIndex(index - 1);
    router.replace(targetPath);
  };

  const forward = () => {
    if (index >= stack.length - 1) return; // Can't go forward
    if (isNavigating) return; // Already navigating

    const targetPath = stack[index + 1];
    isNavigatingRef.current = true;
    setIsNavigating(true);
    setIndex(index + 1);
    router.replace(targetPath);
  };

  const reset = () => {
    if (typeof window === 'undefined') return;

    // Prevent Step 4 from persisting after reset
    shouldPersist.current = false;

    // Allow Step 1 to re-initialize on next page
    isInitialized.current = false;

    // Clear in-memory state so UI updates immediately (e.g. disable back/forward)
    setStack([]);
    setIndex(-1);
    setIsNavigating(false);
    isNavigatingRef.current = false;
    previousPathRef.current = null;

    // Clear sessionStorage
    sessionStorage.removeItem(NAVIGATION_HISTORY_STORAGE_KEY);
  };

  // Step 4: Persist to sessionStorage whenever stack or index changes
  useEffect(() => {
    if (!isInitialized.current) return;
    if (typeof window === 'undefined') return;
    if (!shouldPersist.current) return; // Skip if reset was called
    if (stack.length === 0 || index < 0) return; // Don't save invalid state

    try {
      sessionStorage.setItem(
        NAVIGATION_HISTORY_STORAGE_KEY,
        JSON.stringify({ stack, index })
      );
    } catch (error) {
      console.error('[History] Failed to persist:', error);
    }
  }, [stack, index]);

  return (
    <HistoryContext.Provider
      value={{
        back,
        forward,
        reset,
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

  return (
    ctx ?? {
      back: () => {},
      forward: () => {},
      reset: () => {},
      canGoBack: false,
      canGoForward: false,
      isNavigating: false,
    }
  );
};
