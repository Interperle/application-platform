"use client";
import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { saveShortTextAnswer } from "@/actions/answers";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
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
      <input
        type="text"
        name={questionid}
        id={questionid}
        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
        required={mandatory}
        maxLength={50}
        onBlur={(event) => saveShortTextAnswer(event.target.value, questionid)}
      />
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;
