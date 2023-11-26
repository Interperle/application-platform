import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { saveDateTimePickerAnswer } from "@/actions/answers";
import { setToPrefferedTimeZone } from "@/utils/helpers";

export interface DatetimePickerQuestionTypeProps
  extends DefaultQuestionTypeProps {}

const DatetimePickerQuestionType: React.FC<DatetimePickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
}) => {
  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
    >
      <input
        type="datetime-local"
        id={questionid}
        name={questionid}
        required={mandatory}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        onBlur={(event) => saveDateTimePickerAnswer(setToPrefferedTimeZone(event.target.value), questionid)}
      />
    </QuestionTypes>
  );
};

export default DatetimePickerQuestionType;
