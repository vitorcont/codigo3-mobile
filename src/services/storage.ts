import { StorageItems } from '@mobile/enum/storage';
import * as SecureStore from 'expo-secure-store';

const StorageService = {
  getItem: async (key: StorageItems) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: StorageItems, value: any) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: StorageItems) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export default StorageService;
