import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_API_URL } from '@mobile/../env.json';
import { PlaceFound } from '@mobile/models/module';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { useDispatch } from 'react-redux';
import { setActiveRoute } from '@mobile/store/Places/action';
import { LocationContext } from './LocationContext';
import { setLoading, startLoading } from '@mobile/store/Loading/action';
import { LocationObjectCoords } from 'expo-location';

interface ISocketProvider {
  children: React.ReactNode;
}

export interface SocketState {
  socketConnect: () => Socket;
  socket: Socket | null;
  socketRegisterUser: () => void;
  socketEndTrip: () => void;
  socketEmitLocation: () => void;
  socketReloadPath: () => void;
  socketStartTrip: (placePressed: PlaceFound, priority: number, user: LocationObjectCoords) => void;
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider = (props: ISocketProvider) => {
  const {
    user: { userData },
  } = useReduxState();
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const [travelInfo, setTravelInfo] = useState<models.IUserIndividual>({
    userId: userData?.id!,
    currentLocation: null,
    destination: null,
    geometry: [],
    origin: null,
    priority: 0,
    startedAt: null,
  });
  const dispatch = useDispatch();
  const { userLocation } = useContext(LocationContext)!;

  const socketConnect = () => {
    const socket = io(`${SOCKET_API_URL}/navigation`, {
      path: '/codigo3/socket-services',
      transports: ['websocket'],
    });
    setSocketState(socket);

    socket.on('retryRegistration', () => {
      socketRegisterUser();
    });

    return socket;
  };

  const socketRegisterUser = () => {
    try {
      socketState!.emit('registerUser', { userId: userData!.id ?? 1 });
      socketEmitLocation();
    } catch (err) {
      socketState?.disconnect();
      socketConnect();
    }
  };

  const socketStartTrip = async (
    placePressed: PlaceFound,
    priority: number,
    user: LocationObjectCoords
  ) => {
    console.log('start trip');
    dispatch(setLoading(1));
    socketState!.emit('startTrip', {
      origin: {
        latitude: user.latitude,
        longitude: user.longitude,
      },
      destination: {
        latitude: placePressed.center[1],
        longitude: placePressed.center[0],
      },
      priority: priority,
    } as models.ISearchRoute);
    const date = new Date();
    socketState!.on('tripPath', (route: mapbox.MapboxglRouteList) => {
      console.log('recievedPath');
      dispatch(setActiveRoute(route));
      dispatch(setLoading(0));
      setTravelInfo({
        userId: userData?.id!,
        origin: {
          latitude: user.latitude,
          longitude: user.longitude,
        },
        destination: {
          latitude: placePressed.center[1],
          longitude: placePressed.center[0],
        },
        currentLocation: {
          latitude: user.latitude,
          longitude: user.longitude,
        },
        priority: priority,
        startedAt: travelInfo.startedAt ?? date,
        geometry: route.routes[0].geometry.coordinates,
      });
    });
    setTimeout(() => {
      dispatch(setLoading(0));
    }, 10000);
  };

  const socketEmitLocation = () => {
    console.log(travelInfo);
    try {
      socketState!.emit('updateLocation', {
        ...travelInfo,
        currentLocation: {
          latitude: userLocation!.latitude,
          longitude: userLocation!.longitude,
        },
      } as models.IUserIndividual);
    } catch (err) {
      socketRegisterUser();
    }
  };

  const socketEndTrip = () => {
    socketState!.emit('endTrip', {});
    setTravelInfo({
      ...travelInfo,
      destination: null,
      geometry: [],
      origin: null,
      priority: 0,
      startedAt: null,
    });
  };

  const socketReloadPath = () => {
    console.log('Retry');
    dispatch(setLoading(1));
    socketState!.emit('reloadPath', {});
    setTimeout(() => {
      dispatch(setLoading(0));
    }, 10000);
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
      socketReloadPath,
    }),
    [socketState]
  );

  return <SocketContext.Provider value={values}>{props.children}</SocketContext.Provider>;
};
