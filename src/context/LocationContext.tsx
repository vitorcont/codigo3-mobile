import { createContext, useEffect, useState } from 'react';
import { Accuracy, LocationObjectCoords, watchPositionAsync } from 'expo-location';

interface ILocationProvider {
  children: React.ReactNode;
}

export interface ILocationContext {
  userLocation: LocationObjectCoords | null;
}

export const LocationContext = createContext<ILocationContext | null>(null);

export const LocationProvider = (props: ILocationProvider) => {
  const [userLocation, setUserLocation] = useState<LocationObjectCoords | null>(null);

  useEffect(() => {
    const watchLocation = async () => {
      try {
        const watchId = await watchPositionAsync(
          { accuracy: Accuracy.BestForNavigation, timeInterval: 500, distanceInterval: 1 },
          (position) => {
            if (position) {
              setUserLocation(position.coords);
            }
          }
        );

        return () => {
          watchId.remove();
        };
      } catch (error) {
        console.log('Error watching location:', error);
      }
    };

    watchLocation();
  }, []);

  const values = {
    userLocation,
  };

  return <LocationContext.Provider value={values}>{props.children}</LocationContext.Provider>;
};
