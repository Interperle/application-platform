"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  deleteImageUploadAnswer,
  saveImageUploadAnswer,
} from "@/actions/answers/imageUpload";
import { fetchImageUploadAnswer } from "@/utils/helpers";
import { SubmitButton } from "../submitButton";
import { AwaitingChild } from "../awaiting";

export interface ImageUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxfilesizeinmb: number;
}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  maxfilesizeinmb,
  answerid,
}) => {
  const saveImageUploadAnswerWithId = saveImageUploadAnswer.bind(
    null,
    questionid,
  );
  const [uploadUrl, setUploadImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const imageUploadBucketData = await fetchImageUploadAnswer(
            questionid,
            answerid,
          );
          const url = URL.createObjectURL(imageUploadBucketData!);
          setUploadImage(url);
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
      setUploadImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    deleteImageUploadAnswer(questionid, answerid || "");
    setUploadImage("");
  };

  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
      questionorder={questionorder}
    >
      <form action={saveImageUploadAnswerWithId}>
        <div className="mt-1">
          <AwaitingChild isLoading={isLoading}>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={questionid}
                className="flex flex-col items-center justify-center w-full h-34 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-secondary text-center">
                    <p className="font-semibold">Zum Uploaden klicken</p> oder
                    per Drag and Drop
                  </p>
                  <p className="text-xs text-secondary">
                    PNG, JPG oder JPEG (MAX. 2MB)
                  </p>
                </div>
                <input
                  type="file"
                  id={questionid}
                  name={questionid}
                  accept="image/png, image/jpeg"
                  required={mandatory}
                  className="hidden"
                  onChange={(event) => handleUploadChange(event)}
                />
              </label>
            </div>
          </AwaitingChild>
        </div>
        {uploadUrl && (
          <div className="mt-4 flex flex-col gap-y-2">
            <button
              className="self-end text-red-600"
              onClick={handleDeleteOnClick}
            >
              Löschen
            </button>
            <Image
              alt="Preview"
              src={uploadUrl}
              className="max-w-xs self-center"
              id="imagePreview"
              width={100}
              height={100}
            />
            <SubmitButton text={"Bild hochladen"} expanded={false} />
          </div>
        )}
      </form>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;
