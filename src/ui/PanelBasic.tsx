import React from 'react';
import clsx from 'clsx';

const PanelBasic: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <section className={clsx(className, 'bg-light shadow rounded p-2')}>
      {children}
    </section>
  );
};

export default PanelBasic;
