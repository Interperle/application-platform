"use client";

import React, { useEffect, useState } from "react";

import {
  fetchLongTextAnswer,
  saveLongTextAnswer,
} from "@/actions/answers/longText";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxtextlength: number;
}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
  maxtextlength,
  selectedSection,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log("Render Longtext"); // Keep to ensure it's rerendered

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchLongTextAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid, selectedSection]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!iseditable) {
      return;
    }
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
      iseditable={iseditable}
    >
      <AwaitingChild isLoading={isLoading}>
        <textarea
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
          required={mandatory}
          maxLength={maxtextlength}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          style={{ minHeight: "200px" }}
          onBlur={(event) => saveLongTextAnswer(event.target.value, questionid)}
          onChange={handleChange}
          value={answer}
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

export default LongTextQuestionType;
