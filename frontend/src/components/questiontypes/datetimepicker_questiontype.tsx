"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { setToPrefferedTimeZone } from "@/utils/helpers";
import {
  fetchDateTimePickerAnswer,
  saveDateTimePickerAnswer,
} from "@/actions/answers/dateTimePicker";

export interface DatetimePickerQuestionTypeProps
  extends DefaultQuestionTypeProps {}

const DatetimePickerQuestionType: React.FC<DatetimePickerQuestionTypeProps> = ({
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
        const savedAnswer = await fetchDateTimePickerAnswer(questionid);
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
    </QuestionTypes>
  );
};

export default DatetimePickerQuestionType;
