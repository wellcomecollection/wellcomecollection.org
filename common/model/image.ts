import { Tasl } from './tasl';

export type Crop = '32:15' | '16:9' | 'square';

export type ImageType = {
  contentUrl: string;
  width: number;
  height: number;
  alt: string | null;
  tasl?: Tasl;
  crops: {
    [key in Crop]?: ImageType;
  };
};

export type UiImageType = ImageType & {
  sizesQueries: string;
  extraClasses?: string;
  isFull?: boolean;
  showTasl?: boolean;
  isWidthAuto?: boolean;
  setComputedImageWidth?: (value: number) => void;
  setIsWidthAuto?: (value: boolean) => void;
};
