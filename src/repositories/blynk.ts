import getInstance from '@mobile/api/axios';

const BlynkAPI = {
  getLatitude: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v1: '',
      },
    });

    return data;
  },
  getLongitude: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v2: '',
      },
    });

    return data;
  },
  getAltitude: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v3: '',
      },
    });

    return data;
  },
  getSpeed: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v7: '',
      },
    });

    return data;
  },
  getDeviceConnection: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('isHardwareConnected');

    return data;
  },
  getMapsLink: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v6: '',
      },
    });

    return data;
  },
  getDatetime: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v8: '',
      },
    });

    return data;
  },
  getBearing: async () => {
    const instance = await getInstance();
    const { data } = await instance.get('/get', {
      params: {
        v9: '',
      },
    });

    return data;
  },
};

export default BlynkAPI;
