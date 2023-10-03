const isEmptyObject = (obj?: object): boolean => {
  return Object.keys(obj || {}).length === 0;
};

export default isEmptyObject;
