const KEYS = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27
};

const nodeList = (nl) => {
  const t = Array.prototype.slice.call(nl || []);
  return t;
};

export { nodeList, KEYS };
