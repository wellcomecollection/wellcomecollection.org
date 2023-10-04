/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchJson(url: string): Promise<any> {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return fetch(url).then(resp => resp.json());
}
