import toggleConfig, {
  ABTest,
  ModeDefinition,
  PublishedToggle,
  ToggleTypes,
} from './toggles';

export type FeatureFlagId = (typeof toggleConfig.featureFlags)[number]['id'];
export type TestId = (typeof toggleConfig.tests)[number]['id'];
export type ModeId = (typeof toggleConfig.modes)[number]['id'];

// As togglesConfig is what is served at https://toggles.wellcomecollection.org/toggles.json
// This allows methods fetching that URL to type the data fetched
export type TogglesResp = {
  featureFlags: PublishedToggle[];
  tests: ABTest[];
  modes: readonly ModeDefinition[];
};

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
type FeatureFlagOrTestValue = { value: boolean | undefined; type: ToggleTypes };
type ModeValue = {
  value: Record<string, unknown> | undefined;
  type: 'mode';
};
type ToggleValue = FeatureFlagOrTestValue | ModeValue;

export type Toggles = Record<FeatureFlagId | TestId | ModeId, ToggleValue>;
