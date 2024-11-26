import * as Yup from 'yup';
import { PatientSignupData } from '../../../typescript/interfaces/patient';

export const patientSignupSchema: Yup.ObjectSchema<PatientSignupData> = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    dob: Yup.string().required('Date of Birth is required'),
    contact: Yup.string().required('Contact is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    location: Yup.string().required('Patient Location is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });
