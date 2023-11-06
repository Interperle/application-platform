import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface PDFUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  maxSizeInMB: number;
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({ questionid, mandatory, question_text, maxSizeInMB }) => {
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
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text}>
        <input
          ref={fileInputRef}
          type="file"
          id={questionid}
          name={questionid}
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