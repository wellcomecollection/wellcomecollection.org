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

describe('getTogglesFromContext', () => {
  describe('featureFlags', () => {
    it('returns defaultValue when no cookie is set', () => {
      const togglesResp: TogglesResp = {
        featureFlags: [stagingApiFlag, thematicBrowsingFlag],
        tests: [],
      };

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(result.featureFlags.stagingApi).toBe(false);
      expect(result.featureFlags.thematicBrowsing).toBe(true);
    });

    it('returns true when cookie is "true"', () => {
      const togglesResp: TogglesResp = {
        featureFlags: [stagingApiFlag],
        tests: [],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_stagingApi: 'true' })
      );

      expect(result.featureFlags.stagingApi).toBe(true);
    });

    it('returns defaultValue when cookie is "false" (not false)', () => {
      const togglesResp: TogglesResp = {
        featureFlags: [stagingApiFlag],
        tests: [],
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
        featureFlags: [thematicBrowsingFlag],
        tests: [],
      };

      const result = getTogglesFromContext(
        togglesResp,
        createContext({ toggle_thematicBrowsing: 'banana' })
      );

      expect(result.featureFlags.thematicBrowsing).toBe(true);
    });

    it('excludes stage-only flags on non-stage hosts', () => {
      const togglesResp: TogglesResp = {
        featureFlags: [stageOnlyFlag],
        tests: [],
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
        featureFlags: [stageOnlyFlag],
        tests: [],
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
        featureFlags: [],
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
        featureFlags: [],
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
        featureFlags: [],
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
        featureFlags: [],
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

  describe('backward compatibility', () => {
    it('supports the old JSON format with toggles field', () => {
      const togglesResp = {
        toggles: [stagingApiFlag],
        tests: [],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(result.featureFlags.stagingApi).toBe(false);
    });

    it('prefers featureFlags over toggles if both are present', () => {
      const togglesResp = {
        featureFlags: [stagingApiFlag],
        toggles: [{ ...stagingApiFlag, id: 'oldField' }],
        tests: [],
      } as unknown as TogglesResp;

      const result = getTogglesFromContext(togglesResp, createContext());

      expect(result.featureFlags.stagingApi).toBe(false);
      expect(
        (result.featureFlags as Record<string, unknown>).oldField
      ).toBeUndefined();
    });
  });
});
