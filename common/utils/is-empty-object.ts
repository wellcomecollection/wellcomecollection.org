const isEmptyObject = (obj?: Object): Boolean => {
  return Object.keys(obj || {}).length === 0;
};

export default isEmptyObject;
