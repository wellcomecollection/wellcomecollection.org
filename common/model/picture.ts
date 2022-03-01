import { Tasl } from './tasl';

export type Picture = {
  contentUrl: string;
  width: number;
  height: number;
  alt: string;
  tasl?: Tasl;
  minWidth?: string; // This must have a CSS unit attached
};
