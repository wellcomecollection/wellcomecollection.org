const flagBoolean = (value) => value === 'on';

export const isFlagEnabled = (userGroup, flagName = 'default', flags = {}) => {
  const flagConfig = flags[flagName];
  if (flagConfig) {
    return flagBoolean(flagConfig[userGroup]) || flagBoolean(flagConfig['default']) || false;
  }
  return false;
};

// TODO use a shared component on both server and client
