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
import { Answer } from "@/actions/answers/answers";
import getQuestionComponent from "./utils/questiontype_selector";
import { InformationBox } from "../informationBox";
import { numberToLetter } from "@/utils/helpers";

export interface conditionalChoicesProps {
  choiceid: string;
  choicevalue: string;
  questions: Question[];
}

export interface ConditionalQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  choices: conditionalChoicesProps[];
  phaseAnswers: Answer[];
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
  choices,
  phaseAnswers,
  questionsuborder,
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

  const handleChange = (choice: conditionalChoicesProps) => {
    if (!iseditable) {
      return;
    }
    if (selectedChoice === choice.choiceid) {
      saveConditionalAnswer("", questionid);
      setSelectedChoice("");
    } else {
      saveConditionalAnswer(choice.choiceid, questionid);
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
      questionorder={questionorder}
      iseditable={iseditable}
      questionsuborder={questionsuborder}
    >
      <AwaitingChild isLoading={isLoading}>
        <div role="group" aria-labelledby={questionid} className="mt-2">
        {choices.map((choice) => (
          <ConditionalChoice
            key={choice.choiceid}
            iseditable={iseditable}
            choiceid={choice.choiceid}
            choicevalue={choice.choicevalue}
            isSelected={selectedChoice === choice.choiceid}
            onChange={() => handleChange(choice)}
          />
        ))}
        </div>
        <div className="mt-5">
        {choices.map((choice) => (
          [...choice.questions]
          .sort((a, b) => a.questionorder - b.questionorder)
          .map((condQuestion) => {
            const QuestionComponent = getQuestionComponent(
              condQuestion.questiontype,
            );
            if (!QuestionComponent) {
              console.error(
                `Unknown question type: ${condQuestion.questiontype}`,
              );
              return null;
            }
            const sub_order = numberToLetter(condQuestion.questionorder)
            return (
              <div key={condQuestion.questionid} style={{ display: condQuestion.depends_on == choice.choiceid && choice.choiceid == selectedChoice ? 'block' : 'none'}} className="ml-8">
                {condQuestion.preinformationbox && (
                  <InformationBox
                    key={`${condQuestion.questionid}_pre_infobox`}
                    text={condQuestion.preinformationbox}
                  />
                )}
                <QuestionComponent
                  key={condQuestion.questionid}
                  phasename={phasename}
                  questionid={condQuestion.questionid}
                  mandatory={condQuestion.mandatory}
                  questiontext={condQuestion.questiontext}
                  questionnote={condQuestion.questionnote}
                  questionorder={questionorder}
                  iseditable={iseditable}
                  selectedSection={selectedSection}
                  questionsuborder={sub_order}
                  answerid={
                    phaseAnswers.find(
                      (answer) => answer.questionid == condQuestion.questionid,
                    )?.answerid
                  }
                  {...condQuestion.params}
                />
                {condQuestion.postinformationbox && (
                  <InformationBox
                    key={`${condQuestion.questionid}_post_infobox`}
                    text={condQuestion.postinformationbox}
                  />
                )}
              </div>
            );
          })))}
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default ConditionalQuestionType;
