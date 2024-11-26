import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import hospitalSlice from "../slices/hospital";
import appConfigSlice from "../slices/app/appConfig";
import patientSlice from "../slices/patient";

// /** REST Slices */
// import {
//   branchSlice,
//   cartSlice,
//   customerSlice,
//   offerSlice,
//   onboardingSlice,
//   paymentSlice,
//   productSlice,
//   saloonBeauticianSlice,
//   saloonCategorySlice,
//   saloonCustomerSlice,
//   serviceSlice,
//   userSlice,
// } from "../slices/rest";
// /** LOCAL Slices  */
// import {
//   appConfigSlice,
//   appInitSlice,
// } from "../slices/common";

const env = process.env;

console.log(env.IS_WEB, "ENV IS WEB CHECK FROM DATA HOOKS");

// const getStorage = () => {
//   if (env.IS_WEB === "true") {
//     const storage = require("redux-persist/lib/storage").default;
//     console.log(env.IS_WEB, "USING REDUX-PERSIST AS STORAGE");
//     return storage;
//   } else if (env.IS_WEB === "false") {
//     const storage = require("@react-native-async-storage/async-storage").default;
//     console.log(env.IS_WEB, "USING ASYNC-STORAGE AS STORAGE");
//     return storage;
//   } else {
//     throw new Error("Unknown environment: env.IS_WEB must be 'true' or 'false'");
//   }
// };

// const storage = getStorage();


const rootReducer = combineReducers({
  appConfig: appConfigSlice.reducer,
  hospital: hospitalSlice.reducer,
  patient: patientSlice.reducer
});

// const persistedRootReducer = persistReducer(
//   {
//     key: 'root',
//     storage,
//     blacklist: ['auth'],
//     whitelist: [''],
//   },
//   rootReducer,
// );

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  // .concat(api.middleware), // TODO i will enable this when i use codegen graphql
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const persistor = persistStore(store);
export default store;