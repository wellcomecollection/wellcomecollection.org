import { getCleanRedirectURL, getGuidesRedirections } from './digital-guides';

const baseUrl = '/guides/exhibitions/ZrHvtxEAACYAWmfc';
const userPreferenceGuideType = 'bsl';

describe('getGuidesRedirections', () => {
  it('does not redirect if usingQRCode is missing', () => {
    // Mock userPreferenceGuideType cookie
    document.cookie = 'WC_userPreferenceGuideType=bsl';

    const result = getGuidesRedirections({
      query: { stopNumber: '2' },
      req: undefined,
      res: undefined,
      resolvedUrl: `${baseUrl}?stopNumber=2`,
    });

    expect(result).toBe(undefined);
  });

  it('does not redirect if userPreferenceGuideType is not set yet', () => {
    // Mock userPreferenceGuideType cookie as empty
    document.cookie = 'WC_userPreferenceGuideType=';

    const result = getGuidesRedirections({
      query: { usingQRCode: 'true', stopNumber: '2' },
      req: undefined,
      res: undefined,
      resolvedUrl: `${baseUrl}?usingQRCode=true&stopNumber=2`,
    });

    expect(result).toBe(undefined);
  });

  it('does not redirect if stopNumber query param is not a number', () => {
    // Mock userPreferenceGuideType cookie
    document.cookie = 'WC_userPreferenceGuideType=bsl';

    const result = getGuidesRedirections({
      query: { usingQRCode: 'true', stopNumber: 'abc' },
      req: undefined,
      res: undefined,
      resolvedUrl: `${baseUrl}?usingQRCode=true&stopNumber=abc`,
    });

    expect(result).toBe(undefined);
  });

  it('redirects legacy exhibition guides', () => {
    // Mock userPreferenceGuideType cookie
    document.cookie = 'WC_userPreferenceGuideType=bsl';

    const result = getGuidesRedirections({
      query: {
        id: 'ZHXyDBQAAMCZbr6n',
        type: 'audio-without-descriptions',
        usingQRCode: 'true',
        stopId: 'abc',
      },
      req: undefined,
      res: undefined,
      resolvedUrl: `${baseUrl}/bsl?usingQRCode=true&stopNumber=abc`,
    });

    expect(result?.redirect?.destination).toBe(
      `${baseUrl}/bsl?usingQRCode=true&stopNumber=abc`
    );
  });
});

describe('getCleanRedirectURL', () => {
  it('provides a valid redirection URL, no matter the order of the query params', () => {
    const stopNumberFirst = getCleanRedirectURL(
      `${baseUrl}?stopNumber=3&usingQRCode=true&foo=bar`,
      userPreferenceGuideType
    );
    expect(stopNumberFirst).toBe(`${baseUrl}/bsl/3?usingQRCode=true&foo=bar`);

    const randomParamFirst = getCleanRedirectURL(
      `${baseUrl}?foo=bar&stopNumber=3&usingQRCode=true`,
      userPreferenceGuideType
    );
    expect(randomParamFirst).toBe(`${baseUrl}/bsl/3?foo=bar&usingQRCode=true`);
  });

  it('redirects to the type landing page only if stopNumber is 1, keeping the query parameter', () => {
    const stopNumberisOne = getCleanRedirectURL(
      `${baseUrl}?stopNumber=1&usingQRCode=true`,
      userPreferenceGuideType
    );
    expect(stopNumberisOne).toBe(
      `${baseUrl}/bsl?stopNumber=1&usingQRCode=true`
    );
  });
});
