import * as React from 'react';
import clsx from 'clsx';

const YearFilterButtons: React.FC<{
  className?: string;
  yearsSet: Set<number>;
  yearFilter?: number;
  setYearFilter: (year?: number) => void;
}> = ({ className, yearsSet, yearFilter, setYearFilter }) => {
  const id = React.useId();
  if (yearsSet.size <= 1) return <></>;
  return (
    <div className={clsx('btn-group flex-wrap align-items-center', className)}>
      <input
        type="radio"
        className="btn-check"
        id={id}
        name={'YearFilterRadio' + id}
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
            name={'YearFilterRadio' + id + v}
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
