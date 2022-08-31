export const removeUndefinedProps = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export const printDelta = (id, delta): void => {
  console.info('------------------------');

  console.log(`Diff on ${id}:`);

  console.info('------------------------');

  console.log(delta);

  console.info('------------------------');
};
