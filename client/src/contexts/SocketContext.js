import { createContext } from 'react';
import io from 'socket.io-client';

// config
import { apiConfig } from '../config';

const ENDPOINT = apiConfig.api_url.substring(0, apiConfig.api_url.indexOf('/api'));
const socket = io(ENDPOINT);

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketProvider, SocketContext };
