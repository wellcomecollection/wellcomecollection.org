import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccountValidated } from './AccountValidated';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';

// avoid rendering header SVG to help with debugging tests
jest.mock('../components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>, // eslint-disable-line react/display-name
}));

const renderPage = (location: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[location]}>
        <AccountValidated />
      </MemoryRouter>
    </ThemeProvider>
  );

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

  it('displays a failure message', () => {
    renderPage(
      '/validated?message=This%20URL%20can%20be%20used%20only%20once&success=false'
    );
    expect(screen.getByText('This URL can be used only once')).toBeTruthy();
  });

  it('shows a link to login on success', () => {
    renderPage('/validated?success=true');
    const links = screen.getAllByRole('link');
    const link = links[1];
    expect(link).toHaveTextContent('Continue to Sign in');
    expect(link).toHaveAttribute('href', '/account');
  });

  it('shows a link to customer support on failure', () => {
    renderPage('/validated?success=false');
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
