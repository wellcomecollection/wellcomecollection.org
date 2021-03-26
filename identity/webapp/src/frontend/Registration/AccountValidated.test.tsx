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
    expect(screen.getByRole('heading', { name: /email verified/i })).toBeInTheDocument();
  });

  it('displays a title on failed validation', () => {
    renderPage('/validated?success=false');
    expect(screen.getByRole('heading', { name: /failed to verify email/i })).toBeInTheDocument();
  });

  it('displays a success message', () => {
    renderPage(
      '/validated?message=Your%20email%20was%20verified.%20You%20can%20continue%20using%20the%20application.&success=true'
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Your email was verified. You can continue using the application.'
    );
  });

  it('displays a failure message', () => {
    renderPage('/validated?message=This%20URL%20can%20be%20used%20only%20once&success=false');
    expect(screen.getByRole('alert')).toHaveTextContent('This URL can be used only once');
  });

  it('shows a link to login on success', () => {
    renderPage('/validated?success=true');
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Continue to Sign in');
    expect(link).toHaveAttribute('href', '/');
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
