import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';

const emptyLink = {
  link_type: 'Document',
};

const brokenLink = {
  id: 'W7d_ghAAALWY3Ujc',
  type: 'article-formats',
  tags: [],
  slug: 'comic',
  lang: 'en-gb',
  first_publication_date: '2018-10-05T15:13:14+0000',
  last_publication_date: '2018-10-05T15:13:14+0000',
  link_type: 'Document',
  isBroken: true,
};

const filledLinkWithNoData = {
  ...brokenLink,
  isBroken: false,
};

const filledLinkWithData = {
  ...brokenLink,
  isBroken: false,
  data: {
    title: 'Title',
    description: 'Description',
  },
};

const links = {
  emptyLink,
  brokenLink,
  filledLinkWithNoData,
  filledLinkWithData,
};

describe('isFilledLinkToDocumentWithData', () => {
  test.each([
    { link: 'emptyLink', isType: false },
    { link: 'brokenLink', isType: false },
    { link: 'filledLinkWithNoData', isType: false },
    { link: 'filledLinkWithData', isType: true },
  ])('isFilledLinkToDocumentWithData($link)', ({ link, isType }) => {
    expect(isFilledLinkToDocumentWithData(links[link])).toBe(isType);
  });
});
