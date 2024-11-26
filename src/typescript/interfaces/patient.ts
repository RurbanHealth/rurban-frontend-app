export interface PatientSignupData {
    name: string;
    email: string;
    dob: string; // Should be the type you expect (string, Date, etc.)
    contact: string;
    password: string;
    confirmPassword: string;
    location: string;
    // terms: boolean;
}