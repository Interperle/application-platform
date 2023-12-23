"use client";
import React from "react";

import { AnswerState } from "@/store/slices/answerSlice";
import { useAppSelector } from "@/store/store";
import { numberToLetter } from "@/utils/helpers";

import { Question } from "./questions";

export const MissingQuestions = ({
  phaseQuestions,
  dependingOn,
}: {
  phaseQuestions: Question[];
  dependingOn: Record<string, string[]>;
}) => {
  const answeredQuestions = useAppSelector<AnswerState>(
    (state) => state.answerReducer,
  );

  return (
    <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
      <svg
        className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div>
        <span className="font-medium">
          Die folgenden verpflichtenden Fragen sind noch ausstehend:
        </span>
        <ul className="mt-1.5 list-inside">
          {phaseQuestions.map((question) => {
            if (question.questiontype != "conditional") {
              if (
                !question.mandatory ||
                question.questionid in answeredQuestions
              ) {
                return null;
              }
              return (
                <li key={question.questionid}>
                  {question.questionorder}. {question.questiontext}
                </li>
              );
            }
            if (
              question.mandatory &&
              !(question.questionid in answeredQuestions)
            ) {
              return (
                <li key={question.questionid}>
                  {question.questionorder}. {question.questiontext}
                </li>
              );
            }
            if (question.questionid in answeredQuestions) {
              const allChoices = question.params.choices;
              for (const choice of allChoices) {
                for (const condQuestion of choice.questions) {
                  if (
                    !condQuestion.mandatory ||
                    condQuestion.questionid in answeredQuestions ||
                    answeredQuestions[question.questionid].answervalue !=
                      choice.choiceid
                  ) {
                    return null;
                  }
                  return (
                    <li key={condQuestion.questionid}>
                      {question.questionorder}{" "}
                      {numberToLetter(condQuestion.questionorder)}){" "}
                      {condQuestion.questiontext}
                    </li>
                  );
                }
              }
            }
          })}
        </ul>
      </div>
    </div>
  );
};
