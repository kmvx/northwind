import React from 'react';
import { setDocumentTitle } from '../utils';

const NotFound: React.FC = () => {
  setDocumentTitle('Page not found');
  return <h3 className="text-center m-5">Page not found</h3>;
};

export default NotFound;
