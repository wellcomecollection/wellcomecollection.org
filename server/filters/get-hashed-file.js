// @flow
import config from '../config/index';
import {getFlag} from '../util/flags';

export function getHashedFile(path: string, filename: string): string {
  const root = getFlag('useS3Assets').enabled ? `${config.fileRoot}${path}` : '';
  return `${root}${(config.hashedFiles[filename] || filename)}`;
}
