"use client"

import React from "react";
import Image from "next/image";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";

export interface ImageUploadQuestionTypeProps
  extends DefaultQuestionTypeProps {}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
}) => {
  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
    >
      <div className="mt-1">
        <input
          type="file"
          id={questionid}
          name={questionid}
          accept="image/*"
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-4">
        <Image alt="Preview" src="" className="max-w-xs" id="imagePreview" />
      </div>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;
