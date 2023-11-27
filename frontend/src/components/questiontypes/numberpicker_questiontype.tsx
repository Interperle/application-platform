"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchNumberPickerAnswer,
  saveNumberPickerAnswer,
} from "@/actions/answers/numberPicker";

export interface NumberPickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  min: number;
  max: number;
}

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  min,
  max,
}) => {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      try {
        const savedAnswer = await fetchNumberPickerAnswer(questionid);
        setAnswer(savedAnswer);
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
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;
