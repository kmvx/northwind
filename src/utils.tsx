import type { ICategories, IEmployee } from './models';

export const API_URL = 'https://demodata.grapecity.com/northwind/api/v1';

export function joinFields(...args: string[]) {
  return [...args].filter((item) => Boolean(item)).join(', ');
}
export function formatDateFromString(date: string) {
  if (!date) return 'N/A';
  const dataObject = new Date(date);
  if (isNaN(dataObject as unknown as number)) return `${dataObject}`;
  return `${dataObject.toLocaleString('default', {
    month: 'short',
  })} ${dataObject.getDate()}, ${dataObject.getFullYear()}`;
}
export function formatYearsOldFromDateString(dateString: string) {
  if (!dateString) return <></>;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} years old`;
}
export function isStringIncludes(str: string, search: string): boolean {
  const strConverted = typeof str === 'string' ? str : '' + str;
  const searchConverted = typeof search === 'string' ? search : '' + search;
  return (
    strConverted.toLowerCase().indexOf(searchConverted.toLowerCase()) !== -1
  );
}
export function pluralize(number: number, singular: string, plural?: string) {
  return (
    number + ' ' + (number === 1 ? singular : plural ? plural : singular + 's')
  );
}
export const setDocumentTitle = (function () {
  const initialDocumentTitle =
    typeof document !== 'undefined' ? document.title : '';
  return function setDocumentTitle(...args: (string | undefined)[]) {
    document.title = [...args, initialDocumentTitle]
      .filter((item) => Boolean(item))
      .join(' \u2014 ');
  };
})();
export function getEmployeeNameByData(data: IEmployee) {
  return data.titleOfCourtesy + ' ' + data.lastName + ' ' + data.firstName;
}
export function getCategoryNameById(
  dataCategories?: ICategories,
  id?: number,
): string | undefined {
  const category = dataCategories?.find((item) => item.categoryId === id);
  if (category) return category.categoryName;
  else if (id == undefined) return id;
  else return String(id);
}

const countryFlagEmojiByCountryName: Record<string, string> = {
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  Denmark: '🇩🇰',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Ireland: '🇮🇪',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Netherlands: '🇳🇱',
  Norway: '🇳🇴',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Singapore: '🇸🇬',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  UK: '🇬🇧',
  USA: '🇺🇸',
  Venezuela: '🇻🇪',
};
export function getFlagEmojiByCountryName(country: string): string | undefined {
  if (!country) return '🇺🇳';
  const emoji = countryFlagEmojiByCountryName[country];
  if (!emoji) {
    console.log('Unknown country', country);
    return '🏴‍☠';
  }
  return emoji;
}
export function getCountries() {
  return Object.keys(countryFlagEmojiByCountryName);
}
