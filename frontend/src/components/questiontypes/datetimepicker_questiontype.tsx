import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface DateTimePickerQuestionTypeProps extends DefaultQuestionTypeProps {}

const DateTimePickerQuestionType: React.FC<DateTimePickerQuestionTypeProps> = ({ id, mandatory, question_text }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <input
        type="datetime-local"
        id={id}
        name={id}
        required={mandatory}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    </QuestionTypes>
  );
};

export default DateTimePickerQuestionType;