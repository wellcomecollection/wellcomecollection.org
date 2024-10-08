import {
  PrismicData,
  defaultValue as prismicDefaultValue,
  SimplifiedPrismicData,
} from '@weco/common/server-data/prismic';
import { Toggles } from '@weco/toggles';

/**
 * The type is stored here rather than with the service because
 * the service can only be included when running server-side
 * but the types are needed isomorphically
 */
export type ServerData = {
  toggles: Toggles;
  prismic: PrismicData;
  consentStatus: ConsentStatusProps;
};

export type SimplifiedServerData = {
  toggles: Toggles;
  prismic: SimplifiedPrismicData;
  consentStatus: ConsentStatusProps;
};

export type ConsentStatusProps = {
  analytics: boolean;
  marketing: boolean;
};

export const defaultServerData: SimplifiedServerData = {
  toggles: {},
  prismic: prismicDefaultValue,
  consentStatus: {
    analytics: false,
    marketing: false,
  },
};

/**
 * This is a weird check but checks that whatever object you have
 * has the right keys
 */
export function isServerData(obj: unknown): obj is ServerData {
  if (!obj) return false;

  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).sort().toString() ===
      Object.keys(defaultServerData).sort().toString()
  );
}
