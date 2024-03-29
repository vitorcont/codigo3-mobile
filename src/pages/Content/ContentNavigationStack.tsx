import React from 'react';
import { createStack } from '@mobile/services/navigation';
import Map from './Map/Map';
import { SocketProvider } from '@mobile/context/SocketContext';
import { LocationProvider } from '@mobile/context/LocationContext';
import { SearchProvider } from '@mobile/context/SearchContext';

const ContentNavigationStack = () => {
  const ContentStack = createStack();

  return (
    <LocationProvider>
      <SocketProvider>
        <SearchProvider>
          <ContentStack.Navigator
            initialRouteName="Map"
            screenOptions={{
              headerShown: false,
            }}>
            <ContentStack.Screen name="Map" component={Map} />
          </ContentStack.Navigator>
        </SearchProvider>
      </SocketProvider>
    </LocationProvider>
  );
};

export default ContentNavigationStack;
