import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { saveNumberPickerAnswer } from "@/actions/answers";

export interface NumberPickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  min: number;
  max: number;
}

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  min,
  max,
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
        type="number"
        id={questionid}
        name={questionid}
        required={mandatory}
        min={min}
        max={max}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        onBlur={(event) => saveNumberPickerAnswer(Number(event.target.value), questionid)}
      />
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;
