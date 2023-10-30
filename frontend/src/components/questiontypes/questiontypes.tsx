import React from 'react';

export interface DefaultQuestionTypeProps {
  questionid: string;
  mandatory: boolean;
  question_text: string;
}

interface QuestionTypesProps extends DefaultQuestionTypeProps {
    children: React.ReactNode;
}

const QuestionTypes: React.FC<QuestionTypesProps> = ({ questionid, mandatory, question_text, children }) => {
  return (
    <div className="mb-4">
      <label htmlFor={questionid} className="block text-sm font-medium text-gray-700">
        {question_text} {mandatory && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
};

export default QuestionTypes;