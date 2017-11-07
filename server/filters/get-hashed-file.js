// @flow
import config from '../config/index';

export function getHashedFile(path: string, filename: string): string {
  const root = `${config.fileRoot}${path}`;
  return `${root}${(config.hashedFiles[filename] || filename)}`;
}
