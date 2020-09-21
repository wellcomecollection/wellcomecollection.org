import { Tasl } from './tasl';

export type Picture = {
  contentUrl: string;
  width: number;
  height: number | null;
  alt: string;
  tasl: Tasl;
  minWidth: string | null; // This must have a CSS unit attached
};

export function createPicture(data: Picture): Picture {
  return data;
}
