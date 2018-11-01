export default (path) => {
  const queryStart = path.indexOf('?');
  const queryString = queryStart > -1 && path.slice(queryStart + 1);
  const queryPairs = queryString && queryString.split('&');

  return queryPairs ? queryPairs.reduce((acc, curr) => {
    const keyVal = curr.split('=');

    return {...acc, [keyVal[0]]: keyVal[1]};
  }, {}) : {};
};
