import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface DatetimePickerQuestionTypeProps extends DefaultQuestionTypeProps {}

const DatetimePickerQuestionType: React.FC<DatetimePickerQuestionTypeProps> = ({ questionid, mandatory, question_text,  questionnote}) => {
  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text} questionnote={questionnote}>
      <input
        type="datetime-local"
        id={questionid}
        name={questionid}
        required={mandatory}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    </QuestionTypes>
  );
};

export default DatetimePickerQuestionType;