import { useContext } from 'react';

// contexts
import { SocketContext } from '../contexts/SocketContext';

const useSocket = () => useContext(SocketContext);

export default useSocket;
