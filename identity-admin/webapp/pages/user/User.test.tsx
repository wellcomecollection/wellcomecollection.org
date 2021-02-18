import React from 'react';
import { render, screen } from '@testing-library/react';
import User from './User';

const renderPage = () => render(<User />);

describe('User', () => {
  it('renders correctly', () => {
    renderPage();
    expect(screen.getByText(/User/)).toBeInTheDocument();
  });
});
