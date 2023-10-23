import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { init } from 'next/dist/compiled/webpack/webpack';


type InitialState = {
    value: AuthState;
}
type AuthState = {
    isAuth: boolean;
    username: string;
    uid: string;
}
const initialState = {
    value: {
        isAuth: false,
        username: "",
        uid: "",
    } as AuthState
} as InitialState

export const auth = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        logIn: (_, action: PayloadAction<string>) => {
            return {
                value: {
                    isAuth: true,
                    username: action.payload,
                    uid: "abcde",
                }
            }
        }
    }
})


export const { logIn, logOut } = auth.actions;
export default auth.reducer;