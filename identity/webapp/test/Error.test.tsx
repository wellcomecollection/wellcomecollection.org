import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { defaultServerData } from '@weco/common/server-data/types';
import theme from '@weco/common/views/themes/default';
import ErrorPage from '@weco/identity/pages/error';

jest.mock('@weco/common/server-data', () => ({
  __esModule: true,
  getServerData: async () =>
    (await import('@weco/common/server-data/types')).defaultServerData,
}));

jest.mock('next/router', () => require('next-router-mock'));

const renderComponent = (location: string) => {
  const url = new URL(`https://localhost:3003/${location}`);
  const errorDescription = url.searchParams.get('error_description') || '';

  render(
    <ThemeProvider theme={theme}>
      <ErrorPage
        errorDescription={errorDescription}
        serverData={defaultServerData}
      />
    </ThemeProvider>
  );
};

describe('ErrorPage', () => {
  it('displays the error description from the URL', () => {
    renderComponent(
      `/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`
    );
    expect(screen.getByText("Uh-oh, spaghetti-O's!")).toBeInTheDocument();
  });

  it('displays an email link for the library.', async () => {
    renderComponent(
      `/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`
    );
    await expect(
      screen.getByRole('link', { name: /Contact us/ })
    ).toHaveAttribute('href', 'mailto:library@wellcomecollection.org');
  });
});
