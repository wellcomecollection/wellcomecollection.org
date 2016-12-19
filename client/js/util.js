const KEYS = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

const nodeList = (nl) => {
  return [...nl];
};

const setPropertyPrefixed = (el, property, value) => {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);

  el.style[`Webkit${cappedProperty}`] = value;
  el.style[`moz${cappedProperty}`] = value;
  el.style[`ms${cappedProperty}`] = value;
  el.style[`o${cappedProperty}`] = value;
  el.style[property] = value;
};

export {
  nodeList,
  KEYS,
  setPropertyPrefixed
};
