import * as React from 'react';

const YearFilterButtons: React.FC<{
  minYear?: number;
  maxYear?: number;
  yearFilter?: number;
  setYearFilter: (year?: number) => void;
}> = ({ minYear, maxYear, yearFilter, setYearFilter }) => {
  const id = React.useId();
  const yearsArray =
    minYear === undefined || maxYear === undefined
      ? []
      : Array.from({ length: maxYear - minYear + 1 }).map(
          (_, index) => minYear + index,
        );
  return (
    <div className="btn-group flex-wrap align-items-center m-2">
      <input
        type="radio"
        className="btn-check"
        id={id}
        name="YearFilterRadio"
        autoComplete="off"
        checked={yearFilter === undefined}
        onChange={() => setYearFilter()}
      />
      <label
        className="btn btn-outline-primary py-2 px-3"
        htmlFor={id}
        title="All years"
      >
        All
      </label>
      {yearsArray.map((v) => (
        <React.Fragment key={v}>
          <input
            type="radio"
            className="btn-check"
            id={id + v}
            name={'YearFilterRadio' + v}
            autoComplete="off"
            checked={yearFilter === v}
            onChange={() => setYearFilter(v)}
          />
          <label
            className="btn btn-outline-primary py-2 px-3"
            htmlFor={id + v}
            title={v + ' year'}
          >
            {v}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default YearFilterButtons;
