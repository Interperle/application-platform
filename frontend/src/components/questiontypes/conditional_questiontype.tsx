"use client";

import React, { useEffect, useState } from "react";

import {
  fetchConditionalAnswer,
  saveConditionalAnswer,
} from "@/actions/answers/conditional";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";
import { Question } from "../questions";
import { ConditionalChoice } from "./utils/conditional_choice";

export interface ConditionalQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const ConditionalQuestionType: React.FC<ConditionalQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
  selectedSection,
}) => {
  const [selectedChoice, setSelectedChoice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log("Render Conditional"); // Keep to ensure it's rerendered


  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchConditionalAnswer(answerid);
          setSelectedChoice(savedAnswer || "");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid, selectedSection]);

  const handleSingleChange = (choice: Question) => {
    if (!iseditable) {
      return;
    }
    if (selectedChoice === choice.questionid) {
      saveConditionalAnswer("", questionid);
      setSelectedChoice("");
    } else {
      saveConditionalAnswer(choice.questionid, questionid);
      setSelectedChoice(choice.questionid);
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
    >
      <AwaitingChild isLoading={isLoading}>
        <div role="group" aria-labelledby={questionid} className="mt-2">
          
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default ConditionalQuestionType;

/*{choices.map((choice) => (
  <ConditionalChoice
  key={choice.questionid}
  iseditable={iseditable}
  choiceid={choice.questionid}
  choicetext={choice.questiontext}
  isSelected={selectedChoice === choice.questionid}
  onSingleChange={() => handleSingleChange(choice)}
/>
))}*/