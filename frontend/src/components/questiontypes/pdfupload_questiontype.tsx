"use client";

import React, { useEffect, useState } from "react";

import {
  deletePdfUploadAnswer,
  savePdfUploadAnswer,
} from "@/actions/answers/pdfUpload";
import { fetchPdfUploadAnswer } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";
import { SubmitButton } from "../submitButton";

export interface PDFUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxfilesizeinmb: number;
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
  maxfilesizeinmb,
}) => {
  const savePdfUploadAnswerWithId = savePdfUploadAnswer.bind(null, questionid);
  const [uploadUrl, setUploadPdf] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wasUploaded, setWasUploaded] = useState(false);

  const validImgTypes = ["application/pdf"];

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
          setWasUploaded(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  function set_pdf_for_upload(file: File) {
    if (!iseditable) {
      return;
    }
    const fileSizeInMB = file.size / 1024 / 1024;
    if (!validImgTypes.includes(file.type)) {
      alert(
        `Es sind nur die folgenden Dateitypen erlaubt: ${validImgTypes.join(
          ", ",
        )}!`,
      );
      return;
    }
    if (fileSizeInMB > maxfilesizeinmb) {
      alert(`Die PDF Datei darf maximal ${maxfilesizeinmb} MB groß sein!`);
      return;
    }
    setUploadPdf(URL.createObjectURL(file));
    setWasUploaded(false);
  }

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    if (event.target.files) {
      const file = event.target.files[0];
      set_pdf_for_upload(file);
    }
  };

  const handleDeleteOnClick = () => {
    if (!iseditable) {
      return;
    }
    deletePdfUploadAnswer(questionid, answerid || "");
    setUploadPdf("");
    setWasUploaded(false);
  };

  const handleSubmit = () => {
    if (!iseditable) {
      return;
    }
    setWasUploaded(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!iseditable) {
      return;
    }
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!iseditable) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      set_pdf_for_upload(file);
    }
  };

  return (
    <QuestionTypes
      phasename={phasename}
      iseditable={iseditable}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
      questionorder={questionorder}
    >
      <form action={savePdfUploadAnswerWithId} onSubmit={handleSubmit}>
        <div className={`mt-1 ${uploadUrl && "hidden"}`}>
          <AwaitingChild isLoading={isLoading}>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={questionid}
                className="flex flex-col items-center justify-center w-full h-34 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-secondary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-secondary text-center">
                    <p className="font-semibold">Zum Uploaden klicken</p> oder
                    per Drag and Drop
                  </p>
                  <p className="text-xs text-secondary">PDF (MAX. 2MB)</p>
                </div>
                <input
                  type="file"
                  id={questionid}
                  name={questionid}
                  disabled={!iseditable}
                  aria-disabled={!iseditable}
                  accept={validImgTypes.join(", ")}
                  required={mandatory}
                  className="hidden"
                  onChange={(event) => handleUploadChange(event)}
                />
              </label>
            </div>
          </AwaitingChild>
        </div>
        <div
          className={`mt-4 flex flex-col gap-y-2 max-w-xs max-h-96 ${
            !uploadUrl && "hidden"
          }`}
        >
          {iseditable && (
            <button
              className="self-end text-red-600"
              onClick={handleDeleteOnClick}
            >
              Löschen
            </button>
          )}
          <iframe
            src={uploadUrl}
            width="100%"
            height="600px max-w-xs max-h-96 self-center"
            style={{ border: "none" }}
          />
          {!wasUploaded ? (
            <>
              <div className="italic">
                Hinweis: Der Upload der ausgewählten PDF muss noch bestätigt
                werden!
              </div>
              <SubmitButton text={"Bild hochladen"} expanded={false} />
            </>
          ) : (
            <div className="text-green-600">
              Der Upload der PDF war erfolgreich!
            </div>
          )}
        </div>
      </form>
    </QuestionTypes>
  );
};

export default PDFUploadQuestionType;
