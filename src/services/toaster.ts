import { showMessage } from 'react-native-flash-message';
import Window from './dimensions';

const Toaster = {
  success: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: 'success',
      backgroundColor: 'green',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
    }),

  error: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: 'danger',
      backgroundColor: 'red',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
    }),

  warning: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: 'warning',
      backgroundColor: 'orange',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
    }),

  info: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: 'info',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
    }),
};

export default Toaster;
