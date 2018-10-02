// Flow

export function commaAnd(arr: (string | number)[]): string {
  return [
    arr.slice(0, -1).join(', '),
    arr.slice(-1)[0]
  ].join(arr.length < 2 ? '' : ' and ');
}
