import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

interface PopupState {
  isOpen: boolean;
  content: ReactNode;
}

const initialState: PopupState = {
  isOpen: false,
  content: null,
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<ReactNode>) => {
      state.isOpen = true;
      state.content = action.payload;
    },
    closePopup: (state) => {
      state.isOpen = false;
      state.content = null;
    },
  },
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
