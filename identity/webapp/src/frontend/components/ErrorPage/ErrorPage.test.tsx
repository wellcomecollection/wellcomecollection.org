import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';

const renderComponent = (url: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[url]}>
        <ErrorPage />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('ErrorPage', () => {
  it('displays the error from the URL', () => {
    renderComponent(`/error?error=bad_juju`);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('bad_juju');
  });

  it('displays the error description from the URL', () => {
    renderComponent(`/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`);
    expect(screen.getByText("Uh-oh, spaghetti-O's!")).toBeInTheDocument();
  });

  it('displays a link to the help desk', () => {
    renderComponent(`/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`);
    expect(screen.getByRole('link', { name: /help desk/i })).toHaveAttribute(
      'href',
      'https://wellcomelibrary.org/using-the-library/services-and-facilities/contact-us/'
    );
  });
});
