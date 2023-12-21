"use client";

import React, { useEffect, useState } from "react";

import {
  fetchMultipleChoiceAnswer,
  saveMultipleChoiceAnswer,
} from "@/actions/answers/multipleChoice";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { Choice, ChoiceProps } from "./utils/multiplechoice_choice";
import { AwaitingChild } from "../awaiting";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

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
  iseditable,
  choices,
  minanswers,
  maxanswers,
  userinput,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
}) => {
  const dispatch = useAppDispatch();

  const selectedChoice = useAppSelector<string>(
    (state) => state.answerReducer[`${questionid}_single`]?.answervalue as string || "",
  );
  const selectedChoices = useAppSelector<string[]>(
    (state) => state.answerReducer[`${questionid}_multi`]?.answervalue as string[] || [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        const savedAnswer = await fetchMultipleChoiceAnswer(questionid);
        if (maxanswers == 1) {
          updateAnswerState(savedAnswer.selectedchoice, savedAnswer.answerid);
        } else {
          updateAnswerState(savedAnswer.selectedchoice.split(",") || [], savedAnswer.answerid)
        }
      } catch (error) {
        console.error("Failed to fetch answer", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, maxanswers, selectedSection, selectedCondChoice]);


  const updateAnswerState = (answervalue: string | string[], answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: maxanswers == 1 ? `${questionid}_single` : `${questionid}_multi`,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleSingleChange = (choice: ChoiceProps) => {
    if (!iseditable) {
      return;
    }
    if (selectedChoice === choice.choiceid) {
      saveMultipleChoiceAnswer("", questionid);
      updateAnswerState("");
    } else {
      saveMultipleChoiceAnswer(choice.choiceid, questionid);
      updateAnswerState(choice.choiceid);
    }
  };

  const handleMultiChange = (choice: ChoiceProps) => {
    if (!iseditable) {
      return;
    }
    if (!selectedChoices.includes(choice.choiceid)) {
      if (selectedChoices.length + 1 > maxanswers) {
        updateAnswerState(
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
    updateAnswerState(newChoices);
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
        <div role="group" aria-labelledby={questionid} className="mt-2">
          {choices.map((choice) => (
            <Choice
              key={choice.choiceid}
              iseditable={iseditable}
              choiceid={choice.choiceid}
              choicetext={choice.choicetext}
              isSelected={
                maxanswers == 1
                  ? selectedChoice === choice.choiceid
                  : selectedChoices.includes(choice.choiceid)
              }
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
