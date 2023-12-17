"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";

import { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";
import { fetchCheckBoxAnswer, saveCheckBoxAnswer } from "@/actions/answers/checkBox";

export interface CheckBoxQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const CheckBoxQuestionType: React.FC<CheckBoxQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
}) => {
  const [answer, setAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchCheckBoxAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }

    loadAnswer();
  }, [questionid, answerid]);

  const handleChange = () => {
    if (!iseditable){
      return
    }
    saveCheckBoxAnswer(!answer, questionid);
    setAnswer(!answer);
  };

  return (
    <div className="mb-4" key={questionid}>
      <AwaitingChild isLoading={isLoading}>
      <label
        htmlFor={questionid}
        className="block font-semibold text-secondary py-3"
      >
        <h4 className="py-1 text-base">
          {questionorder}.{" "}
          <input
            id={questionid}
            name={questionid}
            disabled={!iseditable}
            aria-disabled={!iseditable}
            type="checkbox"
            checked={answer}
            onChange={handleChange}
            onClick={handleChange}
            className="w-5 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2"
          />
          {mandatory && <span className="text-red-500">*</span>}
          <span
            className="break-after-avoid"
            dangerouslySetInnerHTML={{ __html: questiontext }}
          ></span>
        </h4>
        {questionnote && (
          <p className="italic text-gray-500 text-sm">{questionnote}</p>
        )}
      </label>
      </AwaitingChild>
    </div>
  );
};

export default CheckBoxQuestionType;
