import { Tasl } from './tasl';

export type ImageType = {
  contentUrl: string,
  width: number,
  height: number,
  alt: string,
  tasl: Tasl,
  crops: {
    [key: string]: ImageType;
  };
};


export type UiImageType = ImageType & {
  sizesQueries: string,
  extraClasses?: string,
  isFull?: boolean,
  showTasl?: boolean,
  isWidthAuto?: boolean,
  setComputedImageWidth?: (value: number) => void,
  setIsWidthAuto?: (value: boolean) => void,
};
