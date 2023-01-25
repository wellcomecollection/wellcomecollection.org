export const prefixedPropertyStyleObject = (
  property: string,
  value: string
): Record<string, string> => {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);

  return {
    [`Webkit${cappedProperty}`]: value,
    [`ms${cappedProperty}`]: value,
    [`O${cappedProperty}`]: value,
    [property]: value,
  };
};
