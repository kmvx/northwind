import clsx from 'clsx';

export default function PanelStretched({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section
      className={clsx(className, 'container bg-light shadow rounded p-2 my-2')}
    >
      {children}
    </section>
  );
}
