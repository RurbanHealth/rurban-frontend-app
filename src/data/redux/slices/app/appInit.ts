// import { slideConstants } from "@dataRootDir/src/data/constants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
//   slideData: slideConstants.SLIDE_DATA || [],
  slideData: [],
};

const appInitSlice = createSlice({
  name: "appInit",
  initialState,
  reducers: {
    getSlideData: (state: any, action) => {
      return state.slideData;
    },
  },
});

export const { getSlideData } = appInitSlice.actions;

export default appInitSlice;