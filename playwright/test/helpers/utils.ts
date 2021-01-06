import { baseUrl } from './urls';

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

export async function toggleFeature(
  toggle: string,
  condition: 'true' | 'false'
): Promise<void> {
  const toggleFeature: CookieType = {
    name: `${togglePrefix}${toggle}`,
    value: condition,
    url: baseUrl(),
    httpOnly: false,
  };

  await context.addCookies([toggleFeature]);
}
