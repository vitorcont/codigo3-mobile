import React from 'react';
import { createStack } from '@mobile/services/navigation';
import Map from './Map/Map';

const ContentNavigationStack = () => {
  const ContentStack = createStack();

  return (
    <ContentStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}>
      <ContentStack.Screen name="Map" component={Map} />
    </ContentStack.Navigator>
  );
};

export default ContentNavigationStack;
