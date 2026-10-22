/**
 * @jest-environment node
 */
import { GetServerSidePropsContext } from 'next';

import { TogglesResp } from '@weco/toggles';

import { getServerData } from '.';

const togglesResp: TogglesResp = {
  featureFlags: [],
  tests: [],
  modes: [
    {
      id: 'kioskMode',
      title: 'Kiosk mode',
      description: 'Kiosk mode',
      options: [{ id: 'devMode', label: 'Developer mode' }],
    },
  ],
} as unknown as TogglesResp;

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(async (fileName: string) =>
      fileName.endsWith('toggles.json') ? JSON.stringify(togglesResp) : '{}'
    ),
  },
}));

function createContext(
  query: Record<string, string>
): GetServerSidePropsContext {
  const headers: Record<string, string | string[]> = {};
  return {
    query,
    req: {
      headers: { host: 'www-dev.wellcomecollection.org', cookie: '' },
      cookies: {},
    },
    res: {
      getHeader: (name: string) => headers[name],
      setHeader: (name: string, value: string | string[]) => {
        headers[name] = value;
      },
    },
  } as unknown as GetServerSidePropsContext;
}

describe('getServerData', () => {
  describe('kiosk mode with no consent cookie', () => {
    it('ignores ?toggle= for kiosk mode, so no cookie or consent is granted', async () => {
      const context = createContext({ toggle: 'kioskMode:devMode' });
      const serverData = await getServerData(context);

      expect(serverData.toggles.modes.kioskMode).toBeNull();
      expect(context.res.getHeader('Set-Cookie')).toBeUndefined();
      expect(serverData.consentStatus).toEqual({
        analytics: false,
        marketing: false,
        cookieExists: false,
      });
    });

    // ?toggleOverride= lasts one render. Granting consent for it would leave
    // the browser's consent granted after a client-side navigation drops kiosk
    // mode, as nothing revokes it - so it mustn't grant in the first place.
    it('does not grant consent when ?toggleOverride= sets a kiosk mode', async () => {
      const serverData = await getServerData(
        createContext({ toggleOverride: 'kioskMode:devMode' })
      );

      expect(serverData.toggles.modes.kioskMode).toBe('devMode');
      expect(serverData.consentStatus).toEqual({
        analytics: false,
        marketing: false,
        cookieExists: false,
      });
    });
  });
});
