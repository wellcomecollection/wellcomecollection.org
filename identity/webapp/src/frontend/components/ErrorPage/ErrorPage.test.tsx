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
  it('displays the error description from the URL', () => {
    renderComponent(
      `/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`
    );
    expect(screen.getByText("Uh-oh, spaghetti-O's!")).toBeInTheDocument();
  });

  it('displays an email link for the library.', () => {
    renderComponent(
      `/error?error_description=${encodeURI("Uh-oh, spaghetti-O's!")}`
    );
    expect(screen.getByRole('link', { name: /Contact us/ })).toHaveAttribute(
      'href',
      'mailto:library@wellcomecollection.org'
    );
  });
});
