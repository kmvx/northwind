import clsx from 'clsx';
import { getCountries } from '../utils';

export default function CountryFilterDropdown({
  className,
  countryFilter,
  setCountryFilter,
  countries,
}: {
  className?: string;
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  countries?: string[];
}): JSX.Element {
  const options = ['', ...(countries || getCountries())];
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryFilter(event.target.value);
  };
  return (
    <select
      className={clsx('form-select', className)}
      onChange={onChange}
      defaultValue={countryFilter}
      title="Country filter"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option || 'World'}
        </option>
      ))}
    </select>
  );
}
