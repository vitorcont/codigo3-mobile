import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import AppContent from '@mobile/AppContent';
import * as SplashScreen from 'expo-splash-screen';
import store from '@mobile/store';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

SplashScreen.preventAutoHideAsync();

const App = () => {
  let [fontsloaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsloaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsloaded]);

  if (!fontsloaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar style="dark" />
        <AppContent />
      </Provider>
    </View>
  );
};

export default App;
