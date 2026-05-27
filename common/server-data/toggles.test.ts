/**
 * @jest-environment node
 */
import { IncomingMessage } from 'http';

import { TogglesResp } from '@weco/toggles';

import { Context, getTogglesFromContext } from './toggles';

function createContext(
  cookies?: Record<string, string>,
  host?: string
): Context {
  const cookieString = cookies
    ? Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ')
    : '';

  return {
    req: {
      cookies: cookies || {},
      headers: {
        host: host || 'www.wellcomecollection.org',
        cookie: cookieString,
      },
    } as unknown as IncomingMessage & {
      cookies: Partial<Record<string, string>>;
    },
  };
}

// Use real toggle IDs from the config so TypeScript is happy
const stagingApiFlag = {
  id: 'stagingApi',
  title: 'Staging API',
  defaultValue: false,
  description: 'Use the staging catalogue API',
  type: 'permanent' as const,
};

const thematicBrowsingFlag = {
  id: 'thematicBrowsing',
  title: 'Thematic Browsing',
  defaultValue: true,
  description: 'Enable thematic browsing',
  type: 'permanent' as const,
};

// Use a real stage-type flag to test stage filtering
const stageOnlyFlag = {
  id: 'stagingApi',
  title: 'Staging API (stage only variant)',
  defaultValue: false,
  description: 'Stage-only flag for testing',
  type: 'stage' as const,
};

const defaultTogglesResp: TogglesResp = {
  featureFlags: [],
  tests: [],
  modes: [],
};

describe('getTogglesFromContext', () => {
  describe('featureFlags', () => {
    it('returns defaultValue when no cookie is set', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [stagingApiFlag, thematicBrowsingFlag],
      };

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(result.featureFlags.stagingApi).toBe(false);
      expect(result.featureFlags.thematicBrowsing).toBe(true);
    });

    it('returns true when cookie is "true"', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [stagingApiFlag],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_stagingApi: 'true' })
      );

      expect(result.featureFlags.stagingApi).toBe(true);
    });

    it('returns defaultValue when cookie is "false" (not false)', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [stagingApiFlag],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_stagingApi: 'false' })
      );

      // Cookie "false" doesn't match "true", so falls back to defaultValue
      expect(result.featureFlags.stagingApi).toBe(false);
    });

    it('returns defaultValue when cookie is any non-"true" string', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [thematicBrowsingFlag],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_thematicBrowsing: 'banana' })
      );

      expect(result.featureFlags.thematicBrowsing).toBe(true);
    });

    it('excludes stage-only flags on non-stage hosts', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [stageOnlyFlag],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext(undefined, 'www.wellcomecollection.org')
      );

      // Stage-only flag is filtered out on non-stage hosts
      expect(result.featureFlags.stagingApi).toBeUndefined();
    });

    it('includes stage-only flags on stage hosts', () => {
      const togglesResp: TogglesResp = {
        ...defaultTogglesResp,
        featureFlags: [stageOnlyFlag],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext(
          { toggle_stagingApi: 'true' },
          'www-stage.wellcomecollection.org'
        )
      );

      expect(result.featureFlags.stagingApi).toBe(true);
    });
  });

  describe('tests', () => {
    // getTogglesFromContext uses the test IDs dynamically, so we cast
    // the result to access arbitrary keys
    it('returns true when cookie is "true"', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        tests: [
          { id: 'sampleTest', title: 'Sample', type: 'test', range: [0, 100] },
        ],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_sampleTest: 'true' })
      );

      expect((result.tests as Record<string, unknown>).sampleTest).toBe(true);
    });

    it('returns false when cookie is "false"', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        tests: [
          { id: 'sampleTest', title: 'Sample', type: 'test', range: [0, 100] },
        ],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_sampleTest: 'false' })
      );

      expect((result.tests as Record<string, unknown>).sampleTest).toBe(false);
    });

    it('returns undefined when no cookie is set', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        tests: [
          { id: 'sampleTest', title: 'Sample', type: 'test', range: [0, 100] },
        ],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(
        (result.tests as Record<string, unknown>).sampleTest
      ).toBeUndefined();
    });

    it('returns undefined when cookie is any non-boolean string', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        tests: [
          { id: 'sampleTest', title: 'Sample', type: 'test', range: [0, 100] },
        ],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_sampleTest: 'maybe' })
      );

      expect(
        (result.tests as Record<string, unknown>).sampleTest
      ).toBeUndefined();
    });
  });

  describe('modes', () => {
    const modeDefinition = {
      id: 'kioskMode',
      title: 'Kiosk Mode',
      description: 'Select which iPad this kiosk is running on',
      options: [
        { id: 'ipad-1', label: 'iPad 1' },
        { id: 'ipad-2', label: 'iPad 2' },
      ],
    };

    it('returns undefined when no cookie is set', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        modes: [modeDefinition],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(
        (result.modes as Record<string, unknown>).kioskMode
      ).toBeUndefined();
    });

    it('returns the value when cookie matches a valid option', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        modes: [modeDefinition],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_kioskMode: 'ipad-1' })
      );

      expect((result.modes as Record<string, unknown>).kioskMode).toBe(
        'ipad-1'
      );
    });

    it('returns undefined when cookie is an empty string', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        modes: [modeDefinition],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_kioskMode: '' })
      );

      expect(
        (result.modes as Record<string, unknown>).kioskMode
      ).toBeUndefined();
    });

    it('returns undefined when cookie value is not a valid option', () => {
      const togglesResp = {
        ...defaultTogglesResp,
        modes: [modeDefinition],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_kioskMode: 'invalid-ipad' })
      );

      expect(
        (result.modes as Record<string, unknown>).kioskMode
      ).toBeUndefined();
    });
  });
});
