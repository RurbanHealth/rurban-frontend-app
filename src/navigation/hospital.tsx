import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HospitalSignup from '@screens/hospital/auth/HospitalSignup';
import HospitalForgotPassword from '@screens/hospital/auth/HospitalForgotPassword';
import { useRoute } from '@react-navigation/native';
import HospitalHome from '@screens/hospital/dashboard/HospitalHome';
import AccountVerification from '@screens/common/AccountVerification';
import Login from '@screens/common/Login';
import Box from '@components/Layout/Box';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import Typography from '@components/Typography/Typography';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { getData, removeData } from '@utils/localStorage';

const HospitalStack = createStackNavigator();
const HospitalDrawer = createDrawerNavigator();

const HospitalDrawerContent = (props: any) => {
  return (
    <Box flex={1} style={{ backgroundColor: '#fff' }} padding={20}>
      {/* <Box style={{ borderBottomWidth: 0.5 }} flexDirection='row'>
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
      </Box> */}
      <TouchableOpacity onPress={() => {
        
        (async()=>{
          await removeData("user")
          props.navigation.navigate("Login")
        }
      )()
      }}>
        <Box style={{ borderBottomWidth: 0.5 }} flexDirection='row'>
          <Icon name='logout' size={25} style={{ marginBottom: 5 }} />
          <Typography style={{ marginBottom: 5, marginLeft: 5 }}>Logout</Typography>
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

const HospitalDrawerNavigator = () => {
  return (
    <HospitalDrawer.Navigator initialRouteName="PatientHome" drawerContent={HospitalDrawerContent} screenOptions={{ headerShown: false }}>
      <HospitalDrawer.Screen name="PatientHome" component={HospitalHome} />
    </HospitalDrawer.Navigator>
  );
};

const HospitalNavigator = () => {
  const route: any = useRoute();
  console.log('User data passed to Hospital navigator:', route.params);

  return (
    <HospitalStack.Navigator initialRouteName={"HospitalDrawer"} screenOptions={{ headerShown: false }}>
      <HospitalStack.Screen name="HospitalSignup" component={HospitalSignup} />
      <HospitalStack.Screen name="AccountVerification" component={AccountVerification} />
      <HospitalStack.Screen name="HospitalForgotPassword" component={HospitalForgotPassword} />
      <HospitalStack.Screen name="HospitalDrawer" component={HospitalDrawerNavigator}/>
    </HospitalStack.Navigator>
  );
};

export default HospitalNavigator;
