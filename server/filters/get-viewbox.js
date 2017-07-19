export default (attrs) => {
  const viewBox = attrs.find(attr => attr.name === 'viewBox');
  const values = viewBox.value.split(' ');

  return {
    width: values[2],
    height: values[3]
  };
};
