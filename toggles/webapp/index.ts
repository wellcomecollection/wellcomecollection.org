import toggleConfig, {
  ABTest,
  PublishedFeatureFlag,
  ToggleTypes,
} from './toggles';

export type FeatureFlagId = (typeof toggleConfig.featureFlags)[number]['id'];
export type TestId = (typeof toggleConfig.tests)[number]['id'];
// Backward compatibility alias
export type ToggleId = FeatureFlagId;

// As togglesConfig is what is served at https://toggles.wellcomecollection.org/toggles.json
// This allows methods fetching that URL to type the data fetched
export type TogglesResp = {
  featureFlags: PublishedFeatureFlag[];
  tests: ABTest[];
};

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
export type Toggles = Record<
  ToggleId | TestId,
  { value: boolean | undefined; type: ToggleTypes }
>;
