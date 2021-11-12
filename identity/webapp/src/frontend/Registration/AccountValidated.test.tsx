import React from 'react';
import { render, screen } from '@testing-library/react';
import ValidatedPage from '../../../pages/account/validated';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';

// avoid rendering header SVG to help with debugging tests
jest.mock('../components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>, // eslint-disable-line react/display-name
}));

jest.mock('@weco/common/server-data', () => ({
  __esModule: true,
  getServerData: async () =>
    (await import('@weco/common/server-data/types')).defaultServerData,
}));

const renderPage = (location: string) => {
  const url = new URL(`https://localhost:3000/${location}`);
  const success = url.searchParams.get('success') === 'true';
  const message = url.searchParams.get('message');
  const isNewSignUp = url.searchParams.get('supportSignUp') === 'true';

  render(
    <ThemeProvider theme={theme}>
      <ValidatedPage
        success={success}
        message={message}
        isNewSignUp={isNewSignUp}
        serverData={null}
      />
    </ThemeProvider>
  );
};

describe('AccountValidated', () => {
  it('displays a title on successful validation', () => {
    renderPage('/account/validated?success=true');
    expect(
      screen.getByRole('heading', { name: /email verified/i })
    ).toBeInTheDocument();
  });

  it('displays a title on failed validation', () => {
    renderPage('/account/validated?success=false');
    expect(
      screen.getByRole('heading', { name: /failed to verify email/i })
    ).toBeInTheDocument();
  });

  it('displays a email verified title when message is "This URL can be used only once"', () => {
    // relates to #6952
    renderPage(
      '/account/validated?message=This%20URL%20can%20be%20used%20only%20once&success=false'
    );
    expect(
      screen.getByRole('heading', { name: /email verified/i })
    ).toBeInTheDocument();
  });

  it('shows review process information to new users', () => {
    renderPage('/account/validated?success=true&supportSignUp=true');
    expect(screen.getByTestId('new-sign-up')).toBeTruthy();
  });

  it('does not show review process information to existing users', () => {
    renderPage('/account/validated?success=true&supportSignUp=false');
    expect(screen.queryByTestId('new-sign-up')).toBeFalsy();
  });

  it('shows a link to login on success', () => {
    renderPage('/account/validated?success=true&supportSignUp=true');
    const links = screen.getAllByRole('link');
    const link = links[1];
    expect(link).toHaveTextContent('Sign in');
    expect(link).toHaveAttribute('href', '/account');
  });

  it('shows a link to customer support on failure', () => {
    renderPage('/account/validated?success=false');
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent(/contact us/i);
    expect(link).toHaveAttribute(
      'href',
      'https://wellcomelibrary.org/using-the-library/services-and-facilities/contact-us/'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
