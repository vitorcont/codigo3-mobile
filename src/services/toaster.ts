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
      icon: {
        icon: 'success',
        position: 'left',
        props: {},
      },
    }),

  error: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: [RiskStatusEnum.DANGER],
      backgroundColor: 'red',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
      icon: {
        icon: [RiskStatusEnum.DANGER],
        position: 'left',
        props: {},
      },
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
      icon: {
        icon: 'warning',
        position: 'left',
        props: {},
      },
    }),

  info: (message: string, description: string) =>
    showMessage({
      message,
      description,
      type: 'info',
      color: 'white',
      hideOnPress: true,
      statusBarHeight: Window.heightScale(0.06),
      icon: {
        icon: 'info',
        position: 'left',
        props: {},
      },
    }),
};

export default Toaster;
