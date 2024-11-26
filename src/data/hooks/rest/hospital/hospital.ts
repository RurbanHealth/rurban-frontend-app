import { useAppDispatch, useAppSelector } from "@redux/store/store";
import useRestAPI, { ERequestMethods } from "../api/rest";


export default function useHospital() {
  const hospitalSlice = useAppSelector((state) => state.hospital);
  const dispatch = useAppDispatch();
  const { callRESTAPI } = useRestAPI();

  const hospitalId = hospitalSlice.loginInfo?.id

  async function getUpcomingAppointments() {
    const upcomingAppointmentsResponse = await callRESTAPI({ subUrl: `hospital/appointments?type=Booked`, config: { authorized: true} })
    console.log("Upcoming Appointments Response In useHospital Hook:", upcomingAppointmentsResponse);
    // return all upcoming appointments array or store in redux
    return upcomingAppointmentsResponse
  }

  async function getPreviousAppointments() {
    const previousAppointmentsResponse = await callRESTAPI({ subUrl: `hospital/appointments?type=Past`, config: { authorized: true } })
    console.log("Previous Appointments Response In useHospital Hook:", previousAppointmentsResponse);
    // return all previous appointments array or store in redux
    return previousAppointmentsResponse
  }

  async function updateCheckin(data: any) {
    const updateCheckinResponse = await callRESTAPI({ subUrl: `hospital/appointments/update`, config: { method: ERequestMethods.PUT, authorized: true, data } })
    console.log("Update Checkin Response In usePatient Hook:", updateCheckinResponse);
    return updateCheckinResponse
  }


  return {
    getUpcomingAppointments,
    getPreviousAppointments,
    updateCheckin
  };
}