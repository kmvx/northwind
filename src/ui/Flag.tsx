import React from 'react';
import clsx from 'clsx';
import { getFlagEmojiByCountryName } from '../utils';

export default function Flag({
  className,
  country,
}: {
  className?: string;
  country: string;
}): React.JSX.Element {
  return (
    <span className={clsx('u-flag', className)} style={{ fontSize: '2rem' }}>
      {getFlagEmojiByCountryName(country)}
    </span>
  );
}
