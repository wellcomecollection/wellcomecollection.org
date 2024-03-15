// Thanks to https://gist.github.com/zachlysobey/71ac85046d0d533287ed85e1caa64660 !
export function partition<T>(
  array: T[],
  predicate: (val: T) => boolean
): [T[], T[]] {
  const partitioned: [T[], T[]] = [[], []];

  array.forEach((val: T) => {
    const partitionIndex: 0 | 1 = predicate(val) ? 0 : 1;
    partitioned[partitionIndex].push(val);
  });

  return partitioned;
}
