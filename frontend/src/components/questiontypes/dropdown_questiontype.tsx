import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';
import { DropdownOption, DropdownOptionProps } from './utils/dropdown_option';

export interface DropdownQuestionTypeProps extends DefaultQuestionTypeProps {
    options: DropdownOptionProps[];
}

const DropdownQuestionType: React.FC<DropdownQuestionTypeProps> = ({ questionid, mandatory, question_text, options }) => {
  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text}>
      <select
        id={questionid}
        name={questionid}
        required={mandatory}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map(option => (
          <DropdownOption key={option.optionId} optionId={option.optionId} optionText={option.optionText} />
        ))}
      </select>
    </QuestionTypes>
  );
};

export default DropdownQuestionType;
