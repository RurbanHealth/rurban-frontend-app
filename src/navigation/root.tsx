import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartUpNavigator from './startup';
import PatientDrawerNavigator from './patient';
import HospitalStack from './hospital';

const RootStack = createStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="StartUp" screenOptions={{headerShown: false}}>
      {/* Intital Flow */}
      <RootStack.Screen name="StartUp" component={StartUpNavigator} />

      {/* Patient Drawer Navigation */}
      <RootStack.Screen name="Patient" component={PatientDrawerNavigator} />

      {/* Hospital Stack */}
      <RootStack.Screen name="Hospital" component={HospitalStack} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;