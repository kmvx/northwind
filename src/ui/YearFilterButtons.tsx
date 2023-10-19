import * as React from 'react';

const YearFilterButtons: React.FC<{
  yearsSet: Set<number>;
  yearFilter?: number;
  setYearFilter: (year?: number) => void;
}> = ({ yearsSet, yearFilter, setYearFilter }) => {
  if (yearsSet.size === 0) return <></>;
  const id = React.useId();
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
      {Array.from(yearsSet).map((v) => (
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
