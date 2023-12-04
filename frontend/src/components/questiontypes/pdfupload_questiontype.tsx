"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  deletePdfUploadAnswer,
  savePdfUploadAnswer,
} from "@/actions/answers/pdfUpload";
import { fetchPdfUploadAnswer } from "@/utils/helpers";
import { SubmitButton } from "../submitButton";
import { AwaitingChild } from "../awaiting";

export interface PDFUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxSizeInMB: number;
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  answerid,
  maxSizeInMB,
}) => {
  const savePdfUploadAnswerWithId = savePdfUploadAnswer.bind(null, questionid);
  const [uploadUrl, setUploadPdf] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const pdfUploadBucketData = await fetchPdfUploadAnswer(
            questionid,
            answerid,
          );
          const url = URL.createObjectURL(pdfUploadBucketData!);
          setUploadPdf(url);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadPdf(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    deletePdfUploadAnswer(questionid, answerid || "");
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
        <AwaitingChild isLoading={isLoading}>
          <input
            type="file"
            id={questionid}
            name={questionid}
            accept="application/pdf"
            required={mandatory}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onChange={(event) => handleUploadChange(event)}
          />
        </AwaitingChild>
        {uploadUrl && (
          <div className="mt-4 flex flex-col gap-y-2">
          <button className="self-end text-red-600" onClick={handleDeleteOnClick}>Löschen</button>
          <iframe
              src={uploadUrl}
              width="100%"
              height="600px max-w-xs self-center"
              style={{ border: "none" }}
            />
          <SubmitButton text={"PDF hochladen"} expanded={false} />
        </div>
        )}
      </form>
    </QuestionTypes>
  );
};

export default PDFUploadQuestionType;
