"use client";
import React, { useEffect, useState } from "react";

import {
  fetchDateTimePickerAnswer,
  saveDateTimePickerAnswer,
} from "@/actions/answers/dateTimePicker";
import { setToPrefferedTimeZone } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";

export interface DatetimePickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  mindatetime: Date;
  maxdatetime: Date;
}

const DatetimePickerQuestionType: React.FC<DatetimePickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  mindatetime,
  maxdatetime,
  answerid,
  selectedSection,
  questionsuborder,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log("Render Datetimepicker"); // Keep to ensure it's rerendered

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
  }, [questionid, answerid, selectedSection]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    setAnswer(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    const selectedDate = new Date(event.target.value);
    const minDateTime = mindatetime ? new Date(mindatetime) : null;
    const maxDateTime = maxdatetime ? new Date(maxdatetime) : null;
    if (
      (minDateTime === null || selectedDate >= minDateTime) &&
      (maxDateTime === null || selectedDate <= maxDateTime)
    ) {
      saveDateTimePickerAnswer(
        setToPrefferedTimeZone(event.target.value),
        questionid,
      );
    } else {
      setAnswer("");
      alert(
        "Dein ausgewählter Zeitpunkt " +
          selectedDate.toDateString() +
          " liegt nicht zwischen " +
          mindatetime +
          " und " +
          maxdatetime,
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
      iseditable={iseditable}
      questionsuborder={questionsuborder}
    >
      <AwaitingChild isLoading={isLoading}>
        <input
          type="datetime-local"
          disabled={!iseditable}
          aria-disabled={!iseditable}
          id={questionid}
          name={questionid}
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onBlur={(event) => handleBlur(event)}
          onChange={handleChange}
          value={answer}
        />
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DatetimePickerQuestionType;
