import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { pluralize, formatYearsOldFromDateString } from './utils';

describe('formatYearsOldFromDateString', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('Check ages', () => {
    vi.setSystemTime(new Date(2000, 1, 1));
    expect(formatYearsOldFromDateString('1980-03-01')).toBe('19 years old');
    vi.setSystemTime(new Date(2000, 3, 1));
    expect(formatYearsOldFromDateString('1980-03-01')).toBe('20 years old');
    vi.setSystemTime(new Date(2000, 5, 1));
    expect(formatYearsOldFromDateString('1980-03-01')).toBe('20 years old');
  });
});

describe('pluralize', () => {
  it('Check plurals', () => {
    expect(pluralize(1, 'day')).toBe('1 day');
    expect(pluralize(2, 'day')).toBe('2 days');
    expect(pluralize(1, 'box', 'boxes')).toBe('1 box');
    expect(pluralize(2, 'box', 'boxes')).toBe('2 boxes');
  });
});
