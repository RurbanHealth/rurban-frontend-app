import * as Yup from 'yup';
import { LoginData } from 'src/typescript/interfaces/common';

export const loginSchema: Yup.ObjectSchema<Pick<LoginData, 'email' | 'password'>> = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});
