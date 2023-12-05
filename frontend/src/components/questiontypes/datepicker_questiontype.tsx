"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchDatePickerAnswer,
  saveDatePickerAnswer,
} from "@/actions/answers/datePicker";
import { AwaitingChild } from "../awaiting";

export interface DatePickerQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  mindate: Date | null;
  maxdate: Date | null;
}

const DatePickerQuestionType: React.FC<DatePickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  mindate,
  maxdate,
  answerid,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchDatePickerAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        alert("Failed to fetch answer");
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    const minDate = mindate ? new Date(mindate) : null;
    const maxDate = maxdate ? new Date(maxdate) : null;
    if (
      (minDate === null || selectedDate >= minDate) &&
      (maxDate === null || selectedDate <= maxDate)
    ) {
      saveDatePickerAnswer(event.target.value, questionid);
    } else {
      setAnswer("");
      alert(
        "Dein ausgewähltes Datum " +
          selectedDate.toDateString() +
          " liegt nicht zwischen " +
          mindate +
          " und " +
          maxdate,
      );
    }
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
        <div className="mt-1">
          <input
            type="date"
            id={questionid}
            name={questionid}
            required={mandatory}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onBlur={(e) => handleBlur(e)}
            onChange={handleChange}
            value={answer}
          />
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DatePickerQuestionType;
