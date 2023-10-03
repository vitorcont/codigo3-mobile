import { createContext, useEffect } from 'react';
import { Accuracy, watchPositionAsync } from 'expo-location';
import { setUserLocation } from '@mobile/store/User/action';
import { useDispatch } from 'react-redux';

interface ILocationProvider {
  children: React.ReactNode;
}

export interface ILocationContext {}

export const LocationContext = createContext<ILocationContext | null>(null);

export const LocationProvider = (props: ILocationProvider) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const watchLocation = async () => {
      try {
        const watchId = await watchPositionAsync(
          { accuracy: Accuracy.High, timeInterval: 500, distanceInterval: 5 },
          (position) => {
            console.log('AAAAAA', position);
            if (position) {
              dispatch(setUserLocation(position.coords));
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

  const values = {};

  return <LocationContext.Provider value={values}>{props.children}</LocationContext.Provider>;
};
