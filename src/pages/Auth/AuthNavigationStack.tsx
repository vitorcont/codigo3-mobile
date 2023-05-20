import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getUserLocation } from '@mobile/services/location';
import { createStack } from '@mobile/services/navigation';
import Login from './Login/Login';
import Recovery from './Recovery/Recovery';

const AuthNavigationStack = () => {
  const AuthStack = createStack();

  useEffect(() => {
    getUserLocation();
  });

  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Recovery" component={Recovery} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigationStack;
