import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { saveDatePickerAnswer } from "@/actions/answers";

export interface DatePickerQuestionTypeProps extends DefaultQuestionTypeProps {}

const DatePickerQuestionType: React.FC<DatePickerQuestionTypeProps> = ({
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
      <div className="mt-1">
        <input
          type="date"
          id={questionid}
          name={questionid}
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onBlur={(event) => saveDatePickerAnswer(new Date(event.target.value), questionid)}
        />
      </div>
    </QuestionTypes>
  );
};

export default DatePickerQuestionType;
