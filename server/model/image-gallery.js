// @flow
export type ImageGallery = {|
  name?: string; // TODO: this probably shouldn't be optional
  items: Array<any>;
|}

export function createImageGallery(data: ImageGallery) {
  return (data: ImageGallery);
}
