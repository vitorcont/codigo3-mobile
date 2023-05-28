import { NavigationContainer } from '@react-navigation/native';
import React, { PureComponent } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from '@mobile/services/navigation';
import FlashMessage from 'react-native-flash-message';
import RootNavigationStack from './pages/RootNavigationStack';

const AppContent = () => {
  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <NavigationContainer ref={navigationRef}>
        <RootNavigationStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppContent;
