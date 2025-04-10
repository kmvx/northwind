import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

test('ErrorMessage', async () => {
  const { container } = render(<ErrorMessage error={new Error('Test')} />);
  expect(container).toMatchSnapshot();
});
