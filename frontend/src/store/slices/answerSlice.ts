import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const INIT_PLACEHOLDER = null;

type AnswerValue = string | number | boolean | null;

export type AnswerState = {
  [questionid: string]: {
    answervalue: AnswerValue;
    answerid: string;
  };
};

const initialState: AnswerState = {};

const answerSlice = createSlice({
  name: "answer",
  initialState: initialState,
  reducers: {
    UpdateAnswer: (
      state,
      action: PayloadAction<{
        questionid: string;
        answervalue: AnswerValue;
        answerid: string;
      }>,
    ) => {
      const { questionid, answervalue, answerid } = action.payload;
      if (answervalue === "" || answervalue === false || answervalue === null) {
        if (state[questionid]) {
          delete state[questionid];
        }
      } else {
        state[questionid] = { answervalue, answerid };
      }
    },
  },
});

export const { UpdateAnswer } = answerSlice.actions;
export default answerSlice.reducer;
