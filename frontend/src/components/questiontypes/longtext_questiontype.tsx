import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({ id, mandatory, question_text }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <textarea
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md resize-none"
        required={mandatory}
        maxLength={200}
        rows={4}
        style={{ minHeight: '100px' }}
      />
    </QuestionTypes>
  );
};

export default LongTextQuestionType;