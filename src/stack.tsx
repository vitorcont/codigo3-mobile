import React from 'react';
import Map from './pages/Map';
import { createStack } from './services/navigation';

const Navigator = () => {
  const MainStack = createStack();

  return (
    <MainStack.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Map" component={Map} />
    </MainStack.Navigator>
  );
};

export default Navigator;
