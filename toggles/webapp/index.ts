import toggleConfig, {
  ABTest,
  ModeDefinition,
  ModeOption,
  PublishedFeatureFlag,
} from './toggles';

export type { ABTest, ModeDefinition, ModeOption, PublishedFeatureFlag };

export type FeatureFlagId = (typeof toggleConfig.featureFlags)[number]['id'];
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

export type Toggles = {
  featureFlags: FeatureFlags;
  tests: Tests;
  modes: Modes;
};
