import { Toggles } from '@weco/toggles';

export type ServerData = {
  toggles: Toggles;
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
    Object.keys(obj).sort().toString() === ['toggles'].toString()
  );
}
