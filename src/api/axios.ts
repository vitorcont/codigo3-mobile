import Axios, { AxiosError, AxiosResponse } from 'axios';
import { MAPBOX_TOKEN, USER_API_URL } from '@mobile/../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum AxiosStatus {
  Unauthorized = 401,
  Forbidden = 403,
}

interface IHandler {
  unauthorizedError: () => void;
}

const handler: IHandler = {
  unauthorizedError: () => {},
};

const userServiceInstance = Axios.create({
  timeout: 10000,
  headers: {
    'content-Type': 'application/json',
  },
});

const mapBoxInstance = Axios.create({
  timeout: 10000,
  headers: {
    'content-Type': 'application/json',
  },
});

export const getApiInstance = async () => {
  const token = await AsyncStorage.getItem('accessToken');

  userServiceInstance.interceptors.request.use((request) => {
    request.baseURL = USER_API_URL;
    if (token && request.headers) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return request;
  });

  userServiceInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (err: AxiosError) => {
      console.log('axios_error', JSON.stringify(err));

      if (err.response?.status === AxiosStatus.Unauthorized) {
        handler.unauthorizedError();
      } else if (err.response?.status === AxiosStatus.Forbidden) {
        // your mechanism to forbidden
      }

      return Promise.reject();
    }
  );

  return userServiceInstance;
};

export const getMapboxInstance = async () => {
  mapBoxInstance.interceptors.request.use((request) => {
    request.baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    request.params = {
      ...request.params,
      country: 'br',
      limit: 6,
      language: 'pt',
      access_token: MAPBOX_TOKEN,
    };

    return request;
  });

  mapBoxInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (err: AxiosError) => {
      console.log('mapbox_error', JSON.stringify(err));

      if (err.response?.status === AxiosStatus.Unauthorized) {
        handler.unauthorizedError();
      } else if (err.response?.status === AxiosStatus.Forbidden) {
        // your mechanism to forbidden
      }

      return Promise.reject();
    }
  );

  return mapBoxInstance;
};

export const setHandleUnauthorizedError = (fn: () => void) => {
  handler.unauthorizedError = fn;
};

export default getApiInstance;
