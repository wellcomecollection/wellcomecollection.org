const flagBoolean = (value) => value === 'on';

export const isFlagEnabled = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig === undefined) return false;

  const flagCondition = flagConfig[userGroup];

  if (flagCondition !== undefined) {
    return flagBoolean(flagCondition);
  } else if (flagConfig['default'] !== undefined) {
    return flagBoolean(flagConfig['default']);
  } else {
    return false;
  }
};

// TODO use a shared component on both server and client
