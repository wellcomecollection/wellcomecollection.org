/**
 * Chromatic modes: each one adds a snapshot of every story it applies to.
 * https://www.chromatic.com/docs/modes/
 *
 * Both are applied to every story by the project-wide `chromatic.modes`
 * parameter in preview.jsx. A story that only makes sense at one width can opt
 * out of the other in its own parameters:
 *
 *   parameters: { chromatic: { modes: { '375px': { disable: true } } } }
 *
 * The names match what Chromatic called these viewports before we moved to
 * modes, so the baselines carry over. Renaming one starts its history again.
 */
export const allModes = {
  // Below the `sm` (768px) breakpoint, so this gets the mobile styles
  '375px': { viewport: 375 },
  // Between `md` (1024px) and `lg` (1440px)
  '1200px': { viewport: 1200 },
} as const;
