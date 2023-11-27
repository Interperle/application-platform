"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchShortTextAnswer,
  saveShortTextAnswer,
} from "@/actions/answers/shortText";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
}) => {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      try {
        const savedAnswer = await fetchShortTextAnswer(questionid);
        setAnswer(savedAnswer || "");
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }

    loadAnswer();
  }, [questionid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

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
        value={answer}
        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
        required={mandatory}
        maxLength={50}
        onBlur={(event) => saveShortTextAnswer(event.target.value, questionid)}
        onChange={handleChange}
      />
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;
