/**
 * @jest-environment node
 */
import { GetServerSidePropsContext } from 'next';

import { TogglesResp } from '@weco/toggles';

import { getServerData } from '.';

const togglesResp: TogglesResp = {
  featureFlags: [
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      description: 'API toolbar',
      defaultValue: false,
      type: 'permanent',
    },
  ],
  tests: [],
  phasedFlags: [
    {
      id: 'imageSidebarPhases',
      title: 'Image sidebar',
      description: 'Image sidebar, phased',
      type: 'experimental',
      phases: [
        { id: 'phase1', label: 'Phase 1', description: 'Phase 1' },
        { id: 'phase2', label: 'Phase 2', description: 'Phase 2' },
      ],
      defaultPhase: null,
    },
  ],
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
  query: Record<string, string>,
  cookies: Record<string, string> = {},
  existingHeaders: Record<string, string | string[]> = {}
): GetServerSidePropsContext {
  const headers: Record<string, string | string[]> = { ...existingHeaders };
  return {
    query,
    req: {
      headers: {
        host: 'www-dev.wellcomecollection.org',
        cookie: Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join('; '),
      },
      cookies,
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
  describe('?toggle= and ?toggleOverride=', () => {
    const phase1Cookie =
      'toggle_imageSidebarPhases=phase1; Path=/; Max-Age=31536000; Domain=.wellcomecollection.org; Secure';

    it('saves a ?toggle= value as a cookie and renders with it', async () => {
      const context = createContext({ toggle: 'imageSidebarPhases:phase1' });
      const serverData = await getServerData(context);

      expect(serverData.toggles.phasedFlags.imageSidebarPhases.current).toBe(
        'phase1'
      );
      expect(context.res.getHeader('Set-Cookie')).toEqual([phase1Cookie]);
    });

    it('renders a ?toggleOverride= value without saving a cookie', async () => {
      const context = createContext({
        toggleOverride: 'imageSidebarPhases:phase1',
      });
      const serverData = await getServerData(context);

      expect(serverData.toggles.phasedFlags.imageSidebarPhases.current).toBe(
        'phase1'
      );
      expect(context.res.getHeader('Set-Cookie')).toBeUndefined();
    });

    it('keeps a Set-Cookie header that was already on the response', async () => {
      const context = createContext(
        { toggle: 'imageSidebarPhases:phase1' },
        {},
        { 'Set-Cookie': 'existing=1; Path=/' }
      );
      await getServerData(context);

      expect(context.res.getHeader('Set-Cookie')).toEqual([
        'existing=1; Path=/',
        phase1Cookie,
      ]);
    });

    it('renders a valid override over a preset, but still saves the preset', async () => {
      const context = createContext({
        toggle: 'imageSidebarPhases:phase1,apiToolbar',
        toggleOverride: 'imageSidebarPhases:phase2,apiToolbar:false',
      });
      const serverData = await getServerData(context);

      expect(serverData.toggles.phasedFlags.imageSidebarPhases.current).toBe(
        'phase2'
      );
      expect(serverData.toggles.featureFlags.apiToolbar).toBe(false);
      expect(context.res.getHeader('Set-Cookie')).toEqual([
        phase1Cookie,
        'toggle_apiToolbar=true; Path=/; Max-Age=31536000; Domain=.wellcomecollection.org; Secure',
      ]);
    });

    it('keeps the preset when the override for the same toggle is invalid', async () => {
      const context = createContext({
        toggle: 'imageSidebarPhases:phase1',
        toggleOverride: 'imageSidebarPhases:phase9',
      });
      const serverData = await getServerData(context);

      expect(serverData.toggles.phasedFlags.imageSidebarPhases.current).toBe(
        'phase1'
      );
      expect(context.res.getHeader('Set-Cookie')).toEqual([phase1Cookie]);
    });
  });

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

  describe('?toggle=id:reset', () => {
    it('deletes the cookie and renders the public value on the same request', async () => {
      const context = createContext(
        { toggle: 'imageSidebarPhases:reset' },
        { toggle_imageSidebarPhases: 'phase1' }
      );
      const serverData = await getServerData(context);

      expect(serverData.toggles.phasedFlags.imageSidebarPhases.current).toBe(
        null
      );
      expect(context.res.getHeader('Set-Cookie')).toEqual([
        'toggle_imageSidebarPhases=; Path=/; Max-Age=0; Domain=.wellcomecollection.org; Secure',
        'toggle_imageSidebarPhases=; Path=/; Max-Age=0',
      ]);
    });

    it('ignores a kiosk mode reset, which is left to the dash', async () => {
      const context = createContext(
        { toggle: 'kioskMode:reset' },
        { toggle_kioskMode: 'devMode' }
      );
      const serverData = await getServerData(context);

      expect(serverData.toggles.modes.kioskMode).toBe('devMode');
      expect(context.res.getHeader('Set-Cookie')).toBeUndefined();
    });
  });
});
