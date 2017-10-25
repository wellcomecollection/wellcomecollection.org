// @flow
import config from '../config/index';

export function getHashedFile(filename: string): string {
  return config.hashedAssets[filename] || filename;
}
