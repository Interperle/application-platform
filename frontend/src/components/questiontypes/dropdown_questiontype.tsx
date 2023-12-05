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
  minanswers: number;
  maxanswers: number;
  userinput: boolean;
}

const DropdownQuestionType: React.FC<DropdownQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  minanswers,
  maxanswers,
  userinput,
  answerid,
  options,
}) => {
  const [singleAnswer, setSingleAnswer] = useState("");
  const [multiAnswer, setMultiAnswer] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchDropdownAnswer(answerid);
          if (maxanswers == 1){
            setSingleAnswer(savedAnswer || "");
          } else {
            setMultiAnswer(savedAnswer.split(",") || [])
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch singleAnswer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleSingleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption =
      event.target.options[event.target.selectedIndex].text;
    saveDropdownAnswer(selectedOption, questionid);
    setSingleAnswer(event.target.value);
  };

  const handleMultiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value).filter((value) => value !== "empty");
    if ((!mandatory || (selectedOptions.length >= minanswers) && mandatory) && (selectedOptions.length <= maxanswers)) {
      saveDropdownAnswer(selectedOptions.toString(), questionid);
      setMultiAnswer(selectedOptions);
    } else {
      setMultiAnswer(selectedOptions);
      alert("Du musst mindestens " + minanswers + " und kannst maximal " + maxanswers + " Antworten auswählen!")
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
    >
      <AwaitingChild isLoading={isLoading}>
        {(maxanswers == 1) ? (
          <select
            id={questionid}
            name={questionid}
            required={mandatory}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSingleChange}
            value={singleAnswer}
          >
            {singleAnswer === "" && (
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
          </select>) : (
          <>
            <span className="italic text-gray-500 text-sm">Um mehrere Optionen auszuwählen, bitte halte unter Windows die "Alt" und unter Mac die "CMD" Taste gedrückt.</span>
            <select
              multiple
              size={maxanswers}
              id={questionid}
              name={questionid}
              required={mandatory}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleMultiChange}
              value={multiAnswer}
            >
              {!mandatory && <option key="empty" value="empty"></option>}
              {options.map((option) => (
                <DropdownOption
                  key={option.optionid}
                  optionid={option.optionid}
                  optiontext={option.optiontext}
                />
              ))}
            </select>
          </>
        )
        }
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DropdownQuestionType;
