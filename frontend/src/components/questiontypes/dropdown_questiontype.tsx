"use client";
import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { DropdownOption, DropdownOptionProps } from "./utils/dropdown_option";
import {
  fetchDropdownAnswer,
  saveDropdownAnswer,
} from "@/actions/answers/dropdown";
import { AwaitingChild } from "../awaiting";

export interface DropdownQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  options: DropdownOptionProps[];
}

const DropdownQuestionType: React.FC<DropdownQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  answerid,
  options,
}) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchDropdownAnswer(answerid);
          setAnswer(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption =
      event.target.options[event.target.selectedIndex].text;
    saveDropdownAnswer(selectedOption, questionid);
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
      <AwaitingChild isLoading={isLoading}>
        <select
          id={questionid}
          name={questionid}
          required={mandatory}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={handleChange}
          value={answer}
        >
          {answer === "" && (
            <option key="invalid" value="" disabled hidden>
              Bitte wähle eine Option
            </option>
          )}
          {!mandatory && <option key="empty" value="empty"></option>}
          {options.map((option) => (
            <DropdownOption
              key={option.optionid}
              optionid={option.optionid}
              optiontext={option.optiontext}
            />
          ))}
        </select>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DropdownQuestionType;
