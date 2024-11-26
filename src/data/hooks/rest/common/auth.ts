import { useAppDispatch, useAppSelector } from "@redux/store/store";
import useRestAPI, { ERequestMethods } from "../api/rest";
import { setPatientLoginInfo } from "@redux/slices/patient";
import { setHospitalLoginInfo } from "@redux/slices/hospital";
import { setAccessToken } from "@redux/slices/app/appConfig";

interface IPatientRegisterData {
    name: string;
    dob: string;
    contact: string;
    email: string;
    password: string;
    userType: string;
}

interface IHospitalRegisterData {
    name: string;
    contact: string;
    email: string;
    password: string;
    website?: string
    address: string;
    location: string;
    userType: string;
}


export default function useAuth() {
    const hospitalSlice = useAppSelector((state) => state.hospital);
    const patientSlice = useAppSelector((state) => state.patient);
    const dispatch = useAppDispatch();
    const { callRESTAPI } = useRestAPI();

    async function login(data: any) {
        const loginResponse = await callRESTAPI({ subUrl: 'auth/login', config: { method: ERequestMethods.POST, authorized: false, data } })
        console.log("Login Response In UseAuth Hook:", loginResponse);
        if(loginResponse?.userType === "Hospital"){
            dispatch(setHospitalLoginInfo(loginResponse))
        }
        if(loginResponse?.userType === "Patient"){
            dispatch(setPatientLoginInfo(loginResponse))
        }
        dispatch(setAccessToken(loginResponse?.token ?? ''))
        return loginResponse
    }

    async function register(registerationData: IPatientRegisterData | IHospitalRegisterData) {

        let subUrl = "auth/register";

        const registerResponse = await callRESTAPI({ subUrl, config: {method: ERequestMethods.POST, authorized: false, data:registerationData } })
        console.log("Register Response In UseAuth Hook:", registerResponse);

        return registerResponse;
    }

    return {
        login,
        register,
    };
}