import { render, screen } from '@testing-library/react';
import App from './App';

test('renders predict button', () => {
  render(<App />);
  expect(screen.getByText(/Predict/i)).toBeInTheDocument();
});
