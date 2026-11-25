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

/**
 * The `?toggle=id:reset` value the website uses to delete a toggle's cookie,
 * so the person follows the public value again (including any later changes
 * to it) rather than being pinned to whatever they last set. Reserved, so
 * no phase or mode option can use it as an id (see below).
 */
export const TOGGLE_RESET_VALUE = 'reset';

/**
 * The cookie value, or `?toggle=id:off` link, that turns a toggle off for you
 * even though it's public: an experimental feature flag, or a phased flag (see
 * personalFeatureFlagValue and personalPhaseValue). Reserved, so no phase or
 * mode option can use it as an id (see below).
 */
export const TOGGLE_OFF_VALUE = 'off';

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

// Fails `yarn tsc` if a phase or mode option id is TOGGLE_RESET_VALUE or
// TOGGLE_OFF_VALUE: the website reads `?toggle=id:reset` as a reset and
// `id:off` as turning a phased flag off, so that phase/option could never be
// picked by link. `yarn deploy` runs via tsx without type checking, so run
// `yarn tsc` before deploying a new phase or mode option.
type PhaseOrModeOptionId =
  | (typeof toggleConfig.phasedFlags)[number]['phases'][number]['id']
  | (typeof toggleConfig.modes)[number]['options'][number]['id'];
type AssertNotReserved<T extends true> = T;
export type NoReservedPhaseOrModeOptionIds = AssertNotReserved<
  [
    Extract<
      PhaseOrModeOptionId,
      typeof TOGGLE_RESET_VALUE | typeof TOGGLE_OFF_VALUE
    >,
  ] extends [never]
    ? true
    : false
>;

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
  title: string;
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

/**
 * What a personal cookie, or a `?toggle=` link, says about a feature flag:
 * `true` turns it on for you, and for an experimental flag `off` turns it off
 * for you, so you can keep the version from before it went public. Anything
 * else is no preference (undefined), including `false`, which older versions
 * of the dashboard wrote and which has always meant "use the public value".
 *
 * Every place that reads one of these values should use this, so they agree
 * on what a value means.
 */
export function personalFeatureFlagValue(
  flag: { type: string },
  value: string | undefined
): boolean | undefined {
  if (value === 'true') return true;
  if (value === TOGGLE_OFF_VALUE && flag.type === 'experimental') return false;
  return undefined;
}

/**
 * What to store when a feature flag's switch is set to `isOn`, or undefined
 * when no cookie should be kept because that's what everyone already sees.
 * The counterpart of `personalFeatureFlagValue`. Only an experimental flag can
 * be off while public, and it stores that as `off`. Other flags store `false`,
 * which the site ignores.
 */
export function featureFlagCookieValue(
  flag: { type: string; defaultValue: boolean },
  isOn: boolean
): string | undefined {
  if (isOn === flag.defaultValue) return undefined;
  if (isOn) return 'true';
  return flag.type === 'experimental' ? TOGGLE_OFF_VALUE : 'false';
}

/**
 * What a personal cookie, or a `?toggle=` link, says about a phased flag: a
 * phase id picks that phase for you, and `off` turns the flag off for you once
 * a phase is public, so you can keep the version from before it was released
 * (null, which ranks below every phase). Anything else is no preference
 * (undefined), including `off` while nothing is public, since that would do
 * nothing until release and then hold you on the old version.
 *
 * Use this wherever such a value is read, so they agree on what it means.
 */
export function personalPhaseValue(
  flag: { phases: readonly { id: string }[]; defaultPhase: string | null },
  value: string | undefined
): string | null | undefined {
  if (value !== undefined && flag.phases.some(phase => phase.id === value)) {
    return value;
  }
  if (value === TOGGLE_OFF_VALUE && flag.defaultPhase !== null) return null;
  return undefined;
}

export type PhaseLadderStep = PhaseDefinition & {
  /** The chosen step, one before it (included), or one after it. */
  state: 'current' | 'included' | 'inactive';
  /** The line down to the next step, filled in as far as the chosen step. Absent on the last step. */
  line?: 'active' | 'inactive';
};

/**
 * A phased flag's steps in order, for showing which one is chosen: Off, once
 * a phase is public, then each phase. Steps are cumulative, so every step
 * before the chosen one counts as included. Nothing is chosen while nothing is
 * public and there's no personal choice.
 *
 * @param personal - the flag's personalPhaseValue, or undefined for no choice
 *   (the public phase is chosen)
 */
export function phaseLadder(
  flag: { phases: readonly PhaseDefinition[]; defaultPhase: string | null },
  personal: string | null | undefined
): PhaseLadderStep[] {
  const steps: PhaseDefinition[] = [
    ...(flag.defaultPhase !== null
      ? [
          {
            id: TOGGLE_OFF_VALUE,
            label: 'Off',
            description: `The version from before ${flag.phases[0].label}`,
          },
        ]
      : []),
    ...flag.phases,
  ];
  let chosenId: string | null;
  if (personal === undefined) chosenId = flag.defaultPhase;
  else chosenId = personal === null ? TOGGLE_OFF_VALUE : personal;
  const chosenIndex = steps.findIndex(step => step.id === chosenId);

  return steps.map((step, index) => {
    let state: PhaseLadderStep['state'] = 'inactive';
    if (index === chosenIndex) state = 'current';
    else if (index < chosenIndex) state = 'included';

    const isLast = index === steps.length - 1;
    let line: PhaseLadderStep['line'];
    if (!isLast) line = index + 1 <= chosenIndex ? 'active' : 'inactive';

    return { ...step, state, line };
  });
}

export type Toggles = {
  featureFlags: FeatureFlags;
  phasedFlags: PhasedFlags;
  tests: Tests;
  modes: Modes;
};
