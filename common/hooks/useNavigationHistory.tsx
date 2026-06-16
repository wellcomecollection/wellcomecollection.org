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
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [stack, setStack] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const isNavigatingRef = useRef(false);
  const indexRef = useRef(-1);

  // Keep indexRef in sync with index state
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const pathname = router.asPath;

    // If we initiated this navigation via back/forward, don't modify the stack
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    setStack(prev => {
      const newStack = prev.slice(0, indexRef.current + 1);
      newStack.push(pathname);
      return newStack;
    });
    setIndex(i => i + 1);
  }, [router.asPath]);

  const back = () => {
    if (index > 0) {
      isNavigatingRef.current = true;
      setIndex(i => i - 1);
      window.history.back();
    }
  };

  const forward = () => {
    if (index < stack.length - 1) {
      isNavigatingRef.current = true;
      setIndex(i => i + 1);
      window.history.forward();
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        back,
        forward,
        canGoBack: index > 0,
        canGoForward: index < stack.length - 1,
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
