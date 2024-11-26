import { createSlice } from '@reduxjs/toolkit';

type TThemeMode = {
    light: "light",
    dark: "dark"
}

enum ELanguage {
    en = "en",
    ar = "ar",
    tr = "tr",
    es = "es",
    ru = "ru"
}

const initialState: {
    language: ELanguage | 'en' | 'ar';
    themeMode: TThemeMode | 'light' | 'dark';
    loading: boolean;
    isAuthenticated: boolean
    accessToken: null | string;
} = {
    language: 'en',
    themeMode: "light",
    isAuthenticated: false,
    loading: false,
    accessToken: null
};

const appConfigSlice = createSlice({
    name: 'appConfig',
    initialState,
    reducers: {
        setLoading: (state = initialState, action) => {
            state.loading = action.payload;
        },
        setAuthenticated: (state = initialState, action) => {
            state.isAuthenticated = action.payload;
        },
        setAccessToken: (state = initialState, action) => {
            state.accessToken = action.payload;
        },
        setLanguage: (state = initialState, action) => {
            state.language = action.payload;
        },
        setThemeMode: (state = initialState, action) => {
            state.themeMode = action.payload;
        }
    },
});

export const { setLoading, setAccessToken, setLanguage, setThemeMode, setAuthenticated } = appConfigSlice.actions;

export default appConfigSlice;