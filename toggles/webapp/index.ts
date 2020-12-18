import toggleConfig from './toggles';

const toggleIds = toggleConfig.toggles.map(toggle => toggle.id);
type ToggleId = typeof toggleIds[number];

// Don't be tempted to make the keys on this optional - keeping them
// as required means we catch dead code left over from removed toggles
export type Toggles = Record<ToggleId, boolean>;
