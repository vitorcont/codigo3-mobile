import Axios, { AxiosError, AxiosResponse } from 'axios';

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

const axiosInstance = Axios.create({
  timeout: 10000,
  headers: {
    'content-Type': 'application/json',
  },
});

export const getApiInstance = async () => {
  axiosInstance.interceptors.request.use((request) => {
    request.baseURL = 'localhost';
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (err: AxiosError) => {
      console.log(err);
      if (err.response?.status === AxiosStatus.Unauthorized) {
        handler.unauthorizedError();
      } else if (err.response?.status === AxiosStatus.Forbidden) {
        // your mechanism to forbidden
      }

      return Promise.reject();
    }
  );

  return axiosInstance;
};

export const getMapboxInstance = async () => {
  axiosInstance.interceptors.request.use((request) => {
    request.baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    request.params = {
      proximity: '',
      country: 'br',
      limit: 10,
      language: 'pt',
      access_token: process.env.MAPBOX_TOKEN,
    };
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (err: AxiosError) => {
      console.log(err);
      if (err.response?.status === AxiosStatus.Unauthorized) {
        handler.unauthorizedError();
      } else if (err.response?.status === AxiosStatus.Forbidden) {
        // your mechanism to forbidden
      }

      return Promise.reject();
    }
  );

  return axiosInstance;
};

export const setHandleUnauthorizedError = (fn: () => void) => {
  handler.unauthorizedError = fn;
};

export default getApiInstance;
