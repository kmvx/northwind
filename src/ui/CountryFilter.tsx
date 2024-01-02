import clsx from 'clsx';
import { getCountries, getFlagEmojiByCountryName } from '../utils';

export default function CountryFilter({
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
    <div className={clsx('input-group', className)}>
      <span className="input-group-text">Country</span>
      <select
        className={clsx('form-select h-100')}
        onChange={onChange}
        value={countryFilter}
        title="Country filter"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {getFlagEmojiByCountryName(option)} &nbsp; {option || 'World'}
          </option>
        ))}
      </select>
    </div>
  );
}
