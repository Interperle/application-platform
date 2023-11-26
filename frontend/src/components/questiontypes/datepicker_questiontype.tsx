"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchDatePickerAnswer,
  saveDatePickerAnswer,
} from "@/actions/answers/datePicker";

export interface DatePickerQuestionTypeProps extends DefaultQuestionTypeProps {}

const DatePickerQuestionType: React.FC<DatePickerQuestionTypeProps> = ({
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
        const savedAnswer = await fetchDatePickerAnswer(questionid);
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
      <div className="mt-1">
        <input
          type="date"
          id={questionid}
          name={questionid}
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onBlur={(event) =>
            saveDatePickerAnswer(event.target.value, questionid)
          }
          onChange={handleChange}
          value={answer}
        />
      </div>
    </QuestionTypes>
  );
};

export default DatePickerQuestionType;
