import React from 'react';
import { render, screen } from '@testing-library/react';
import { Super } from './Super';

test('renders learn react link', () => {
  render(<Super />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
