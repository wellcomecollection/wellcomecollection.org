import { screen, within } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';

import OtherArchiveCategories from './archive-category.OtherArchiveCategories';

const makeCategory = (id: string, label: string): ArchiveCategory => ({
  id,
  slug: id.toLowerCase(),
  label,
  shortDescription: `${label} description`,
  count: 10,
});

const archiveCategories = [
  makeCategory('WF', 'Wellcome Foundation'),
  makeCategory('PP', 'Personal Papers'),
  makeCategory('GC', 'General Collections'),
];

describe('OtherArchiveCategories', () => {
  it('renders a card for each archive type, in the order given', () => {
    renderWithTheme(
      <OtherArchiveCategories archiveCategories={archiveCategories} />
    );

    const section = screen.getByRole('region', {
      name: 'Other types of archives',
    });
    const links = within(section).getAllByRole('link');

    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/collections/archives/wf',
      '/collections/archives/pp',
      '/collections/archives/gc',
    ]);
  });

  it('tags each card with its position for analytics', () => {
    const { container } = renderWithTheme(
      <OtherArchiveCategories archiveCategories={archiveCategories} />
    );

    const tagged = container.querySelectorAll(
      '[data-gtm-category-label="Other types of archives"]'
    );
    expect(
      Array.from(tagged).map(el => el.getAttribute('data-gtm-position-in-list'))
    ).toEqual(['1', '2', '3']);
  });

  it('renders nothing when there are no other archive types', () => {
    const { container } = renderWithTheme(
      <OtherArchiveCategories archiveCategories={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
