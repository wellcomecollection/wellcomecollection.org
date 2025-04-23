import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { defaultServerData } from '@weco/common/server-data/types';
import theme from '@weco/common/views/themes/default';
import ValidatedPage from '@weco/identity/pages/validated';

// avoid rendering header SVG to help with debugging tests
jest.mock('@weco/identity/components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>,
}));

jest.mock('@weco/common/server-data', () => ({
  __esModule: true,
  getServerData: async () =>
    (await import('@weco/common/server-data/types')).defaultServerData,
}));

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    sessionKeys: 'test_test_test',
    siteBaseUrl: 'http://test.test',
    identityBasePath: '/account',
    auth0: {
      domain: 'test.test',
      clientID: 'test',
      clientSecret: 'test',
    },
    remoteApi: {
      host: 'test.test',
      apiKey: 'test',
    },
  },
}));

const renderPage = (location: string) => {
  const url = new URL(`https://test.host/${location}`);
  const success = url.searchParams.get('success') === 'true';
  const message = url.searchParams.get('message') || '';
  const isNewSignUp = url.searchParams.get('supportSignUp') === 'true';

  render(
    <ThemeProvider theme={theme}>
      <ValidatedPage
        success={success}
        message={message}
        isNewSignUp={isNewSignUp}
        serverData={defaultServerData}
      />
    </ThemeProvider>
  );
};

describe('AccountValidated', () => {
  it('displays a title on successful validation', () => {
    renderPage('/validated?success=true');
    expect(
      screen.getByRole('heading', { name: /email verified/i })
    ).toBeInTheDocument();
  });

  it('displays a title on failed validation', () => {
    renderPage('/validated?success=false');
    expect(
      screen.getByRole('heading', { name: /failed to verify email/i })
    ).toBeInTheDocument();
  });

  it('displays a email verified title when message is "This URL can be used only once"', () => {
    // relates to #6952
    renderPage(
      '/validated?message=This%20URL%20can%20be%20used%20only%20once&success=false'
    );
    expect(
      screen.getByRole('heading', { name: /email verified/i })
    ).toBeInTheDocument();
  });

  it('shows review process information to new users', () => {
    renderPage('/validated?success=true&supportSignUp=true');
    expect(screen.getByTestId('new-sign-up')).toBeTruthy();
  });

  it('does not show review process information to existing users', () => {
    renderPage('/validated?success=true&supportSignUp=false');
    expect(screen.queryByTestId('new-sign-up')).toBeFalsy();
  });

  it('shows a link to login on success', async () => {
    renderPage('/validated?success=true&supportSignUp=true');
    const links = screen.getAllByRole('link');
    const link = links.find(lk => lk.textContent === 'Sign in');
    expect(link).toBeDefined();
    await expect(link).toHaveAttribute('href', '/account');
  });

  it('shows a link to customer support on failure', async () => {
    renderPage('/validated?success=false');
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent(/contact the library/i);
    await expect(link).toHaveAttribute(
      'href',
      'mailto:library@wellcomecollection.org'
    );
  });
});
