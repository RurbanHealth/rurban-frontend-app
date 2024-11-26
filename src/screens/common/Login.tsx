import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginData } from '@typescript/interfaces/common';
import { loginSchema } from '@validations/common/loginSchema';
import FormInput from '@components/Form/FormInput';
import FormButton from '@components/Form/FormButton';
import Typography from '@components/Typography/Typography';
import ImageMedia from '@components/Media/ImageMedia';
import Button from '@components/Button/Button';
import Box from '@components/Layout/Box';
import ScreenContainer from '@components/Container/ScreenContainer';
import useAuth from '@hooks/rest/common/auth';
import { usePasswordHasher } from '@utils/bcrypt';
import { storeData } from '@utils/localStorage';


const Login: React.FC = ({ navigation }: any) => {
    const { hashPassword } = usePasswordHasher()
    const { login } = useAuth();
    const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<LoginData>({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        // Clear the form when the component unmounts
        return () => reset();
    }, [reset]);

    const onSubmit = async (data: LoginData) => {
        console.log(data);

        // const hashed = await hashPassword(data.password, process.env.SALT_KEY ?? '')

        const loginResult = await login({
            email: data.email,
            password: data.password
        })

        // Set logged in user to async storage
        await storeData("user", JSON.stringify(loginResult));
        // Then navigate to respective to dashboards
        if (loginResult?.userType === "Hospital") {
            navigation.navigate("Hospital", { screen: "HospitalDrawer" });
        }
        if (loginResult?.userType === "Patient") {
            navigation.navigate("Patient", { screen: "PatientDrawer" });
        }

    };

    function dontHaveAnAccountPressed() {
        navigation.navigate("UserSelection");
    }

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box style={styles.container}>
                    <ImageMedia imageStyle={styles.logo} source={require("@assets/logo.png")} type='image' />
                    <Typography variant='h2' style={{ marginTop: 20 }}>Rurban</Typography>
                    <Typography style={styles.title}>Please fill your details to access your account.</Typography>
                    <Box style={styles.input}>
                        <FormInput control={control} name="email" placeholder="Email" keyboardType="email-address" error={errors.email?.message} />
                    </Box>
                    <Box style={styles.input}>
                        <FormInput control={control} name="password" placeholder="Password" secureTextEntry error={errors.password?.message} />
                    </Box>
                    <Box style={styles.button}>
                        <FormButton title="Login" onPress={handleSubmit(onSubmit)} disabled={!isValid} />
                    </Box>
                    <Box flexDirection='row' justifyContent='center' alignItems='center'>
                        <Typography>Don't have an account? </Typography>
                        <Button textStyle={styles.link} title="Register" variant='link' onPress={dontHaveAnAccountPressed} />
                    </Box>
                </Box>
            </ScrollView>
        </ScreenContainer>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 20
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
    },
    title: {
        fontWeight: '300',
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
    },
});
