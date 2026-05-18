import { IncomingMessage } from 'http';

import { TogglesResp } from '@weco/toggles';

import { Context, getTogglesFromContext } from './toggles';

const mockContext: Context = {
  req: {
    cookies: {},
  } as IncomingMessage & { cookies: Partial<Record<string, string>> },
};

Object.defineProperty(mockContext.req, 'headers', {
  value: { host: 'www.wellcomecollection.org' },
});

const stagingApiFlag = {
  id: 'stagingApi',
  title: 'Staging API',
  defaultValue: false,
  description: 'Use the staging catalogue API',
  type: 'permanent' as const,
};

describe('getTogglesFromContext', () => {
  it('supports the new JSON format with featureFlags field', () => {
    const togglesResp: TogglesResp = {
      featureFlags: [stagingApiFlag],
      tests: [],
    };

    const result = getTogglesFromContext(togglesResp, mockContext);

    expect(result).toEqual({
      stagingApi: { value: false, type: 'permanent' },
    });
  });

  it('supports the old JSON format with toggles field', () => {
    // Simulates the old S3 JSON shape before the rename
    const togglesResp = {
      toggles: [stagingApiFlag],
      tests: [],
    } as unknown as TogglesResp;

    const result = getTogglesFromContext(togglesResp, mockContext);

    expect(result).toEqual({
      stagingApi: { value: false, type: 'permanent' },
    });
  });

  it('prefers featureFlags over toggles if both are present', () => {
    const togglesResp = {
      featureFlags: [stagingApiFlag],
      toggles: [Object.assign({}, stagingApiFlag, { id: 'oldField' })],
      tests: [],
    } as unknown as TogglesResp;

    const result = getTogglesFromContext(togglesResp, mockContext);

    expect(result).toEqual({
      stagingApi: { value: false, type: 'permanent' },
    });
  });
});
