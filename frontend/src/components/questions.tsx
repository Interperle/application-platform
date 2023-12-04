"use client";

import React from "react";
import getQuestionComponent, {
  QuestionType,
} from "@/components/questiontypes/utils/questiontype_selector";
import { PhaseData, setPhase } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";
import { Answer } from "@/actions/answers/answers";

export interface DefaultQuestion {
  questionid: string;
  questiontype: QuestionType;
  questionorder: number;
  phaseid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
}

export interface Question extends DefaultQuestion {
  params: any;
}

interface QuestionnaireProps {
  phaseData: PhaseData;
  phaseQuestions: Question[];
  phaseAnswers: Answer[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  phaseData,
  phaseQuestions,
  phaseAnswers,
}) => {
  const dispatch = useAppDispatch();
  // need a copy, so I can modify it beneath
  const copyPhaseQuestions = phaseQuestions.map((phaseQuestions) => {
    return phaseQuestions;
  });
  dispatch(
    setPhase({
      phasename: phaseData.phasename,
      phasedata: phaseData,
      phasequestions: phaseQuestions,
    }),
  );
  return (
    <div>
      {copyPhaseQuestions
        .sort((a, b) => a.questionorder - b.questionorder)
        .map((phaseQuestion) => {
          const QuestionComponent = getQuestionComponent(
            phaseQuestion.questiontype,
          );
          if (!QuestionComponent) {
            console.error(
              `Unknown question type: ${phaseQuestion.questiontype}`,
            );
            return null;
          }
          return (
            <QuestionComponent
              key={phaseQuestion.questionid}
              phasename={phaseData.phasename}
              questionid={phaseQuestion.questionid}
              mandatory={phaseQuestion.mandatory}
              questiontext={phaseQuestion.questiontext}
              questionnote={phaseQuestion.questionnote}
              answerid={
                phaseAnswers.find(
                  (answer) => answer.questionid == phaseQuestion.questionid,
                )?.answerid
              }
              {...phaseQuestion.params}
            />
          );
        })}
    </div>
  );
};

export default Questionnaire;
