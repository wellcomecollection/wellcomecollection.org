import { createContext, useContext } from 'react';

type ToggleStarContextValue = {
  starredIds: string[];
  onToggleStar: (id: string) => void;
  showStars: boolean;
};

const ToggleStarContext = createContext<ToggleStarContextValue | undefined>(
  undefined
);

export const ToggleStarProvider = ToggleStarContext.Provider;

// Every toggle list on this page sits under one ToggleStarProvider (see
// index.tsx) - if this throws, a new list component was added without one.
export function useToggleStar(): ToggleStarContextValue {
  const context = useContext(ToggleStarContext);
  if (!context) {
    throw new Error('useToggleStar must be used within a ToggleStarProvider');
  }
  return context;
}
