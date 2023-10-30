import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface NumberPickerQuestionTypeProps extends DefaultQuestionTypeProps {
  min: number;
  max: number;
}

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({ questionid, mandatory, question_text, min, max }) => {
  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text}>
      <input
        type="number"
        id={questionid}
        name={questionid}
        required={mandatory}
        min={min}
        max={max}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;