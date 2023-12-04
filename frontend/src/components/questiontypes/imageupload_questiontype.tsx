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
}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
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
    >
      <form action={saveImageUploadAnswerWithId}>
        <div className="mt-1">
          <AwaitingChild isLoading={isLoading}>
            <input
              type="file"
              id={questionid}
              name={questionid}
              accept="image/png, image/jpeg"
              required={mandatory}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              onChange={(event) => handleUploadChange(event)}
            />
          </AwaitingChild>
        </div>
        {uploadUrl && (
          <div className="mt-4 flex flex-col gap-y-2">
            <button className="self-end text-red-600" onClick={handleDeleteOnClick}>Löschen</button>
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
