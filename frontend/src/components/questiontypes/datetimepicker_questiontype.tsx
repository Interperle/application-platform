"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { setToPrefferedTimeZone } from "@/utils/helpers";
import {
  fetchDateTimePickerAnswer,
  saveDateTimePickerAnswer,
} from "@/actions/answers/dateTimePicker";
import { AwaitingChild } from "../awaiting";

export interface DatetimePickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const DatetimePickerQuestionType: React.FC<DatetimePickerQuestionTypeProps> = ({
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
          const savedAnswer = await fetchDateTimePickerAnswer(answerid);
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
          type="datetime-local"
          id={questionid}
          name={questionid}
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onBlur={(event) =>
            saveDateTimePickerAnswer(
              setToPrefferedTimeZone(event.target.value),
              questionid,
            )
          }
          onChange={handleChange}
          value={answer}
        />
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DatetimePickerQuestionType;
