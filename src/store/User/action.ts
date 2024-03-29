import navigationService from '@mobile/services/navigation';
import { startLoading, stopLoading } from './../Loading/action';
import { LOGOUT, SET_USER } from './../actionsType';
import { LocationObjectCoords } from 'expo-location';
import { Dispatch } from 'redux';
import getApiInstance from '@mobile/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authenticate =
  (userData: models.IUserAuth, callback: (success: boolean) => void) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(startLoading());
      const instance = await getApiInstance();
      const { data } = await instance.post('/auth/login', userData);
      await AsyncStorage.setItem('accessToken', data.accessToken);

      callback(true);
    } catch (err) {
      console.log('auth_error', err);
      callback(false);
    } finally {
      dispatch(stopLoading());
    }
  };

export const actionLogout = () => async (dispatch: Dispatch) => {
  await AsyncStorage.removeItem('accessToken');
  dispatch({
    type: LOGOUT,
  });
  navigationService.reset({ index: 0, routes: [{ name: 'Auth' }] });
};

export const getMe = (callback: (success: boolean) => void) => async (dispatch: Dispatch) => {
  try {
    dispatch(startLoading());
    const token = await AsyncStorage.getItem('accessToken');
    const instance = await getApiInstance(token ?? '');
    const { data } = await instance.get('/users/me');

    dispatch({
      type: SET_USER,
      payload: data,
    });

    callback(true);
  } catch (err) {
    console.log('getMe_error', err);
    callback(false);
  } finally {
    dispatch(stopLoading());
  }
};

export const sendRecovery =
  (email: string, callback: (success: boolean) => void) => async (dispatch: Dispatch) => {
    try {
      dispatch(startLoading());
      const token = await AsyncStorage.getItem('accessToken');
      const instance = await getApiInstance(token ?? '');
      await instance.post('/auth/recovery-request', { email });

      callback(true);
    } catch (err) {
      callback(false);
    } finally {
      dispatch(stopLoading());
    }
  };

export const changePassword =
  (email: string, code: string, newPassword: string, callback: (success: boolean) => void) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(startLoading());
      const token = await AsyncStorage.getItem('accessToken');
      const instance = await getApiInstance(token ?? '');
      await instance.post('/auth/recovery-request', {
        oldPassword: code,
        newPassword,
        email,
      });

      callback(true);
    } catch (err) {
      callback(false);
    } finally {
      dispatch(stopLoading());
    }
  };
