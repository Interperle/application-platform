"use client";
import React, { useEffect, useState } from "react";

import { AnswerState } from "@/store/slices/answerSlice";
import { useAppSelector } from "@/store/store";
import { transformReadableDate } from "@/utils/helpers";

import { AwaitingChild } from "./awaiting";

export const ProgressBar = ({
  progressbarId,
  mandatoryQuestionIds,
  dependingOn,
  endDate,
}: {
  progressbarId: string;
  mandatoryQuestionIds: string[];
  dependingOn: Record<string, string[]>;
  endDate: string;
}) => {
  const answeredQuestions = useAppSelector<AnswerState>(
    (state) => state.answerReducer,
  );
  const [numAnswered, setNumAnswered] = useState(0);
  const [numMandatory, setNumMandatory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const answeredMandatory = mandatoryQuestionIds.filter(
      (questionId) => questionId in answeredQuestions,
    ).length;
    let conditionalMandatory = 0;
    const answeredConditional = [];

    for (const dependingOnId in dependingOn) {
      if (dependingOnId in answeredQuestions) {
        const dependingQuestionIds = dependingOn[dependingOnId];
        conditionalMandatory += dependingQuestionIds.length;
        dependingQuestionIds.forEach((dependentOnId) => {
          if (dependentOnId in answeredQuestions) {
            answeredConditional.push(dependentOnId);
          }
        });
      }
    }

    setNumAnswered(answeredMandatory + answeredConditional.length);
    setNumMandatory(mandatoryQuestionIds.length + conditionalMandatory);
    setIsLoading(false);
  }, [
    mandatoryQuestionIds,
    progressbarId,
    dependingOn,
    Object.keys(answeredQuestions),
  ]);

  const stringDate = transformReadableDate(endDate);
  return (
    <AwaitingChild isLoading={isLoading}>
      <div className="w-full bg-gray-300 rounded-2xl border">
        <div
          style={{
            width: `${(numAnswered / numMandatory) * 100}%`,
          }}
          className={`h-4 rounded-2xl border ${
            numAnswered != numMandatory ? "bg-secondary" : "bg-green-600"
          }`}
        />
      </div>
      <div>Testing Helper: {numAnswered}/{numMandatory}</div>
      {numAnswered == numMandatory &&
        (new Date(endDate) > new Date(Date.now()) ? (
          <div className="md-3 italic text-gray-500">
            Deine Bewerbungsphase ist vollständig, du kannst sie aber bis zum{" "}
            {stringDate} weiter ändern.
          </div>
        ) : (
          <div className="md-3 italic text-gray-500">
            Deine Bewerbungsphase ist vollständig. Die Phase ist seit dem{" "}
            {stringDate} zu Ende. Du kannst deine Ergebnisse weiterhin einsehen.
          </div>
        ))}
    </AwaitingChild>
  );
};
