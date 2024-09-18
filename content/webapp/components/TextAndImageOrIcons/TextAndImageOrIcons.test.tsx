// The TextAndImageOrIcons component covers both the TextAndIcons and the TextAndImage slice

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import TextAndImageOrIcons, { TextAndIconsItem, TextAndImageItem } from '.';

const TextAndImageSlice: TextAndImageItem = {
  type: 'image',
  text: [
    {
      type: 'heading3',
      text: 'For What It’s Worth by Jess Dobkin',
      spans: [],
    },
    {
      type: 'paragraph',
      text: 'This space has dark shiny walls and floor. It has brightly coloured objects, furniture and lights. It has out loud sound and small moving sculptures. One of the sculptures makes a sudden noise of rattling coins. This work is on open display but can’t be touched.',
      spans: [
        { start: 106, end: 120, type: 'strong' },
        { start: 125, end: 148, type: 'strong' },
        { start: 245, end: 261, type: 'strong' },
      ],
    },
  ],
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/ab416344-4aab-4dcb-8ecb-a74a557f6799_cat-oneil_wellcome_sourced_FINAL_4-milk-india%28edit%29-3.jpg?auto=compress,format',
    width: 1500,
    height: 1125,
    alt: 'A digital illustration of Kamadhenu (the divine bovine goddess) depicted as a cow with illustrations of Hindu goddesses and other religious symbols painted on their hide. Around their neck is a bell on a chain, in the background are orange and yellow swirls representing butter. ',
    tasl: {
      title: 'Sacred cows and nutritional purity in India',
      copyrightHolder: "Cat O'Neil for Wellcome Collection",
    },
  },
  isZoomable: true,
};

const TextAndIconsSlice: TextAndIconsItem = {
  type: 'icons',
  text: [
    {
      type: 'paragraph',
      text: 'There are Illustrated gallery guides, Large-print guides, and Sensory maps',
      spans: [
        { start: 10, end: 36, type: 'strong' },
        { start: 38, end: 56, type: 'strong' },
        { start: 62, end: 74, type: 'strong' },
      ],
    },
  ],
  icons: [
    {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/ab416344-4aab-4dcb-8ecb-a74a557f6799_cat-oneil_wellcome_sourced_FINAL_4-milk-india%28edit%29-3.jpg?auto=compress,format',
      width: 1500,
      height: 1125,
      alt: 'A digital illustration of Kamadhenu (the divine bovine goddess) depicted as a cow with illustrations of Hindu goddesses and other religious symbols painted on their hide. Around their neck is a bell on a chain, in the background are orange and yellow swirls representing butter. ',
      tasl: {
        title: 'Sacred cows and nutritional purity in India',
        copyrightHolder: "Cat O'Neil for Wellcome Collection",
      },
    },
    {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/ab416344-4aab-4dcb-8ecb-a74a557f6799_cat-oneil_wellcome_sourced_FINAL_4-milk-india%28edit%29-3.jpg?auto=compress,format',
      width: 1500,
      height: 1125,
      alt: 'A digital illustration of Kamadhenu (the divine bovine goddess) depicted as a cow with illustrations of Hindu goddesses and other religious symbols painted on their hide. Around their neck is a bell on a chain, in the background are orange and yellow swirls representing butter. ',
      tasl: {
        title: 'Sacred cows and nutritional purity in India',
        copyrightHolder: "Cat O'Neil for Wellcome Collection",
      },
    },
    {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/ab416344-4aab-4dcb-8ecb-a74a557f6799_cat-oneil_wellcome_sourced_FINAL_4-milk-india%28edit%29-3.jpg?auto=compress,format',
      width: 1500,
      height: 1125,
      alt: 'A digital illustration of Kamadhenu (the divine bovine goddess) depicted as a cow with illustrations of Hindu goddesses and other religious symbols painted on their hide. Around their neck is a bell on a chain, in the background are orange and yellow swirls representing butter. ',
      tasl: {
        title: 'Sacred cows and nutritional purity in India',
        copyrightHolder: "Cat O'Neil for Wellcome Collection",
      },
    },
  ],
};

// So we want to ensure it's showing the correct one.
describe('The relevant component is shown when its slice is selected', () => {
  test('Returns the icons version, which can return multiple images', async () => {
    const component = renderWithTheme(
      <TextAndImageOrIcons item={TextAndIconsSlice} />
    );

    const icons = await component.findAllByRole('img');

    expect(icons.length).toEqual(3);
  });

  test('Returns the image version, which uses the figure element', async () => {
    const component = renderWithTheme(
      <TextAndImageOrIcons item={TextAndImageSlice} />
    );

    expect(component.findByRole('figure')).toBeTruthy();
  });
});
