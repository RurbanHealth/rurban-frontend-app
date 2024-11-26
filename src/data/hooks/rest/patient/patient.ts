import { useAppDispatch, useAppSelector } from "@redux/store/store";
import useRestAPI, { ERequestMethods } from "../api/rest";
import { setLoading } from "@redux/slices/app/appConfig";


export default function usePatient() {
  const patientSlice = useAppSelector((state) => state.patient);
  const dispatch = useAppDispatch();
  const { callRESTAPI } = useRestAPI();


  async function getAllCheckins() {
    const allCheckinsResponse = await callRESTAPI({ subUrl: `patient/appointments?id=${patientSlice.loginInfo?.id}&pageSize=10`, config: { authorized: true} })
    console.log("All Checkins Response In usePatient Hook:", allCheckinsResponse);
    // return all checkins array or store in redux
    return allCheckinsResponse
  }
  
  async function getAllHospitals() {
    const allHospitalsResponse = await callRESTAPI({ subUrl: `patient/hospitals`, config: { authorized: true } })
    console.log("All Hospitals Response In usePatient Hook:", allHospitalsResponse);
    // return all hopitals array or store in redux
    return allHospitalsResponse
  }
  
  async function createCheckin(data: any) {
    const createCheckinResponse = await callRESTAPI({ subUrl: `patient/appointments/new`, config: { method: ERequestMethods.POST, authorized: true, data } })
    console.log("Create Checkin Response In usePatient Hook:", createCheckinResponse);
    return createCheckinResponse
  }

  async function updateCheckin(data: any) {
    const updateCheckinResponse = await callRESTAPI({ subUrl: `patient/appointments/update`, config: { method: ERequestMethods.PUT, authorized: true, data } })
    console.log("Update Checkin Response In usePatient Hook:", updateCheckinResponse);
    return updateCheckinResponse
  }
  

  return {
    getAllCheckins,
    getAllHospitals,
    createCheckin,
    updateCheckin
  };
}