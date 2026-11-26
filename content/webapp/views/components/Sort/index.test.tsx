import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
} from '@weco/common/contexts/AppContext';
import theme from '@weco/common/views/themes/default';

import Sort from '.';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('next/router', () => require('next-router-mock'));

// The options the works search page uses, where the default is relevance
const searchProps: ComponentProps<typeof Sort> = {
  formId: 'search-form',
  options: [
    { value: '', text: 'Relevance' },
    { value: 'production.dates.asc', text: 'Oldest to newest' },
    { value: 'production.dates.desc', text: 'Newest to oldest' },
  ],
  jsLessOptions: {
    sort: [
      { value: '', text: 'Relevance' },
      { value: 'production.dates', text: 'Production dates' },
    ],
    sortOrder: [
      { value: 'asc', text: 'Ascending' },
      { value: 'desc', text: 'Descending' },
    ],
  },
};

// The options the archive category pages use, where the default is title A-Z
const archiveProps: ComponentProps<typeof Sort> = {
  formId: 'archive-category-sort-form',
  options: [
    { value: '', text: 'Alphabetical A-Z' },
    { value: 'production.dates.desc', text: 'Newest to oldest' },
    { value: 'production.dates.asc', text: 'Oldest to newest' },
  ],
  jsLessOptions: {
    sort: [
      { value: 'title', text: 'Title' },
      { value: 'production.dates', text: 'Production dates' },
    ],
    sortOrder: [
      { value: 'desc', text: 'Descending' },
      { value: 'asc', text: 'Ascending' },
    ],
  },
};

const withProviders = (
  props: ComponentProps<typeof Sort>,
  isEnhanced: boolean
) => (
  <ThemeProvider theme={theme}>
    <AppContext.Provider value={{ ...appContextDefaults, isEnhanced }}>
      <Sort {...props} />
    </AppContext.Provider>
  </ThemeProvider>
);

const renderSort = (props: ComponentProps<typeof Sort> = searchProps) =>
  render(withProviders(props, true));

const select = () => screen.getByRole('combobox') as HTMLSelectElement;
const selectedText = () => select().selectedOptions[0].text;

describe('Sort', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/search/works?query=heart');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('on the search pages', () => {
    it('shows the default option when the URL has no sort', () => {
      renderSort();
      expect(selectedText()).toBe('Relevance');
    });

    it('shows the option matching the sort in the URL', () => {
      mockRouter.setCurrentUrl(
        '/search/works?query=heart&sort=production.dates&sortOrder=asc'
      );
      renderSort();
      expect(selectedText()).toBe('Oldest to newest');
    });

    it('adds the chosen sort to the URL, keeping other params and going back to the first page of results', async () => {
      mockRouter.setCurrentUrl('/search/works?query=heart&page=3');
      renderSort();

      await userEvent.selectOptions(select(), 'Newest to oldest');

      await waitFor(() =>
        expect(mockRouter).toMatchObject({
          pathname: '/search/works',
          query: {
            query: 'heart',
            sort: 'production.dates',
            sortOrder: 'desc',
          },
        })
      );
      expect(mockRouter.query.page).toBeUndefined();
      expect(selectedText()).toBe('Newest to oldest');
    });

    it('removes the sort from the URL when the default option is chosen', async () => {
      mockRouter.setCurrentUrl(
        '/search/works?query=heart&sort=production.dates&sortOrder=asc'
      );
      renderSort();

      await userEvent.selectOptions(select(), 'Relevance');

      await waitFor(() => expect(mockRouter.query).toEqual({ query: 'heart' }));
      expect(selectedText()).toBe('Relevance');
    });

    it("doesn't change the URL on first render", () => {
      const push = jest.spyOn(mockRouter, 'push');
      mockRouter.setCurrentUrl(
        '/search/works?query=heart&sort=production.dates&sortOrder=asc&page=2'
      );
      renderSort();

      expect(push).not.toHaveBeenCalled();
    });

    it('renders separate sort and sortOrder selects for the no-JS form, with the default values selected', () => {
      const html = renderToStaticMarkup(
        withProviders(
          {
            ...searchProps,
            defaultValues: { sort: 'production.dates', sortOrder: 'desc' },
          },
          false
        )
      );

      expect(html).toContain('name="sort"');
      expect(html).toContain('<option value="production.dates" selected="">');
      expect(html).toContain('<option value="desc" selected="">');
      expect(html).toContain('form="search-form"');
    });
  });

  describe('keeping in step with the URL', () => {
    it('shows the right option after the browser’s Back', async () => {
      renderSort();
      await userEvent.selectOptions(select(), 'Oldest to newest');
      await waitFor(() => expect(mockRouter.query.sortOrder).toBe('asc'));

      // The browser's Back changes the URL without going through the select
      act(() => mockRouter.setCurrentUrl('/search/works?query=heart'));

      expect(selectedText()).toBe('Relevance');
    });

    it('applies an option again when it’s chosen after the browser’s Back', async () => {
      renderSort();
      await userEvent.selectOptions(select(), 'Oldest to newest');
      await waitFor(() => expect(mockRouter.query.sortOrder).toBe('asc'));
      act(() => mockRouter.setCurrentUrl('/search/works?query=heart'));

      await userEvent.selectOptions(select(), 'Oldest to newest');

      await waitFor(() => expect(mockRouter.query.sortOrder).toBe('asc'));
      expect(selectedText()).toBe('Oldest to newest');
    });

    it('shows the chosen option while the route change is still loading', async () => {
      // A push that never completes, so the URL stays as it was
      const push = jest
        .spyOn(mockRouter, 'push')
        .mockImplementation(() => new Promise(() => {}));
      renderSort({ ...searchProps, selectedValue: '' });

      await userEvent.selectOptions(select(), 'Oldest to newest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(selectedText()).toBe('Oldest to newest');
    });
  });

  describe('with selectedValue, as on the archive category pages', () => {
    it('shows selectedValue in place of the option worked out from the URL', () => {
      // The page sorts ?sort=production.dates newest first, though no option
      // matches the URL
      mockRouter.setCurrentUrl(
        '/collections/archives/pp?sort=production.dates'
      );
      renderSort({ ...archiveProps, selectedValue: 'production.dates.desc' });

      expect(selectedText()).toBe('Newest to oldest');
    });

    it("doesn't change the URL when the option already shown is chosen", async () => {
      const push = jest.spyOn(mockRouter, 'push');
      mockRouter.setCurrentUrl(
        '/collections/archives/pp?sort=production.dates'
      );
      renderSort({ ...archiveProps, selectedValue: 'production.dates.desc' });

      await userEvent.selectOptions(select(), 'Newest to oldest');

      expect(push).not.toHaveBeenCalled();
    });
  });
});
