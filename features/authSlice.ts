import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

interface AuthSlice {
    isAuthenticated: boolean;
    username: string;
}

interface AuthSlicePayload {
    username: string;
}

// Define the initial state using that type
const initialState: AuthSlice = {
    isAuthenticated: false,
    username: "",
}

export const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthSlicePayload>) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = "";
        }
    },
})

export const {login, logout} = authSlice.actions


export default authSlice.reducer
