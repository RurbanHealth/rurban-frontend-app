import { useAppDispatch } from '@redux/store/store';
import { getData } from '../../utils/localStorage';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { setPatientLoginInfo } from '@redux/slices/patient';
import { setHospitalLoginInfo } from '@redux/slices/hospital';
import { setAccessToken } from '@redux/slices/app/appConfig';

const Splash: React.FC = ({navigation}: any) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        (async () => {
            // 1. load user key from local storage.
            const user = await getData('user');
            if (!user) {
                // 2. If no user then return to the start screen.
                navigation.navigate("UserSelection", {data: null})
            } else {
                // 3. If user found then parse and check what user type. 
                let parsedUser = JSON.parse(user);
                // 4. Set access token in app config slice.
                dispatch(setAccessToken(parsedUser.token))
                // 5. Based on the user type navigate to the respective dashboard.
                if (parsedUser.userType === "Patient") {
                    // 6. Set login info to patient slice
                    dispatch(setPatientLoginInfo(parsedUser))
                    navigation.navigate("Patient", {data: parsedUser})
                }
                if (parsedUser.userType === "Hospital") {
                    // 7. Set login info to hospital slice
                    dispatch(setHospitalLoginInfo(parsedUser))
                    navigation.navigate("Hospital", {data: parsedUser})
                }
            }
        })()
    }, [])
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("@assets/logo.png")} />
            <Text style={styles.appName}>Rurban Health</Text>
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#35548c',
        // backgroundColor:'#17a4e0',
        // backgroundColor:'#17a4e0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100
    },
    appName: {
        fontSize: 20, marginTop: 20
    }
});