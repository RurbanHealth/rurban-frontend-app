import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountVerification: React.FC = ({ navigation }: any) => {
    function goHome() {
        navigation.navigate("Login");
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("@assets/logo2.jpg")} />
            <Typography>We've sent you a confirmation email</Typography>
            <Typography style={{fontSize:12, marginVertical:5}}>Time to check your email</Typography>
            <Icon name='mail' size={140} style={{marginVertical:20}}/>
            <Typography style={{marginVertical:20, fontSize:12}}>Click the link in your email to confirm your account If you can find the email check the spam or promotional folder</Typography>
            <Button style={styles.button} title='Home' disabled={false} onPress={goHome} />
        </View>
    );
};

export default AccountVerification;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    logo: {
        width: "100%",
        height: 80,
        marginVertical: 50
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
        fontSize: 24,
        fontWeight: '300',
    },
    paragraph: {
        marginVertical: 30,
        fontSize: 13,
        lineHeight:19,
        fontWeight: '400',
    },

});