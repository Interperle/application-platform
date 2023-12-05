"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchLongTextAnswer,
  saveLongTextAnswer,
} from "@/actions/answers/longText";
import { AwaitingChild } from "../awaiting";

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({
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
          const savedAnswer = await fetchLongTextAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <textarea
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
          required={mandatory}
          maxLength={200}
          rows={4}
          style={{ minHeight: "100px" }}
          onBlur={(event) => saveLongTextAnswer(event.target.value, questionid)}
          onChange={handleChange}
          value={answer}
        />
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default LongTextQuestionType;
