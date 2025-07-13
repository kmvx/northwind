import * as React from 'react';
import './App.scss';
import Providers from './Providers';
import MainRouter from './routes/MainRouter';
import { NotificationHost } from './features/notification/NotificationHost';

const App: React.FC = () => {
  return (
    <Providers>
      <MainRouter />
      <NotificationHost />
    </Providers>
  );
};

export default App;
