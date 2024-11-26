import { createSlice } from "@reduxjs/toolkit";
import PatientJSON from "../../json/patient.json"

const IS_DEV = process.env.IS_DEV

const initialState = {
  // example to use test JSON data based on environment 
  loginInfo: IS_DEV ? PatientJSON.loginInfo : null,
  data: [],
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatientLoginInfo: (state, action) => {
      state.loginInfo = action.payload;
    },
    patientExampleReducer: (state: any, action) => {
      return state.data;
    },
  },
});

export const { setPatientLoginInfo, patientExampleReducer } = patientSlice.actions;

export default patientSlice;