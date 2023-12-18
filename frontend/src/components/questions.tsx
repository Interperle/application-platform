"use client";

import React from "react";

import { Answer } from "@/actions/answers/answers";
import getQuestionComponent, {
  QuestionType,
} from "@/components/questiontypes/utils/questiontype_selector";
import { PhaseData, setPhase } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";

import { InformationBox } from "./informationBox";

export interface DefaultQuestion {
  questionid: string;
  questiontype: QuestionType;
  questionorder: number;
  phaseid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
  sectionid: string | null;
  preinformationbox: string | null;
  postinformationbox: string | null;
}

export interface Question extends DefaultQuestion {
  params: any;
}

interface QuestionnaireProps {
  phaseData: PhaseData;
  phaseQuestions: Question[];
  phaseAnswers: Answer[];
  iseditable: boolean;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  phaseData,
  phaseQuestions,
  phaseAnswers,
  iseditable,
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
    <div className="mt-10">
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
            <React.Fragment key={phaseQuestion.questionid}>
              {phaseQuestion.preinformationbox && (
                <InformationBox
                  key={`${phaseQuestion.questionid}_pre_infobox`}
                  text={phaseQuestion.preinformationbox}
                />
              )}
              <QuestionComponent
                key={phaseQuestion.questionid}
                phasename={phaseData.phasename}
                questionid={phaseQuestion.questionid}
                mandatory={phaseQuestion.mandatory}
                questiontext={phaseQuestion.questiontext}
                questionnote={phaseQuestion.questionnote}
                questionorder={phaseQuestion.questionorder}
                iseditable={iseditable}
                answerid={
                  phaseAnswers.find(
                    (answer) => answer.questionid == phaseQuestion.questionid,
                  )?.answerid
                }
                {...phaseQuestion.params}
              />
              {phaseQuestion.postinformationbox && (
                <InformationBox
                  key={`${phaseQuestion.questionid}_post_infobox`}
                  text={phaseQuestion.postinformationbox}
                />
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Questionnaire;
