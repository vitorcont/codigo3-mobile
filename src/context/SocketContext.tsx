import { createContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@mobile/../env.json';

interface ISocketProvider {
  children: React.ReactNode;
}

export interface SocketState {
  createSocket: () => Socket;
  socket: Socket | null;
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider = (props: ISocketProvider) => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const createSocket = () => {
    const socket = io(`${API_URL}/navigation-socket`, {
      transports: ['websocket'],
    });
    console.log(socket);

    setSocketState(socket);

    return socket;
  };

  const values = {
    createSocket,
    socket: socketState,
  };

  return <SocketContext.Provider value={values}>{props.children}</SocketContext.Provider>;
};
