import React from 'react';
import clsx from 'clsx';

const PanelCentred: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className="container vstack align-items-center">
      <section
        className={clsx(
          className,
          'd-inline-block bg-light shadow rounded p-2',
        )}
      >
        {children}
      </section>
    </div>
  );
};

export default PanelCentred;
