import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { NewSearchPage } from '@weco/content/pages/search';
import {
  addressablesNoResults,
  clientSideImagesNoResults,
  clientSideImagesResults,
  clientSideWorkTypesNoResults,
  clientSideWorkTypesResults,
} from '@weco/content/test/fixtures/search';

jest.mock('@weco/common/server-data');
jest.mock('next/router', () => require('next-router-mock'));

describe.skip('/search', () => {
  it('renders full page catalogue and image results when there are no addressable results', () => {
    const page = renderWithTheme(
      <NewSearchPage
        queryString="test"
        contentQueryFailed={false}
        contentResults={addressablesNoResults}
        catalogueResults={{
          works: clientSideWorkTypesResults,
          images: clientSideImagesResults,
        }}
      />
    );
    expect(page).toMatchSnapshot();
  });

  it('handles an error fetching addressable results', () => {
    const page = renderWithTheme(
      <NewSearchPage
        queryString="test"
        contentQueryFailed={true}
        catalogueResults={{
          works: clientSideWorkTypesResults,
          images: clientSideImagesResults,
        }}
      />
    );
    expect(page).toMatchSnapshot();
  });

  it('does not show a sidebar where there are no works/images', () => {
    const page = renderWithTheme(
      <NewSearchPage
        queryString="test"
        contentQueryFailed={false}
        contentResults={addressablesNoResults}
        catalogueResults={{
          works: clientSideWorkTypesNoResults,
          images: clientSideImagesNoResults,
        }}
      />
    );
    expect(page).toMatchSnapshot();
  });
});
