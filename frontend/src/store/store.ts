import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector,
  useDispatch,
  useStore,
} from "react-redux";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popupSlice";
import userReducer from "./slices/usersSlice";
import menuReducer from "./slices/menuSlice";
import phaseReducer from "./slices/phaseSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authReducer,
      popupReducer,
      userReducer,
      menuReducer,
      phaseReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
