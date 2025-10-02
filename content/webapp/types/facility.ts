import { IconSvg } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';

export type FacilityCard = {
  id: string;
  url: string;
  title: string;
  image: ImageType;
  description: string;
  metaText?: string;
  metaIcon?: IconSvg;
};
