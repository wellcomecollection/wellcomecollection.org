import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { Article } from '@weco/content/types/articles';
import {
  COMMISSIONING_EDITOR_DESCRIBED_BY,
  Contributor,
} from '@weco/content/types/contributors';

import ContentTypeInfo from './story.ContentTypeInfo';

const defaultImage = {
  width: 64,
  height: 64,
  contentUrl: 'https://example.com/image.png',
  alt: '',
};

function makePerson(name: string): Contributor['contributor'] {
  return {
    type: 'people',
    id: name,
    name,
    image: defaultImage,
    sameAs: [],
  };
}

const baseArticle: Article = {
  type: 'articles',
  id: 'test-article',
  uid: 'test-article',
  title: 'Test article',
  datePublished: new Date('2024-01-01'),
  contributors: [],
  series: [],
  seasons: [],
  labels: [],
  untransformedBody: [],
  hasLinkedWorks: false,
};

describe('ContentTypeInfo byline', () => {
  it('shows a regular contributor in the byline', () => {
    const article: Article = {
      ...baseArticle,
      contributors: [
        {
          contributor: makePerson('Ada Lovelace'),
          role: { id: 'words-role', title: 'Written by', describedBy: 'words' },
        },
      ],
    };

    const { getByTestId } = renderWithTheme(ContentTypeInfo(article));

    expect(getByTestId('contributor-name').textContent).toContain(
      'Ada Lovelace'
    );
  });

  it('excludes a commissioning editor from the byline', () => {
    const article: Article = {
      ...baseArticle,
      contributors: [
        {
          contributor: makePerson('Ada Lovelace'),
          role: { id: 'words-role', title: 'Written by', describedBy: 'words' },
        },
        {
          contributor: makePerson('Jane Smith'),
          role: {
            id: 'commissioning-role',
            title: 'Commissioning editor',
            describedBy: COMMISSIONING_EDITOR_DESCRIBED_BY,
          },
        },
      ],
    };

    const { getAllByTestId } = renderWithTheme(ContentTypeInfo(article));

    const bylineNames = getAllByTestId('contributor-name').map(
      el => el.textContent
    );

    expect(bylineNames.some(t => t?.includes('Ada Lovelace'))).toBe(true);
    expect(bylineNames.some(t => t?.includes('Jane Smith'))).toBe(false);
  });

  it('shows nothing in the byline when the only contributor is a commissioning editor', () => {
    const article: Article = {
      ...baseArticle,
      contributors: [
        {
          contributor: makePerson('Jane Smith'),
          role: {
            id: 'commissioning-role',
            title: 'Commissioning editor',
            describedBy: COMMISSIONING_EDITOR_DESCRIBED_BY,
          },
        },
      ],
    };

    const { queryAllByTestId } = renderWithTheme(ContentTypeInfo(article));

    expect(queryAllByTestId('contributor-name')).toHaveLength(0);
  });
});
