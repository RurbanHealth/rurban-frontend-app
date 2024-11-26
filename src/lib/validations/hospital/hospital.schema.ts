import * as Yup from 'yup';
import { HospitalSignupData } from 'src/typescript/interfaces/hospital';

export const hospitalSignupSchema: Yup.ObjectSchema<HospitalSignupData> = Yup.object({
    name: Yup.string().required('Hospital Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contact: Yup.string().required('Contact is required'),
    website: Yup.string().optional().url('Invalid URL'),  // Allows `undefined`, but not `null`
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
    location: Yup.string().required('Hospital Location is required'),
    // terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('Terms must be accepted'),
});
