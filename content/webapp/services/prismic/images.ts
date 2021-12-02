import { Image } from './types';

const sizes = [160, 180, 282, 320, 420, 600, 880, 960, 1024, 1338];
type Size = typeof sizes[number];

type Params = {
  w: Size;
};

export function getImageUrlAtSize(
  image: Image,
  params: Params
): string | undefined {
  // There are a few pieces of content that don't have 16:9 crops due to them being published
  // before we introduced the crop.
  const crop = image['16:9'] ?? image;
  if (!crop?.url) return;

  const url = new URL(crop.url);
  const base = `${url.origin}${url.pathname}`;

  const urlSearchParams = new URLSearchParams();

  // append any previous params
  // e.g. auto=format,compress&rect=rect=0,394,4000,2250
  for (const [key, val] of url.searchParams) {
    urlSearchParams.set(key, val.toString());
  }

  // Override with any new params
  for (const [key, val] of Object.entries(params)) {
    urlSearchParams.set(key, val.toString());
  }

  // We remove the `h` param as it's returned from the cropped image in Prismic
  // but the wrnog value when we apply a new `w` param. ImgIx calculated the height
  // automatically so ew leave it at that.
  urlSearchParams.delete('h');

  return `${base}?${urlSearchParams.toString()}`;
}
