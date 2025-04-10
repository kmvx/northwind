import React from 'react';
import clsx from 'clsx';

export default function PanelStretched({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <section
      className={clsx(className, 'container bg-light shadow rounded p-2')}
    >
      {children}
    </section>
  );
}
