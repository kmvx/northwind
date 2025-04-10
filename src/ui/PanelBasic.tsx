import React from 'react';
import clsx from 'clsx';

export default function PanelBasic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <section className={clsx(className, 'bg-light shadow rounded p-2')}>
      {children}
    </section>
  );
}
