import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({ questionid, mandatory, question_text,  questionnote }) => {
  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text} questionnote={questionnote}>
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