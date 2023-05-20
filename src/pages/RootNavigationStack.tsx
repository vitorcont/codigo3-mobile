import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getUserLocation } from '@mobile/services/location';
import { createStack } from '@mobile/services/navigation';
import AuthNavigationStack from './Auth/AuthNavigationStack';
import ContentNavigationStack from './Content/ContentNavigationStack';

const RootNavigationStack = () => {
  const RootStack = createStack();

  useEffect(() => {
    getUserLocation();
  });

  return (
    <RootStack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="Auth" component={AuthNavigationStack} />
      <RootStack.Screen name="Content" component={ContentNavigationStack} />
    </RootStack.Navigator>
  );
};

export default RootNavigationStack;
