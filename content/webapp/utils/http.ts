export async function fetchJson(url: string): Promise<any> {
  return fetch(url).then(resp => resp.json());
}
