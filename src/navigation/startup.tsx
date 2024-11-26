import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '@screens/startup/Splash';
import UserSelection from '@screens/startup/UserSelection';
import Login from '@screens/common/Login';

const StartUpStack = createStackNavigator();

const StartUpNavigator = () => {
  return (
    <StartUpStack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
      <StartUpStack.Screen name="Splash" component={Splash} />
      <StartUpStack.Screen name="UserSelection" component={UserSelection} />
      <StartUpStack.Screen name="Login" component={Login} />
    </StartUpStack.Navigator>
  );
};

export default StartUpNavigator;
