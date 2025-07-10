import { expect, it } from 'vitest';
import { convertToCSV, convertToJSON, convertToMarkdown } from './convertTo';

it('convertTo', () => {
  const data = [
    {
      number: 1.2,
      hireData: '1992-08-14T00:00:00',
      time: '2025-06-14T18:54:09',
    },
  ];
  expect(convertToCSV(data)).toMatchSnapshot();
  expect(convertToMarkdown(data, 'Datas')).toMatchSnapshot();
  expect(convertToJSON(data)).toMatchSnapshot();
});
