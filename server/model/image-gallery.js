// @flow
export type ImageGallery = {|
  title?: string; // TODO: this probably shouldn't be optional
  items: Array<any>;
|}

export function createImageGallery(data: ImageGallery) {
  return (data: ImageGallery);
}
