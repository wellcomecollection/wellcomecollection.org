import React from 'react';
import { render, screen } from '@testing-library/react';
import User from './User';

const renderPage = () => render(<User />);

describe('User', () => {
  it('has a top-level heading which links to the main screen', () => {
    renderPage();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/account administration/i);
    expect(heading.firstChild).toHaveAttribute('href', '/');
  });
});
