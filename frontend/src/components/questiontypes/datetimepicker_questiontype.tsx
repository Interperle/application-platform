"use client";
import React, { useEffect, useState } from "react";

import {
  fetchDateTimePickerAnswer,
  saveDateTimePickerAnswer,
} from "@/actions/answers/dateTimePicker";
import { setToPrefferedTimeZone } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UpdateAnswer } from "@/store/slices/answerSlice";

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
  selectedSection,
  selectedCondChoice,
  questionsuborder,
}) => {
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => state.answerReducer[questionid]?.answervalue as string || "",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        const savedAnswer = await fetchDateTimePickerAnswer(questionid);
        updateAnswerState(savedAnswer.pickeddatetime, savedAnswer.answerid);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, selectedSection, selectedCondChoice]);

  const updateAnswerState = (answervalue: string, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    updateAnswerState(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    if (event.target.value == ""){
      updateAnswerState("");
      saveDateTimePickerAnswer("", questionid);
      return
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
      updateAnswerState("");
      saveDateTimePickerAnswer("", questionid);
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
