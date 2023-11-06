import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface ImageUploadQuestionTypeProps extends DefaultQuestionTypeProps {}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({ questionid, mandatory, question_text }) => {
  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text}>
      <div className="mt-1">
        <input
          type="file"
          id={questionid}
          name={questionid}
          accept="image/*"
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-4">
        <img src="" alt="Preview" className="max-w-xs" id="imagePreview" />
      </div>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;