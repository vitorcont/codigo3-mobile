import { NavigationContainer } from '@react-navigation/native';
import React, { PureComponent } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from '@mobile/services/navigation';
import FlashMessage from 'react-native-flash-message';
import RootNavigationStack from './pages/RootNavigationStack';
import { SocketProvider } from './context/SocketContext';
import { LoadingModal } from './components';
import { useReduxState } from './hooks/useReduxState';

const AppContent = () => {
  const { loading } = useReduxState();
  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <LoadingModal setVisible={() => {}} visible={loading > 0} />
      <NavigationContainer ref={navigationRef}>
        <RootNavigationStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppContent;
