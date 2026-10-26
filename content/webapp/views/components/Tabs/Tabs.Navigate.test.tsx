import { screen } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import TabsNavigate from './Tabs.Navigate';

describe('TabsNavigate', () => {
  it('is a navigation landmark named by its label', () => {
    renderWithTheme(
      <TabsNavigate
        label="date filter"
        currentSection="today"
        items={[
          { id: 'today', text: 'Today', url: '/whats-on/today' },
          {
            id: 'this-weekend',
            text: 'This weekend',
            url: '/whats-on/this-weekend',
          },
        ]}
      />
    );

    expect(
      screen.getByRole('navigation', { name: 'date filter' })
    ).toBeInTheDocument();
  });
});
