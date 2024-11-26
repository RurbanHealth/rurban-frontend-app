import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';

const UserSelection: React.FC = ({ navigation }: any) => {
    function onLogin() {
        navigation.navigate("Login")
    }
    function continueAsPatient() {
        navigation.navigate("Patient", {screen:'PatientSignup'})
    }
    function continueAsEr() {
        navigation.navigate("Hospital", {screen:'HospitalSignup'})
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("@assets/logo.png")} />
            <Typography style={styles.welcomeText}>Welcome To</Typography>
            <Typography style={styles.appNameText}>Rurban</Typography>
            <Typography style={styles.paragraph}>Talk to online doctors and get medical advice, online perscriptions, refills and medical notes within minutes. On-demand healthcare services at your fingertips</Typography>
            <Typography style={[styles.paragraph, {marginBottom:5}]}>Login to access your account</Typography>
            <Button style={[styles.button, {backgroundColor:'#EFEFEF'}]} textStyle={{color: '#465670'}} title='LOGIN' disabled={false} onPress={onLogin} />
            <Typography style={styles.paragraph}>Don't have an account ?</Typography>
            <Button style={styles.button} title='REGISTER AS PATIENT' disabled={false} onPress={continueAsPatient} />
            <Button style={styles.button} title='REGISTER AS HOSPITAL' disabled={false} onPress={continueAsEr} />
        </View>
    );
};

export default UserSelection;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 50
    },
    button: {
        marginVertical: 5,
        width:'100%',
        backgroundColor: '#33528b'
    },
    welcomeText: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: '300',
    },
    appNameText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#465670'
    },
    paragraph: {
        marginVertical: 30,
        fontSize: 13,
        lineHeight:19,
        fontWeight: '400',
    },

});