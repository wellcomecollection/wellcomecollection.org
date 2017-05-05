export const isFlagEnabled = (userGroup, flagName, flags) => {
  const flagConfig = flags[flagName];
  if (flagConfig) {
    return flagConfig[userGroup] || flagConfig['default'] || false;
  }
  return false;
};

// import {isFlagEnabled} from '../util/flag-status';
// isFlagEnabled('beta', 'testFlag', config.intervalCache.get('flags'));
