// @flow

export default (property: string, value: string): {} => {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);

  return {
    [`Webkit${cappedProperty}`]: value,
    [`moz${property}`]: value,
    [`ms${cappedProperty}`]: value,
    [`O${cappedProperty}`]: value,
    [property]: value
  };
};
