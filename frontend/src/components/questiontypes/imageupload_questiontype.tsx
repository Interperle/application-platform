import React from 'react';
import QuestionTypes, { QuestionTypeProps } from './questiontypes';

export interface ImageUploadQuestionTypeProps extends QuestionTypeProps {}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({ id, mandatory, question_text }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <div className="mt-1">
        <input
          type="file"
          id={id}
          name={id}
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