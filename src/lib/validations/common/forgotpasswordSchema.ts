import * as Yup from 'yup';
import { LoginData } from 'src/typescript/interfaces/common';

export const forgotPasswordSchema: Yup.ObjectSchema<Pick<LoginData, 'email'>> = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });
