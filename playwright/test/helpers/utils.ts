import { baseUrl } from './urls';
import toggleConfig from '@weco/toggles/toggles';

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

export function makeDefaultToggleAndTestCookies(domain: string): CookieType[] {
  return [...toggleConfig.toggles, ...toggleConfig.tests].map(t => {
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
