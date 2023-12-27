"use client";

import React, { useEffect } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import { INIT_PLACEHOLDER, UpdateAnswer } from "@/store/slices/answerSlice";
import { PhaseData } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";

import PhaseOverview from "./phaseOverview";
import { Question } from "./questions";

const ApplicationOverview: React.FC<{
  phasesData: PhaseData[];
  phasesQuestions: Record<string, Question[]>;
  phaseAnswers: ExtendedAnswerType[];
}> = ({ phasesData, phasesQuestions, phaseAnswers }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    phaseAnswers.forEach((answer) => {
      updateAnswerState(
        answer.questionid,
        answer.answerid,
        answer?.answervalue,
      );
    });
  }, [phaseAnswers]);

  const updateAnswerState = (
    questionid: string,
    answerid?: string,
    answervalue?: string | null,
  ) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue || INIT_PLACEHOLDER,
        answerid: answerid || "",
      }),
    );
  };

  return (
    <>
      {phasesData
        .sort((a, b) => a.phaseorder - b.phaseorder)
        .map((phase) => {
          const phaseQuestions = phasesQuestions[phase.phaseid];
          const mandatoryPhaseQuestionIds = phaseQuestions
            .filter((q) => q.mandatory)
            .map((q) => q.questionid);
          return (
            <PhaseOverview
              key={phase.phaseid}
              phaseName={phase.phasename}
              phaseLabel={phase.phaselabel}
              phaseOrder={phase.phaseorder}
              phaseStart={phase.startdate}
              phaseEnd={phase.enddate}
              mandatoryQuestionIds={mandatoryPhaseQuestionIds}
              phaseQuestions={phaseQuestions}
            />
          );
        })}
    </>
  );
};

export default ApplicationOverview;
