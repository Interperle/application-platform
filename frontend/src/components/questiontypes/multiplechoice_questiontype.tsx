"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { Choice, ChoiceProps } from "./utils/multiplechoice_choice";
import {
  fetchMultipleChoiceAnswer,
  saveMultipleChoiceAnswer,
} from "@/actions/answers/multipleChoice";
import { AwaitingChild } from "../awaiting";

export interface MultipleChoiceQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  choices: ChoiceProps[];
}

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  answerid,
  choices,
}) => {
  const [selectedChoice, setSelectedChoice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if(answerid){
          const savedAnswer = await fetchMultipleChoiceAnswer(answerid);
          setSelectedChoice(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid]);

  const handleChange = (choice: ChoiceProps) => {
    if (selectedChoice === choice.choiceid) {
      saveMultipleChoiceAnswer("", questionid);
      setSelectedChoice("");
    } else {
      saveMultipleChoiceAnswer(choice.choiceid, questionid);
      setSelectedChoice(choice.choiceid);
    }
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
        <div role="group" aria-labelledby={questionid} className="mt-2">
          {choices.map((choice) => (
            <Choice
              key={choice.choiceid}
              choiceid={choice.choiceid}
              choicetext={choice.choicetext}
              isSelected={selectedChoice === choice.choiceid}
              mandatory={mandatory}
              onChange={() => handleChange(choice)}
            />
          ))}
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
