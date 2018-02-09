// @flow

export const name = 'Captioned image';
export const handle = 'captioned-image';
export const status = 'graduated';
export const collated = true;
const image = {
  type: 'picture',
  contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/featured-image-dans-blog2.jpg',
  caption: 'An edited frame from Animating the Body',
  width: 1380,
  height: 1104,
  alt: 'animating the body'
};

export const context = {
  image: image,
  caption: 'yo!'
};

// export const context = { model: image, modifiers: [] };
// export const variants = [
//   {name: 'full', context: {model: image, modifiers: {'full': true}}},
//   {name: 'bleed', context: {model: image, modifiers: {'bleed': true}}},
//   {name: 'fit viewport height', context: {model: image, modifiers: {'fit-vh': true}}}
// ];
