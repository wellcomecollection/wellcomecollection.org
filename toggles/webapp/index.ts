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

/** A mode value is the selected option string, or undefined if inactive */
export type ModeValue = string | undefined;
export type Modes = Record<ModeId, ModeValue>;

export type Toggles = {
  featureFlags: FeatureFlags;
  tests: Tests;
  modes: Modes;
};
