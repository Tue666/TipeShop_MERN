import { FC } from 'react';

// components
import Drawer from './components/Drawer';
// hooks
import useAuth from './hooks/useAuth';
// pages
import Loading from './pages/external/Loading';
// routes
import Router from './routes';

const App: FC = () => {
  const { isInitialized } = useAuth();
  return isInitialized ? (
    <>
      <Router />
      <Drawer />
    </>
  ) : (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Loading />
    </div>
  );
};

export default App;
