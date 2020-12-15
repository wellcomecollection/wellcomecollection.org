import { baseUrl } from './urls';

export type toggleFeatureProps = {
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

const prefixToggle = 'toggle_';

export async function toggleFeature(
  toggle: string,
  condition: 'true' | 'false'
): Promise<void> {
  const toggleFeature: toggleFeatureProps = {
    name: `${prefixToggle}${toggle}`,
    value: condition,
    url: baseUrl(),
    httpOnly: false,
  };

  await context.addCookies([toggleFeature]);
}
