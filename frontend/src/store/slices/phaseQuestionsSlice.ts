import { Question } from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";
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
      questions: Question[] | null;
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
    setPhase: (
      state,
      action: PayloadAction<{ phasename: string; phasedata: PhaseData;  phasequestions: Question[] }>,
    ) => {
      const { phasename, phasedata, phasequestions } = action.payload;
      state.phases[phasename] = {data: phasedata, questions: [{
        questionid: "string",
        questiontype: QuestionType.ShortText,
        questionorder: 0,
        phaseid: "1",
        mandatory: true,
        questiontext: "Hallo",
        questionnote: "Wekt", params: {minanswers: 0, maxanswers: 2, userinput: true}}]};
    },
  },
});

export const { setPhase } = phaseSlice.actions;
export default phaseSlice.reducer;
