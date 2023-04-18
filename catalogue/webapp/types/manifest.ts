type ThumbnailImage = { url: string | undefined; width: number };

export type TransformedCanvas = {
  id: string;
  width: number | undefined;
  height: number | undefined;
  imageServiceId: string | undefined;
  hasRestrictedImage: boolean;
  label: string | undefined;
  textServiceId: string | undefined;
  thumbnailImage: ThumbnailImage | undefined;
};

export type DownloadOption = {
  id: string;
  label: string;
  format: string;
  width?: 'full' | number;
};
