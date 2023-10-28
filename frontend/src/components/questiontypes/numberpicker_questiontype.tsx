import React from 'react';
import QuestionTypes, { QuestionTypeProps } from './questiontypes';

export interface NumberPickerQuestionTypeProps extends QuestionTypeProps {
  min: number;
  max: number;
}

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({ id, mandatory, question_text, min, max }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <input
        type="number"
        id={id}
        name={id}
        required={mandatory}
        min={min}
        max={max}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;