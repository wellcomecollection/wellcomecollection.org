import { baseUrl } from './urls';
import axios from 'axios';

export type CookieType = {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'None' | 'Strict';
};

const togglePrefix = 'toggle_';

export async function makeDefaultToggleAndTestCookies(
  domain: string
): Promise<CookieType[]> {
  const { data } = await axios.get(
    'https://toggles.wellcomecollection.org/toggles.json'
  );
  const { toggles, tests } = data;

  return [...toggles, ...tests].map(t => {
    return {
      name: `${togglePrefix}${t.id}`,
      value: t.defaultValue.toString(),
      domain: domain,
      path: '/',
    };
  });
}

export async function toggleFeature(
  toggle: string,
  condition: 'true' | 'false'
): Promise<void> {
  const toggleFeature: CookieType = {
    name: `${togglePrefix}${toggle}`,
    value: condition,
    url: baseUrl,
    httpOnly: false,
  };

  await context.addCookies([toggleFeature]);
}
