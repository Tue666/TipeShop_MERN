import { ReactNode, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

// config
import { apiConfig } from '../config/appConfig';

const ENDPOINT = apiConfig.api_url!.substring(0, apiConfig.api_url!.indexOf('/api'));
const socket: Socket = io(ENDPOINT);

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketProvider, SocketContext };
