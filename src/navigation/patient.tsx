import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import PatientSignup from '@screens/patient/auth/PatientSignup';
import PatientForgotPassword from '@screens/patient/auth/PatientForgotPassword';
import PatientHome from '@screens/patient/dashboard/PatientHome';
import { useRoute } from '@react-navigation/native';
import Box from '@components/Layout/Box';
import Typography from '@components/Typography/Typography';
import Icon from "react-native-vector-icons/MaterialIcons"
import { TouchableOpacity } from 'react-native';
import AccountVerification from '@screens/common/AccountVerification';
import { removeData } from '@utils/localStorage';

const PatientStack = createStackNavigator();
const PatientDrawer = createDrawerNavigator();

const PatientDrawerContent = (props: any) => {
  return (
    <Box flex={1} style={{ backgroundColor: '#fff' }} padding={20}>
      <Box style={{ borderBottomWidth: 0.5 }} flexDirection='row'>
        <Icon name='home' size={25} style={{ marginBottom: 5 }} />
        <Typography style={{ marginBottom: 5, marginLeft: 5 }}>Home</Typography>
      </Box>
      <Box style={{ marginVertical: 40, borderBottomWidth: 0.5 }} flexDirection='row'>
        <Icon name='punch-clock' size={25} style={{ marginBottom: 5 }} />
        <Typography style={{ marginBottom: 5, marginLeft: 5 }}>My Checkins</Typography>
      </Box>
      <Box style={{ borderBottomWidth: 0.5, marginBottom: 40, }} flexDirection='row'>
        <Icon name='local-hospital' size={25} style={{ marginBottom: 5 }} />
        <Typography style={{ marginBottom: 5, marginLeft: 5 }}>Hospitals</Typography>
      </Box>
      <TouchableOpacity onPress={() => {
        (async()=>{
          await removeData("user")
          props.navigation.navigate("Login")
        })()
        
        }}>
        <Box style={{ borderBottomWidth: 0.5 }} flexDirection='row'>
          <Icon name='logout' size={25} style={{ marginBottom: 5 }} />
          <Typography style={{ marginBottom: 5, marginLeft: 5 }}>Logout</Typography>
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

const PatientDrawerNavigator = () => {
  return (
    <PatientDrawer.Navigator initialRouteName="PatientHome" drawerContent={PatientDrawerContent} screenOptions={{ headerShown: false }}>
      <PatientDrawer.Screen name="PatientHome" component={PatientHome} />
    </PatientDrawer.Navigator>
  );
};

const PatientNavigator = () => {
  const route: any = useRoute();
  console.log('User data passed to Patient navigator:', route.params);

  return (
    <PatientStack.Navigator initialRouteName={"PatientDrawer"} screenOptions={{ headerShown: false }}>
      <PatientStack.Screen name="PatientSignup" component={PatientSignup} />
      <PatientStack.Screen name="AccountVerification" component={AccountVerification} />
      <PatientStack.Screen name="PatientForgotPassword" component={PatientForgotPassword} />
      <PatientStack.Screen name="PatientDrawer" component={PatientDrawerNavigator} />
    </PatientStack.Navigator>
  );
};


export default PatientNavigator;
