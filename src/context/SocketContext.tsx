import { createContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@mobile/../env.json';
import { PlaceFound } from '@mobile/models/module';
import { LocationObjectCoords } from 'expo-location';
import { useReduxState } from '@mobile/hooks/useReduxState';

interface ISocketProvider {
  children: React.ReactNode;
}

export interface SocketState {
  socketConnect: () => Socket;
  socket: Socket | null;
  socketRegisterUser: () => void;
  socketEmitLocation: (userLocation: LocationObjectCoords) => void;
  socketStartTrip: (userLocation: LocationObjectCoords, placePressed: PlaceFound) => void;
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider = (props: ISocketProvider) => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const {
    user: { userLocation },
  } = useReduxState();

  const socketConnect = () => {
    const socket = io(`${API_URL}/navigation-socket`, {
      transports: ['websocket'],
    });
    setSocketState(socket);

    return socket;
  };

  const socketRegisterUser = () => {
    socketState!.emit('registerUser', { userId: 1 });
  };

  const socketStartTrip = (userLocation: LocationObjectCoords, placePressed: PlaceFound) => {
    socketState!.emit('startTrip', {
      origin: userLocation,
      destination: placePressed,
    });
  };

  const socketEmitLocation = (userLocation: LocationObjectCoords) => {
    setTimeout(() => {
      socketState!.emit('updateLocation', userLocation);
      socketEmitLocation(userLocation);
    }, 1000);
  };

  useEffect(() => {
    socketConnect();
  }, []);

  useEffect(() => {
    if (socketState && socketState.connected) {
      socketEmitLocation(userLocation!);
    }
  }, [socketState?.connected]);

  const values = {
    socketConnect,
    socket: socketState,
    socketRegisterUser,
    socketStartTrip,
    socketEmitLocation,
  };

  return <SocketContext.Provider value={values}>{props.children}</SocketContext.Provider>;
};
