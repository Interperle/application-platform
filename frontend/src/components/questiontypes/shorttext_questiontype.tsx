"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchShortTextAnswer,
  saveShortTextAnswer,
} from "@/actions/answers/shortText";
import { AwaitingChild } from "../awaiting";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  answerid,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchShortTextAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }

    loadAnswer();
  }, [questionid, answerid]);

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
      questionorder={questionorder}
    >
      <AwaitingChild isLoading={isLoading}>
        <input
          type="text"
          name={questionid}
          id={questionid}
          value={answer}
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
          required={mandatory}
          maxLength={50}
          onBlur={(event) =>
            saveShortTextAnswer(event.target.value, questionid)
          }
          onChange={handleChange}
        />
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;
