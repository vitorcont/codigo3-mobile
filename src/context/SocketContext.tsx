import { createContext, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@mobile/../env.json';
import { PlaceFound } from '@mobile/models/module';
import { LocationObjectCoords } from 'expo-location';
import { useReduxState } from '@mobile/hooks/useReduxState';

interface ISocketProvider {
  children: React.ReactNode;
}

interface ILocation {
  latitute: number;
  longitude: number;
  priority?: number;
}

interface ISearchRoute {
  origin: ILocation;
  destination: ILocation;
  priority: number;
}

interface IUpdateLocation {
  latitute: number;
  longitude: number;
  priority: number;
}

interface IUserIndividual {
  origin: ILocation | null;
  destination: ILocation | null;
  currentLocation: ILocation | null;
  startedAt: Date | null;
  priority: number;
}

export interface SocketState {
  socketConnect: () => Socket;
  socket: Socket | null;
  socketRegisterUser: () => void;
  socketEndTrip: () => void;
  socketEmitLocation: () => void;
  socketStartTrip: (placePressed: PlaceFound, priority: number) => void;
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

  const socketStartTrip = (placePressed: PlaceFound, priority: number) => {
    socketState!.emit('startTrip', {
      origin: {
        latitute: userLocation!.latitude,
        longitude: userLocation!.longitude,
      },
      destination: {
        latitute: placePressed.center[1],
        longitude: placePressed.center[0],
      },
      priority: priority,
    } as ISearchRoute);
  };

  const socketEmitLocation = () => {
    setTimeout(() => {
      socketState!.emit('updateLocation', {
        latitute: userLocation!.latitude,
        longitude: userLocation!.longitude,
      } as IUpdateLocation);
      socketEmitLocation();
    }, 1000);
  };

  const socketEndTrip = () => {
    socketState!.emit('endTrip', {});
  };

  useEffect(() => {
    socketConnect();
  }, []);

  useEffect(() => {
    if (socketState && socketState.connected) {
      socketEmitLocation();
    }
  }, [socketState?.connected]);

  const values = useMemo(
    () => ({
      socketConnect,
      socket: socketState,
      socketRegisterUser,
      socketStartTrip,
      socketEmitLocation,
      socketEndTrip,
    }),
    [socketState]
  );

  return <SocketContext.Provider value={values}>{props.children}</SocketContext.Provider>;
};
