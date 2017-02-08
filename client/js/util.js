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
  return Array.prototype.slice.call(nl || []);
};

const setPropertyPrefixed = (el, property, value) => {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);
  el.style[`Webkit${cappedProperty}`] = value;
  el.style[`moz${cappedProperty}`] = value;
  el.style[`ms${cappedProperty}`] = value;
  el.style[`o${cappedProperty}`] = value;
  el.style[property] = value;
};

const featureTest = (property, value, noPrefixes) => {
  // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
  const prop = property + ':';
  const el = document.createElement('test');
  const mStyle = el.style;

  if (!noPrefixes) {
    mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join(value + ';' + prop) + value + ';';
  } else {
    mStyle.cssText = prop + value;
  }
  return mStyle[ property ].indexOf(value) !== -1;
};

export {
  nodeList,
  KEYS,
  setPropertyPrefixed,
  featureTest
};
