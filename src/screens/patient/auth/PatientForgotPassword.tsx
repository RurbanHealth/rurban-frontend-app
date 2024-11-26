import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@validations/common/forgotpasswordSchema';
import { LoginData } from 'src/typescript/interfaces/common';
import FormInput from '@components/Form/FormInput';
import FormButton from '@components/Form/FormButton';
import ScreenContainer from '@components/Container/ScreenContainer';
import Box from '@components/Layout/Box';

const PatientForgotPassword: React.FC = () => {
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Pick<LoginData, 'email'>>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = (data: Pick<LoginData, 'email'>) => {
        console.log(data);
    };

    return (
        <ScreenContainer>
            <Box>
                <FormInput control={control} name="email" placeholder="Email" keyboardType="email-address" error={errors.email?.message} />
                <FormButton title="Reset Password" onPress={handleSubmit(onSubmit)} disabled={!isValid} />
            </Box>
        </ScreenContainer>
    );
};

export default PatientForgotPassword;

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});