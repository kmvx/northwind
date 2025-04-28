import React from 'react';
import clsx from 'clsx';
import styles from './Discontinued.module.scss';

const Discontinued: React.FC<{
  discontinued: boolean;
}> = ({ discontinued }) => {
  return (
    <span
      className={clsx(
        'px-2 py-1 rounded small lh-lg',
        discontinued ? styles.discontinued : styles['not-discontinued'],
      )}
      title={`Product is ${discontinued ? '' : 'not '}discontinued`}
    >
      {discontinued ? 'Discontinued' : 'Not discontinued'}
    </span>
  );
};

export default Discontinued;
