import React from 'react';
import { setDocumentTitle } from '../utils';

export default function NotFound(): React.JSX.Element {
  setDocumentTitle('Page not found');
  return <h3 className="text-center m-5">Page not found</h3>;
}
