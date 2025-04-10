import React from 'react';

export default function WaitSpinner(): React.JSX.Element {
  return (
    <div className="hstack justify-content-center">
      <div className="spinner-border m-5"></div>
    </div>
  );
}
