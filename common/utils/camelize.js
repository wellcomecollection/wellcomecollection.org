export default (title) => {
  const titleArray = title.toLowerCase().split(' ');

  return titleArray.reduce((acc, val, i) => {
    if (i === 0) {
      return val;
    } else {
      return acc + val.charAt(0).toUpperCase() + val.slice(1);
    }
  }, '');
};
