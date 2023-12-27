"use client";

import React, { useEffect } from "react";

import { Answer } from "@/actions/answers/answers";
import { INIT_PLACEHOLDER, UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch } from "@/store/store";

import { PhaseData } from "@/store/slices/phaseSlice";
import PhaseOverview from "./phaseOverview";
import { Question } from "./questions";


const ApplicationOverview: React.FC<{
    phasesData: PhaseData[];
    mandatoryQuestions: Question[];
    dependingOn: Record<string, string[]>;
    phaseAnswers: Answer[];
}> = ({
    phasesData,
    mandatoryQuestions,
    dependingOn,
    phaseAnswers,
}) => {
        const dispatch = useAppDispatch();

        useEffect(() => {
            phaseAnswers.forEach((answer) => {
                updateAnswerState(answer.questionid, answer.answerid);
            });
        }, [phaseAnswers]);

        const updateAnswerState = (questionid: string, answerid?: string) => {
            dispatch(
                UpdateAnswer({
                    questionid: questionid,
                    answervalue: INIT_PLACEHOLDER,
                    answerid: answerid || "",
                }),
            );
        };

        return (
            <>
                {phasesData
                    .sort((a, b) => a.phaseorder - b.phaseorder)
                    .map((phase) => {
                        const mandatoryPhaseQuestionIds = mandatoryQuestions
                            .filter((q) => q.phaseid === phase.phaseid)
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
                                dependingOn={dependingOn}
                            />
                        );
                    })}
            </>
        );
    };

export default ApplicationOverview;

