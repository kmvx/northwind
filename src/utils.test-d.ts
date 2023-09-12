import { test, expectTypeOf } from 'vitest';
import { pluralize } from './utils';

test('pluralize types', () => {
  expectTypeOf(pluralize).toBeFunction();
});
