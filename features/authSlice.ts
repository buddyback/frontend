import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

interface AuthSlice {
    isAuthenticated: boolean;
    username: string;
    email: string;
    is_staff: boolean;
}

interface AuthSlicePayload {
    username: string;
    email: string;
    is_staff: boolean;
}

interface UpdateUserPayload {
    email: string;
}

// Define the initial state using that type
const initialState: AuthSlice = {
    isAuthenticated: false,
    username: "",
    email: "",
    is_staff: false,
}

export const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthSlicePayload>) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.is_staff = action.payload.is_staff;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = "";
            state.email = "";
            state.is_staff = false;
        },
        updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
            state.email = action.payload.email;
        }
    },
})

export const {login, logout, updateUser} = authSlice.actions


export default authSlice.reducer
