import * as React from 'react';
import './App.scss';
import Providers from './Providers';
import { MainRouter } from './routes';

const App: React.FC = () => {
  return (
    <Providers>
      <MainRouter />
    </Providers>
  );
};

export default App;
