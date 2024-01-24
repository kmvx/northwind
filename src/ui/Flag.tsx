import { getFlagEmojiByCountryName } from '../utils';
import clsx from 'clsx';

export default function Flag({
  className,
  country,
}: {
  className?: string;
  country: string;
}): JSX.Element {
  return (
    <span className={clsx('u-flag', className)} style={{ fontSize: '2rem' }}>
      {getFlagEmojiByCountryName(country)}
    </span>
  );
}
