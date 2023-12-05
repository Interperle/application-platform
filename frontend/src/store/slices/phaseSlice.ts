import { Question } from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface PhaseData {
  phaseid: string;
  phasename: string;
  phaselabel: string;
  phaseorder: number;
  startdate: string;
  enddate: string;
}

export interface PhasesDataQuestions {
  data: PhaseData;
  questions: Question[] | null;
}

export interface PhasesState {
  phases: {
    [phasename: string]: PhasesDataQuestions;
  };
}

const initialState: PhasesState = {
  phases: {},
};

export const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhase: (
      state,
      action: PayloadAction<{
        phasename: string;
        phasedata: PhaseData;
        phasequestions: Question[];
      }>,
    ) => {
      const { phasename, phasedata, phasequestions } = action.payload;
      state.phases[phasename] = { data: phasedata, questions: phasequestions };
    },
  },
});

export const { setPhase } = phaseSlice.actions;
export default phaseSlice.reducer;
