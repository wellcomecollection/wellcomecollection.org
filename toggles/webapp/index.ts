import toggleConfig, { ABTest, PublishedToggle, ToggleTypes } from './toggles';

const toggleIds = toggleConfig.toggles.map(toggle => toggle.id);
const testIds = toggleConfig.tests.map(test => test.id);

export type ToggleId = (typeof toggleIds)[number];
export type TestId = (typeof testIds)[number];

// As togglesConfig is what is served at https://toggles.wellcomecollection.org/toggles.json
// This allows methods fetching that URL to type the data fetched
export type TogglesResp = { toggles: PublishedToggle[]; tests: ABTest[] };

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
export type Toggles = Record<ToggleId | TestId, { value: boolean | undefined, type: ToggleTypes} >

