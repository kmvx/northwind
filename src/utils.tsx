import type { ICategories, IEmployee } from './models';

export const API_URL = 'https://demodata.grapecity.com/northwind/api/v1';

export function joinFields(...args: string[]) {
  return [...args].filter((item) => Boolean(item)).join(', ');
}
export function formatDateFromString(date: string) {
  if (!date) return 'N/A';
  const dataObject = new Date(date);
  if (isNaN(dataObject as any)) return `${dataObject}`;
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

const countryFlagSuffixByCountryName: Record<string, string> = {
  Argentina: 'ar',
  Australia: 'au',
  Austria: 'at',
  Belgium: 'be',
  Brazil: 'br',
  Canada: 'ca',
  Denmark: 'dk',
  Finland: 'fi',
  France: 'fr',
  Germany: 'de',
  Ireland: 'ie',
  Italy: 'it',
  Japan: 'jp',
  Mexico: 'mx',
  Netherlands: 'nl',
  Norway: 'no',
  Poland: 'pl',
  Portugal: 'pt',
  Singapore: 'sg',
  Spain: 'es',
  Sweden: 'se',
  Switzerland: 'ch',
  UK: 'gb',
  USA: 'us',
  Venezuela: 've',
};
export function getCountries() {
  return Object.keys(countryFlagSuffixByCountryName);
}
export function getFlagImageURLByCountryName(
  country: string,
): string | undefined {
  const suffix = countryFlagSuffixByCountryName[country];
  if (!suffix) {
    console.log('Unknown country', country);
    return undefined;
  }
  return `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${suffix}.svg`;
}
