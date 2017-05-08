const flagBoolean = (value) => {
  if (value === 'on') {
    return true;
  } else {
    return false;
  }
};

export const isFlagEnabled = (userGroup, flagName, flags) => {
  const flagConfig = flags[flagName];
  if (flagConfig) {
    return flagBoolean(flagConfig[userGroup]) || flagBoolean(flagConfig['default']) || false;
  }
  return false;
};

// TODO use a shared component on both server and client
