import { Question } from "@/components/questions";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PhaseData {
  phaseid: string,
  phasename: string,
  phaseorder: number,
  startdate: string,
  enddate: string
}

interface PhasesState {
  phases: {
    [phasename: string]: {
      data: PhaseData;
      questions: Question[];
    };
  };
}

const initialState: PhasesState = {
  phases: {},
};

export const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhaseData: (
      state,
      action: PayloadAction<{ phasename: string; phasedata: PhaseData }>,
    ) => {
      const { phasename, phasedata } = action.payload;
      if (!state.phases[phasename]) {
        state.phases[phasename] = { data: {phaseid: "", phasename:"", phaseorder: -1, startdate: "", enddate: ""}, questions: []};
      }
      state.phases[phasename].data = phasedata;
    },
    setPhaseQuestions: (
      state,
      action: PayloadAction<{ phasename: string; phasequestions: Question[] }>,
    ) => {
      const { phasename, phasequestions } = action.payload;
      if (!state.phases[phasename]) {
        state.phases[phasename] = { data: {phaseid: "", phasename:"", phaseorder: -1, startdate: "", enddate: ""}, questions: [] };
      }
      state.phases[phasename].questions = phasequestions;
    },
  },
});

export const { setPhaseQuestions, setPhaseData } = phaseSlice.actions;
export default phaseSlice.reducer;
