import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the App component', () => {
  render(<App />);
  const headerElement = screen.getByText(/XFI-sBTC Bridge/i);
  expect(headerElement).toBeInTheDocument();
});