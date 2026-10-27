import { screen } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import RelatedWorks, { WorkQueryProps } from '.';

jest.mock('./RelatedWorks.helpers', () => ({
  fetchRelatedWorks: jest.fn().mockResolvedValue({
    'subject-HIV': { label: 'HIV', category: 'subject', results: [] },
    'genre-Posters': { label: 'Posters', category: 'genre', results: [] },
  }),
}));

describe('RelatedWorks', () => {
  it('points each tag at the panel of works it shows', async () => {
    renderWithTheme(
      <RelatedWorks
        workId="abc123"
        subjects={[{ label: 'HIV' }] as unknown as WorkQueryProps['subjects']}
      />
    );

    const tags = await screen.findAllByRole('radio');
    expect(tags).toHaveLength(2);

    tags.forEach(tag => {
      const panelId = tag.getAttribute('aria-controls');
      expect(panelId).not.toBe(tag.id);
      expect(document.getElementById(panelId as string)).not.toBeNull();
    });
  });
});
