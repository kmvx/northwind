import { getFlagEmojiByCountryName } from '../utils';

export default function Flag({
  className,
  country,
}: {
  className?: string;
  country: string;
}): JSX.Element {
  return (
    <span className={className} style={{ fontSize: '2rem' }}>
      {getFlagEmojiByCountryName(country)}
    </span>
  );
}
