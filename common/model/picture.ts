import { Tasl } from '@weco/common/model/tasl';

export type Picture = {
  contentUrl: string;
  width: number;
  height: number;
  alt: string | null;
  tasl?: Tasl;
  minWidth?: string; // This must have a CSS unit attached
};
