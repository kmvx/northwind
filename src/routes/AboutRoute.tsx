import React from 'react';
import { setDocumentTitle } from '../utils';
import About from '../components/About';

const AboutRoute: React.FC = () => {
  setDocumentTitle();
  return <About />;
};

export default AboutRoute;
