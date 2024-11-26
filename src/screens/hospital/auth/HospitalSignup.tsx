import React, { useState } from 'react';
import { NativeModules, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HospitalSignupData } from 'src/typescript/interfaces/hospital';
import { hospitalSignupSchema } from '@validations/hospital/hospital.schema';
import FormInput from '@components/Form/FormInput';
import TermsCheckbox from '@components/Form/TermsComponent';
import FormButton from '@components/Form/FormButton';
import ImageMedia from '@components/Media/ImageMedia';
import Typography from '@components/Typography/Typography';
import Button from '@components/Button/Button';
import Box from '@components/Layout/Box';
import ScreenContainer from '@components/Container/ScreenContainer';
import { handlePermissionRequest, openAppSettings } from '../../../utils/permission';
import { PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PermissionDialog from '@components/Dialog/PermissionsDialog';
import useAuth from '@hooks/rest/common/auth';
import { usePasswordHasher } from '@utils/bcrypt';
import { getCurrentLocation } from '@utils/location';
import Geolocation from '@react-native-community/geolocation';
import { Text } from 'react-native';
import Toast from 'react-native-toast-message';
const { LocationSettingsModule } = NativeModules;

const HospitalSignup: React.FC = ({ navigation }: any) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [location, setLocation] = useState("");
    const {hashPassword} = usePasswordHasher()
    const { register } = useAuth();
    const { control, handleSubmit, formState: { errors, isValid }, setValue, getValues, trigger } = useForm<HospitalSignupData>({
        resolver: yupResolver(hospitalSignupSchema),
        mode: 'onChange',
    });

    const onSubmit = async(data: HospitalSignupData) => {
        console.log(data);
        const hashed = await hashPassword(data.password, process.env.SALT_KEY ?? '')
        data.password = hashed
        let temp:any = {...data}
        delete temp.confirmPassword

        const hospitalRegisterResult = await register({...temp, userType: "Hospital", address: "", location: data.location})
        if(hospitalRegisterResult?.success) {
            navigation.navigate("AccountVerification")
        }else{
            // show a toast here for unsuccessful response
            console.log("HOSPITAL REGISTER RESPONSE NOT SUCCESSFULL");
        }
    };

    function alreadyHaveAnAccountPressed() {
        navigation.navigate("UserSelection")
    }

    // Function to handle location permission request
    const handleLocationPermission = () => {
        return handlePermissionRequest(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, // iOS permission

            () => {
                console.log('Location permission granted');
                // Handle granted permission (e.g., start fetching location)
                LocationSettingsModule.openLocationSettings();
                Geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      const coords = `${latitude},${longitude}`;
                      console.log('Current Location:', coords);
                      setValue('location', coords);
                      // Trigger validation manually after updating the location value
                      trigger('location');  // This ensures validation runs for the location field
                      
                      // Do something with the coordinates, like saving or using in the app
                    },
                    (error) => {
                      console.log('Error getting location:', error.message);
                      // Handle error
                    },
                    { timeout: 15000, maximumAge: 10000 }
                  );
                setDialogVisible(false);
            },
            () => {
                console.log('Location permission denied');
                // Handle denied permission
                setDialogVisible(false);
            },
            () => {
                console.log('Location permission blocked');
                // Open app settings if blocked
                openAppSettings();
                setDialogVisible(false);
            }
        );
    };

    // Function to show the permission dialog
    const showPermissionDialog = () => {
        setDialogVisible(true);
    };
     
    

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box style={styles.container}>
                    <ImageMedia imageStyle={styles.logo} source={require("@assets/logo.png")} type='image' />
                    <Typography variant='h2' style={{marginTop:20}}>Rurban</Typography>
                    <Typography style={{ marginVertical: 10 }}>Just a few quick things to get started</Typography>
                    <Box style={styles.input}>
                        <FormInput required control={control} name="name" placeholder="Hospital Name" error={errors.name?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput required control={control} name="email" placeholder="Email" keyboardType="email-address" error={errors.email?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput required type='phone' control={control} name="contact" placeholder="PhoneNumber" keyboardType="phone-pad" error={errors.contact?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput control={control} name="website" placeholder="Website (Optional)" error={errors.website?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput required control={control} name="password" placeholder="Password" secureTextEntry error={errors.password?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput required control={control} name="confirmPassword" placeholder="Confirm Password" secureTextEntry error={errors.confirmPassword?.message} />
                    </Box>
                    {/* <Box style={styles.input}>
                        <FormInput disabled={true} required control={control} name="location" placeholder="Location" error={errors.location?.message} />
                        </Box> */}
                    {/* <TermsCheckbox control={control} name="terms" error={errors.terms?.message} /> */}
                    <Box style={styles.input}>
                    <TouchableOpacity onPress={showPermissionDialog} >
                        <Box flexDirection='row' alignItems='center'>
                            <Button variant='primary' title="Use My Location" onPress={showPermissionDialog} icon={<Icon name='my-location' color={'#fff'} size={25} />} style={{ height: 40, paddingVertical: 0, backgroundColor: 'green', flex: 1, marginTop: 10 }} />
                        </Box>
                    </TouchableOpacity>
                    {errors?.location && <Typography style={styles.error}>{errors?.location.message}</Typography>}
                    </Box>

                    <Box style={styles.button}>
                        <FormButton title="Register" onPress={handleSubmit(onSubmit)} disabled={!isValid} />
                    </Box>
                    <Box flexDirection='row' alignItems='center' justifyContent='center'>
                        <Typography variant='body'>
                            Already have an account?
                        </Typography>
                        <Button title="login" variant='link' onPress={alreadyHaveAnAccountPressed} />
                    </Box>

                    <PermissionDialog
                        visible={dialogVisible}
                        permissionTitle="Location Permission"
                        permissionMessage="This app needs access to your location to provide features
                to calculate ETA to hospital"
                        onCancel={() => setDialogVisible(false)}
                        onConfirm={handleLocationPermission}
                    />
                </Box>
            </ScrollView>
        </ScreenContainer>
    );
};

export default HospitalSignup;

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    error: {
        color: 'red',
        fontSize: 12,
      },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '300',
        textAlign: 'center',
        marginVertical: 20
    },
    input: {
        marginVertical: 2
    },
    button: {
        marginVertical: 20
    },
    link: {
        fontWeight: '700',
        alignSelf: 'center'
    },
})