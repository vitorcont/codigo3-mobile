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

export const getInstance = async () => {
  const axiosInstance = Axios.create({
    baseURL: 'https://blynk.cloud/external/api',
    timeout: 10000,
    headers: {
      'content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((request) => {
    const params = request.params ?? {};

    request.params = {
      token: '1yw2ioo_VrjmcInu3GGsvvzKh8sUqzyx',
      ...params,
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

export default getInstance;
