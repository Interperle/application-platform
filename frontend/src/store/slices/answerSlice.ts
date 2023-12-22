import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AnswerValue = string | number | boolean | null;

type AnswerState = {
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
      state[questionid] = { answervalue, answerid };
    },
  },
});

export const { UpdateAnswer } = answerSlice.actions;
export default answerSlice.reducer;
