import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popupSlice";
import userReducer from "./slices/usersSlice";
import menuReducer from "./slices/menuSlice";
import phaseQuestionsReducer from "./slices/phaseQuestionsSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    popupReducer,
    userReducer,
    menuReducer,
    phaseQuestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
