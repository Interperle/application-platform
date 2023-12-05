"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchNumberPickerAnswer,
  saveNumberPickerAnswer,
} from "@/actions/answers/numberPicker";
import { AwaitingChild } from "../awaiting";

export interface NumberPickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  min: number;
  max: number;
}

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  answerid,
  min,
  max,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchNumberPickerAnswer(answerid);
          setAnswer(savedAnswer);
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
          type="number"
          id={questionid}
          name={questionid}
          required={mandatory}
          min={min}
          max={max}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onBlur={(event) =>
            saveNumberPickerAnswer(event.target.value, questionid)
          }
          onChange={handleChange}
          value={answer}
        />
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;
