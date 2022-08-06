import { useContext } from 'react';

// contexts
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
