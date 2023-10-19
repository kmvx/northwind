import clsx from 'clsx';

export default function PanelCentred({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className="container vstack align-items-center">
      <section
        className={clsx(
          className,
          'd-inline-block bg-light shadow rounded p-2 my-2',
        )}
      >
        {children}
      </section>
    </div>
  );
}
