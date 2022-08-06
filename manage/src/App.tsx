import { FC } from 'react';

// hooks
import useAuth from './hooks/useAuth';
// routes
import Router from './routes';

const App: FC = () => {
  const { isInitialized } = useAuth();
  return isInitialized ? <Router /> : <p>Loading...</p>;
};

export default App;
