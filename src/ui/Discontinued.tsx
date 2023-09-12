import styles from './Discontinued.module.scss';

export default function Discontinued({
  discontinued,
}: {
  discontinued: boolean;
}): JSX.Element {
  return (
    <span
      className={
        'px-2 py-1 rounded small ' +
        (discontinued ? styles.discontinued : styles['not-discontinued'])
      }
      title={`Product is ${discontinued ? '' : 'not '}discontinued`}
    >
      {discontinued ? 'Discontinued' : 'Not discontinued'}
    </span>
  );
}
