export async function fetchJson<T = unknown>(url: string): Promise<T> {
  return fetch(url).then(resp => resp.json());
}
