import { useCallback } from 'react';
import bcrypt from 'bcrypt-react-native';

export function usePasswordHasher() {
  // Function to hash a password using a custom salt (passed as a string)
  const hashPassword = useCallback(async (password: string, customSalt: string) => {
    try {
      // Hash the password using the custom salt
      const hashedPassword = await bcrypt.hash(customSalt, password);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  }, []);

  return { hashPassword };
}
