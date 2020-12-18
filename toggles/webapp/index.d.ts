import toggleConfig from './toggles';

const toggleIds = toggleConfig.toggles.map(toggle => toggle.id);
type ToggleId = typeof toggleIds[number];

export type Toggles = Record<ToggleId, boolean>;
