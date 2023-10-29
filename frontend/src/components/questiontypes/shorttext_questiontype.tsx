import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({ id, mandatory, question_text }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
        <input
          type="text"
          name={id}
          id={id}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          required={mandatory}
          maxLength={50}
        />
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;