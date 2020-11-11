const isEmptyObject = (obj: ?Object): boolean => {
  return Object.keys(obj || {}).length === 0;
};

export default isEmptyObject;
