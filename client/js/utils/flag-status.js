export const isFlagEnabled = (userGroup, flagName, flags) => {
  const flagConfig = flags[flagName];
  if (flagConfig) {
    return flagConfig[userGroup] || flagConfig['default'] || false;
  }
  return false;
};
