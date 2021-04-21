import toggleConfig from './toggles';

const toggleIds = toggleConfig.toggles.map(toggle => toggle.id);
const testIds = toggleConfig.tests.map(test => test.id);

type ToggleId = typeof toggleIds[number];
type TestId = typeof testIds[number];

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
export type Toggles = Record<ToggleId | TestId, boolean>;
