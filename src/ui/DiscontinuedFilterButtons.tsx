import React from 'react';

const DiscontinuedFilterButtons: React.FC<{
  discontinuedFilter?: boolean;
  setDicontinuedFilter: (discontinuedFilter?: boolean) => void;
}> = ({ discontinuedFilter, setDicontinuedFilter }) => {
  const id1 = React.useId();
  const id2 = React.useId();
  const id3 = React.useId();
  return (
    <div className="btn-group flex-wrap align-items-center m-2">
      <input
        type="radio"
        className="btn-check"
        id={id1}
        name="discontinuedFilterRadio"
        autoComplete="off"
        checked={discontinuedFilter === undefined}
        onChange={() => setDicontinuedFilter()}
      />
      <label className="btn btn-outline-primary py-2 px-3" htmlFor={id1}>
        All
      </label>
      <input
        type="radio"
        className="btn-check"
        id={id2}
        name="discontinuedFilterRadio"
        autoComplete="off"
        checked={discontinuedFilter === true}
        onChange={() => setDicontinuedFilter(true)}
      />
      <label className="btn btn-outline-primary py-2 px-3" htmlFor={id2}>
        Discontinued
      </label>
      <input
        type="radio"
        className="btn-check"
        id={id3}
        name="discontinuedFilterRadio"
        autoComplete="off"
        checked={discontinuedFilter === false}
        onChange={() => setDicontinuedFilter(false)}
      />
      <label className="btn btn-outline-primary py-2 px-3" htmlFor={id3}>
        Not&nbsp;discontinued
      </label>
    </div>
  );
};

export default DiscontinuedFilterButtons;
