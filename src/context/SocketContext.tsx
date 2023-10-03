import { createContext, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@mobile/../env.json';
import { PlaceFound } from '@mobile/models/module';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { LocationObjectCoords } from 'expo-location';
import { useDispatch } from 'react-redux';
import { setActiveRoute } from '@mobile/store/Places/action';

interface ISocketProvider {
  children: React.ReactNode;
}

export interface SocketState {
  socketConnect: () => Socket;
  socket: Socket | null;
  socketRegisterUser: () => void;
  socketEndTrip: () => void;
  socketEmitLocation: () => void;
  socketStartTrip: (placePressed: PlaceFound, priority: number, user: LocationObjectCoords) => void;
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider = (props: ISocketProvider) => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const {
    user: { userLocation },
  } = useReduxState();
  const dispatch = useDispatch();

  const socketConnect = () => {
    console.log('CONECTOU');
    const socket = io(`${API_URL}/navigation-socket`, {
      transports: ['websocket'],
    });
    setSocketState(socket);

    socket.on('retryRegistration', () => {
      socketRegisterUser();
    });

    socket.on('tripPath', (route: any) => {
      dispatch(setActiveRoute(route));
    });

    return socket;
  };

  const socketRegisterUser = () => {
    try {
      socketState!.emit('registerUser', { userId: 1 });
      socketEmitLocation();
    } catch (err) {
      console.log(err);
      socketState?.disconnect();
      socketConnect();
    }
  };

  const socketStartTrip = (
    placePressed: PlaceFound,
    priority: number,
    user: LocationObjectCoords
  ) => {
    socketState!.emit('startTrip', {
      origin: {
        latitute: user.latitude,
        longitude: user.longitude,
      },
      destination: {
        latitute: placePressed.center[1],
        longitude: placePressed.center[0],
      },
      priority: priority,
    } as models.ISearchRoute);
  };

  const socketEmitLocation = () => {
    try {
      socketState!.emit('updateLocation', {
        latitute: userLocation!.latitude,
        longitude: userLocation!.longitude,
      } as models.IUpdateLocation);
    } catch (err) {
      console.log('A');
      socketRegisterUser();
    }
  };

  const socketEndTrip = () => {
    socketState!.emit('endTrip', {});
  };

  useEffect(() => {
    socketConnect();
  }, []);

  useEffect(() => {
    if (socketState && socketState.connected) {
      socketRegisterUser();
    }
  }, [socketState?.connected]);

  useEffect(() => {
    if (userLocation) {
      socketEmitLocation();
    }
  }, [userLocation]);

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
