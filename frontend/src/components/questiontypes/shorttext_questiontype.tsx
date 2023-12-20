"use client";
import React, { useEffect, useState } from "react";

import {
  fetchShortTextAnswer,
  saveShortTextAnswer,
} from "@/actions/answers/shortText";
import { checkRegex } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxtextlength: number;
  formattingregex: string | null;
  formattingdescription: string | null;
}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
  maxtextlength,
  formattingregex,
  formattingdescription,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
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
  }, [questionid, answerid, selectedSection, selectedCondChoice]);

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
    const textinput = event.target.value;
    if (
      textinput != "" &&
      formattingregex &&
      !checkRegex(formattingregex, textinput)
    ) {
      setAnswer("");
      alert(`Dieses ${formattingdescription} Format wird nicht unterstützt!`);
      return;
    }
    saveShortTextAnswer(textinput, questionid);
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
          type="text"
          name={questionid}
          id={questionid}
          value={answer}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
          required={mandatory}
          maxLength={maxtextlength}
          onBlur={(event) => handleBlur(event)}
          onChange={(event) => handleChange(event)}
        />
        <p
          className={`italic  text-sm text-right ${
            answer.length == maxtextlength ? "text-red-500" : "text-gray-500"
          } `}
        >
          {answer.length}/{maxtextlength} Zeichen
        </p>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;
