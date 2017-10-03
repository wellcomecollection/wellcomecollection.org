const flagBoolean = (value) => value === 'on';

export const isFlagEnabled = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig === undefined) return false;

  const flagCondition = flagConfig[userGroup];
  if (flagCondition !== undefined) {
    return flagBoolean(flagCondition.status);
  } else if (flagConfig['default'] !== undefined) {
    return flagBoolean(flagConfig['default'].status);
  } else {
    return false;
  }
};

export const getFlagValue = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig !== undefined) {
    const flagValue = flagConfig[userGroup] ? flagConfig[userGroup].value : null;
    return flagValue;
  }
};

// TODO use a shared component on both server and client
// Currently, if you update this file you need to update server/util/flag-status.js too

