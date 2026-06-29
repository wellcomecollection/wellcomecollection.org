jest.mock('cookies-next', () => ({
  getCookies: jest.fn(),
}));

jest.mock('@weco/common/contexts/KioskContext', () => ({
  isValidKioskMode: jest.fn(),
}));

import { getCookies } from 'cookies-next';

import { isValidKioskMode } from '@weco/common/contexts/KioskContext';

import { getAllConsentStates, getErrorPageConsent } from './civic-uk';

const mockGetCookies = getCookies as unknown as jest.Mock;
const mockIsValidKioskMode = isValidKioskMode as unknown as jest.Mock;

describe('Civic UK consent functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllConsentStates', () => {
    it('returns consent states from CookieControl cookie', () => {
      const consentCookie = encodeURIComponent(
        JSON.stringify({
          optionalCookies: { analytics: 'accepted', marketing: 'revoked' },
        })
      );
      mockGetCookies.mockReturnValue({ CookieControl: consentCookie });
      mockIsValidKioskMode.mockReturnValue(false);

      expect(getAllConsentStates()).toEqual({
        analytics: true,
        marketing: false,
        cookieExists: true,
      });
    });

    it('returns all false when no cookies exist', () => {
      mockGetCookies.mockReturnValue({});
      mockIsValidKioskMode.mockReturnValue(false);

      expect(getAllConsentStates()).toEqual({
        analytics: false,
        marketing: false,
        cookieExists: false,
      });
    });

    it('returns all true when kiosk mode is active', () => {
      mockGetCookies.mockReturnValue({ toggle_kioskMode: 'TR-iPad1' });
      mockIsValidKioskMode.mockReturnValue(true);

      expect(getAllConsentStates()).toEqual({
        analytics: true,
        marketing: true,
        cookieExists: true,
      });
    });
  });

  describe('getErrorPageConsent', () => {
    it('returns consent states from CookieControl cookie', () => {
      const consentCookie = JSON.stringify({
        optionalCookies: { analytics: 'accepted', marketing: 'revoked' },
      });
      mockGetCookies.mockReturnValue({ CookieControl: consentCookie });
      mockIsValidKioskMode.mockReturnValue(false);

      expect(getErrorPageConsent({ req: {}, res: {} })).toEqual({
        analytics: true,
        marketing: false,
        cookieExists: true,
      });
    });

    it('returns all true when kiosk mode is active', () => {
      mockGetCookies.mockReturnValue({ toggle_kioskMode: 'RR-iPad2' });
      mockIsValidKioskMode.mockReturnValue(true);

      expect(getErrorPageConsent({ req: {}, res: {} })).toEqual({
        analytics: true,
        marketing: true,
        cookieExists: true,
      });
    });
  });
});
