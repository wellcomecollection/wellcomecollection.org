import toggleConfig, {
  ABTest,
  ModeDefinition,
  ModeOption,
  PhaseDefinition,
  PhasedFlagDefinition,
  PublishedFeatureFlag,
  PublishedPhasedFlag,
} from './toggles';

export type {
  ABTest,
  ModeDefinition,
  ModeOption,
  PhaseDefinition,
  PhasedFlagDefinition,
  PublishedFeatureFlag,
  PublishedPhasedFlag,
};

export type FeatureFlagId = (typeof toggleConfig.featureFlags)[number]['id'];
export type PhasedFlagId = (typeof toggleConfig.phasedFlags)[number]['id'];

export type TestId = (typeof toggleConfig.tests)[number]['id'];
export type ModeId = (typeof toggleConfig.modes)[number]['id'];

// The full option IDs for the kioskMode toggle, e.g. 'devMode' | 'RR-iPad1' | 'TR-iPad1'.
// Exported so the rest of the codebase can reference kiosk option IDs without hardcoding strings.
export type KioskModeOptionId = Extract<
  (typeof toggleConfig.modes)[number],
  { id: 'kioskMode' }
>['options'][number]['id'];

// The option IDs for the cataloguePipeline mode toggle, e.g. 'axiell-collections-testing'.
// Exported so API types can derive the valid pipeline values from the toggle
// definition rather than hardcoding strings.
export type CataloguePipelineOptionId = Extract<
  (typeof toggleConfig.modes)[number],
  { id: 'cataloguePipeline' }
>['options'][number]['id'];

// Extracts the experience prefix from a kiosk option ID.
// e.g. 'RR-iPad1' -> 'RR', 'devMode' -> 'devMode'
type ExtractPrefix<T extends string> = T extends `${infer Prefix}-${string}`
  ? Prefix
  : T;
// The distinct experience prefixes derived from the kiosk cookie value, e.g. 'devMode' | 'RR' | 'TR'.
// The cookie stores the full option ID (e.g. 'RR-iPad1'); the prefix is the part before the first '-'.
// Exported for use across the codebase wherever the cookie prefix is parsed or compared.
export type KioskExperienceId = ExtractPrefix<KioskModeOptionId>;

// As togglesConfig is what is served at https://toggles.wellcomecollection.org/toggles.json
// This allows methods fetching that URL to type the data fetched
export type TogglesResp = {
  featureFlags: PublishedFeatureFlag[];
  // Optional because a toggles.json fetched before this field existed (or a
  // hand-written fallback like common/server-data/toggles.ts's
  // fallbackTogglesForApiRoutes) won't have it - always fall back to
  // `?? []` when reading it.
  phasedFlags?: PublishedPhasedFlag[];
  tests: ABTest[];
  modes: ModeDefinition[];
};

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
export type FeatureFlags = Record<FeatureFlagId, boolean | undefined>;
export type Tests = Record<TestId, boolean | undefined>;

/**
 * Modes are included in serverData returned from getServerSideProps.
 * We use null for an inactive mode because undefined values in props are not
 * JSON-serialisable in Next.js.
 */
export type ModeValue = string | null;
export type Modes = Record<ModeId, ModeValue>;

/**
 * The current phase id for a phased flag - null when nothing in it is
 * public yet (see PublishedPhasedFlag.defaultPhase).
 */
export type PhaseValue = string | null;

/**
 * What `usePhasedFlags()` returns per flag: its current value, bundled with
 * the ordered phase list needed to rank that value against a target - see
 * `phaseIsAtLeast`.
 */
export type ResolvedPhasedFlag = {
  current: PhaseValue;
  phases: readonly PhaseDefinition[];
};

export type PhasedFlags = Record<PhasedFlagId, ResolvedPhasedFlag>;

/**
 * True when a resolved phased flag's current value is at or beyond `target`
 * in its own ordered phase list. An unrecognised current value (null, or a
 * removed phase) ranks lowest, so it never satisfies a real target.
 *
 * `resolved` may be undefined if this flag hasn't been published yet (i.e.
 * `usePhasedFlags()` was called before `yarn deploy` ran from toggles/webapp)
 * - that's treated the same as not having reached any phase, the same way a
 * feature flag reads as falsy before it exists remotely.
 *
 * @param resolved - a value from `usePhasedFlags()`
 * @param target - the phase being asked about, e.g. `'phase2'`
 */
export function phaseIsAtLeast(
  resolved: ResolvedPhasedFlag | undefined,
  target: string
): boolean {
  if (!resolved) return false;
  const targetIndex = resolved.phases.findIndex(p => p.id === target);
  if (targetIndex === -1) return false;
  const currentIndex = resolved.phases.findIndex(
    p => p.id === resolved.current
  );
  return currentIndex >= targetIndex;
}

export type Toggles = {
  featureFlags: FeatureFlags;
  phasedFlags: PhasedFlags;
  tests: Tests;
  modes: Modes;
};
