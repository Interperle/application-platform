import React, { useRef, useState } from 'react';
import QuestionTypes, { QuestionTypeProps } from './questiontypes';

interface PDFUploadProps extends QuestionTypeProps {
  maxSizeInMB: number;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ id, mandatory, question_text, maxSizeInMB }) => {
  const fileInputRef = useRef(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        setFileSizeError(`File size exceeds ${maxSizeInMB}MB`);
        // Clear the file input for new selection
        if (fileInputRef.current){
            
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
          onChange={handleFileChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      {fileSizeError && <p className="text-red-500 text-xs mt-1">{fileSizeError}</p>}
    </QuestionTypes>
  );
};

export default PDFUpload;