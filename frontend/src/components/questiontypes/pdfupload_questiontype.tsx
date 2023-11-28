"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  deletePdfUploadAnswer,
  savePdfUploadAnswer,
} from "@/actions/answers/pdfUpload";
import { fetchPdfUploadAnswer } from "@/utils/helpers";

export interface PDFUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  maxSizeInMB: number;
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  maxSizeInMB,
}) => {
  const savePdfUploadAnswerWithId = savePdfUploadAnswer.bind(null, questionid);
  const [uploadUrl, setUploadPdf] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      try {
        const pdfUploadBucketData = await fetchPdfUploadAnswer(questionid);
        const url = URL.createObjectURL(pdfUploadBucketData!);
        setUploadPdf(url);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid]);

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadPdf(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    deletePdfUploadAnswer(questionid);
    setUploadPdf("");
  };

  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
    >
      <form action={savePdfUploadAnswerWithId}>
        <input
          type="file"
          id={questionid}
          name={questionid}
          accept="application/pdf"
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onChange={(event) => handleUploadChange(event)}
        />
        {uploadUrl && (
          <div className="mt-4">
            <iframe
              src={uploadUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
            <button onClick={handleDeleteOnClick}>Delete</button>
          </div>
        )}
        <button type="submit">Upload Bild</button>
      </form>
    </QuestionTypes>
  );
};

export default PDFUploadQuestionType;
