import React from 'react';
import clsx from 'clsx';
import { getFlagEmojiByCountryName } from '../utils';

const Flag: React.FC<{
  className?: string;
  country: string;
}> = ({ className, country }) => {
  return (
    <span className={clsx('u-flag', className)} style={{ fontSize: '2rem' }}>
      {getFlagEmojiByCountryName(country)}
    </span>
  );
};

export default Flag;
