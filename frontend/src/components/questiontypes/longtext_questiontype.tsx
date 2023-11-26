"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  fetchLongTextAnswer,
  saveLongTextAnswer,
} from "@/actions/answers/longText";

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({
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
        const savedAnswer = await fetchLongTextAnswer(questionid);
        setAnswer(savedAnswer || "");
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid]);

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
    >
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
    </QuestionTypes>
  );
};

export default LongTextQuestionType;
