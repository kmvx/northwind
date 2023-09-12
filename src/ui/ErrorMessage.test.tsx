import { expect, test } from 'vitest';
import renderer from 'react-test-renderer';
import ErrorMessage from './ErrorMessage';

test('ErrorMessage', () => {
  const tree = renderer
    .create(<ErrorMessage error={new Error('Test')} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
