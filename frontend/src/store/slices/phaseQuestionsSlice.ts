import { Question } from "@/components/questions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface PhasesState {
    phases: {
      [phasename: string]: Question[];
    };
}

// Define the payload structure for the action
interface SetPhaseQuestionsPayload {
    phasename: string;
    phasequestions: Question[];
}

const initialState: PhasesState = {
    phases: {},
};

export const phaseSlice = createSlice({
  name: "phase",
  initialState: initialState,
  reducers: {
    setPhaseQuestions: (state, action: PayloadAction<SetPhaseQuestionsPayload>) => {
        const { phasename, phasequestions } = action.payload;
        state.phases[phasename] = phasequestions;
    },
  },
});

export const { setPhaseQuestions } = phaseSlice.actions;
export default phaseSlice.reducer;
