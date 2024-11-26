import { createSlice } from "@reduxjs/toolkit";
import HospitalJSON from "../../json/hospital.json"

const IS_DEV = process.env.IS_DEV

const initialState = {
  // example to use test JSON data based on environment 
  loginInfo: IS_DEV ? HospitalJSON.loginInfo : null,
  data: [],
};

const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {
    setHospitalLoginInfo: (state, action) => {
      state.loginInfo = action.payload;
    },
    hospitalExampleReducer: (state: any, action) => {
      return state.data;
    },
  },
});

export const { setHospitalLoginInfo, hospitalExampleReducer } = hospitalSlice.actions;

export default hospitalSlice;