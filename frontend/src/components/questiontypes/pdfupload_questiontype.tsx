import React from 'react';
import QuestionTypes, { QuestionTypeProps } from './questiontypes';

export interface PDFUploadQuestionTypeProps extends QuestionTypeProps {
  maxSizeInMB: number;
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({ id, mandatory, question_text, maxSizeInMB }) => {
  const fileInputRef = null;
  const [fileSizeError, setFileSizeError] = [null, console.log];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        setFileSizeError(`File size exceeds ${maxSizeInMB}MB`);
        // Clear the file input for new selection
        if (fileInputRef){
            
        }
      } else {
        setFileSizeError(null);
        // Handle file upload here if needed
      }
    }
  };

  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={id}
          accept="application/pdf"
          required={mandatory}
          //onChange={handleFileChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      {fileSizeError && <p className="text-red-500 text-xs mt-1">{fileSizeError}</p>}
    </QuestionTypes>
  );
};

export default PDFUploadQuestionType;