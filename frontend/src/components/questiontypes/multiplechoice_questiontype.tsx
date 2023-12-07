"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { Choice, ChoiceProps } from "./utils/multiplechoice_choice";
import {
  fetchMultipleChoiceAnswer,
  saveMultipleChoiceAnswer,
} from "@/actions/answers/multipleChoice";
import { AwaitingChild } from "../awaiting";
import { exit } from "process";

export interface MultipleChoiceQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  choices: ChoiceProps[];
  minanswers: number;
  maxanswers: number;
  userinput: boolean;
}

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  answerid,
  choices,
  minanswers,
  maxanswers,
  userinput,
}) => {
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const savedAnswer = await fetchMultipleChoiceAnswer(answerid);
          if (maxanswers == 1) {
            setSelectedChoice(savedAnswer || "");
          } else {
            setSelectedChoices(savedAnswer.split(",") || []);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid, maxanswers]);

  const handleSingleChange = (choice: ChoiceProps) => {
    if (selectedChoice === choice.choiceid) {
      saveMultipleChoiceAnswer("", questionid);
      setSelectedChoice("");
    } else {
      saveMultipleChoiceAnswer(choice.choiceid, questionid);
      setSelectedChoice(choice.choiceid);
    }
  };

  const handleMultiChange = (choice: ChoiceProps) => {
    if (!selectedChoices.includes(choice.choiceid)) {
      if (selectedChoices.length + 1 > maxanswers) {
        setSelectedChoices(
          selectedChoices.filter((selected) => selected !== choice.choiceid),
        );
        alert("Du kannst maximal " + maxanswers + " auswählen!");
        return;
      } /*else if (selectedChoices.length > 0 && selectedChoices.length - 1 < minanswers && mandatory) {
        setSelectedChoices(
          selectedChoices.filter((selected) => selected !== choice.choiceid),
        );
        alert("Du musst mindestens " + minanswers + " auswählen!");
        return;
      }*/
    }
    let newChoices;
    if (selectedChoices.includes(choice.choiceid)) {
      newChoices = selectedChoices.filter(
        (selected) => selected !== choice.choiceid,
      );
    } else {
      newChoices = [...selectedChoices, choice.choiceid];
    }
    saveMultipleChoiceAnswer(newChoices.toString(), questionid);
    setSelectedChoices(newChoices);
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
        <div role="group" aria-labelledby={questionid} className="mt-2">
          {choices.map((choice) => (
            <Choice
              key={choice.choiceid}
              choiceid={choice.choiceid}
              choicetext={choice.choicetext}
              isSelected={
                maxanswers == 1
                  ? selectedChoice === choice.choiceid
                  : selectedChoices.includes(choice.choiceid)
              }
              mandatory={mandatory}
              minanswers={minanswers}
              maxanswers={maxanswers}
              onSingleChange={() => handleSingleChange(choice)}
              onMultiChange={() => handleMultiChange(choice)}
            />
          ))}
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
