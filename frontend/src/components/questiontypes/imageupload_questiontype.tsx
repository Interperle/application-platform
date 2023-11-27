"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { deleteImageUploadAnswer, saveImageUploadAnswer } from "@/actions/answers/imageUpload";
import { fetchImageUploadAnswer } from "@/utils/helpers";

export interface ImageUploadQuestionTypeProps
  extends DefaultQuestionTypeProps {}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
}) => {
  const saveImageUploadAnswerWithId = saveImageUploadAnswer.bind(null, questionid)
  const [uploadUrl, setUploadImage] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      try {
        const imageUploadBucketData = await fetchImageUploadAnswer(questionid)
        const url = URL.createObjectURL(imageUploadBucketData!)
        setUploadImage(url)
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid]);

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files){
      setUploadImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    deleteImageUploadAnswer(questionid)
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
          <input
            type="file"
            id={questionid}
            name={questionid}
            accept="image/png, image/jpeg"
            required={mandatory}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onChange={(event) => handleUploadChange(event)}
          />
        </div>
        {uploadUrl &&
          <div className="mt-4">
            <Image alt="Preview" src={uploadUrl} className="max-w-xs" id="imagePreview" width={100} height={100}/>
            <button onClick={handleDeleteOnClick}>Delete</button>
          </div>
        }
        <button type="submit">Upload Bild</button>
      </form>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;
