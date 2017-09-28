const flagBoolean = (value) => value === 'on';

export const isFlagEnabled = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig === undefined) return false;

  const flagCondition = flagConfig[`${userGroup}Boolean`];

  if (flagCondition !== undefined) {
    return flagBoolean(flagCondition);
  } else if (flagConfig['defaultBoolean'] !== undefined) {
    return flagBoolean(flagConfig['defaultBoolean']);
  } else {
    return false;
  }
};

export const getFlagValue = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig === undefined) return '';
  const flagValue = flagConfig[`${userGroup}Value`];
  return flagValue;
};

// TODO use a shared component on both server and client
// Currently, if you update this file you need to update client/js/utils/flag-status.js too
