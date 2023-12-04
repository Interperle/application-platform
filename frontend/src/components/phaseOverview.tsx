"use client";

import { calcPhaseStatus, transformReadableDate, transformReadableDateTime } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import React from "react";
import { ProgressBar } from "./progressbar";

const PhaseOverview: React.FC<{
  key: string;
  phaseName: string;
  phaseStart: string;
  phaseEnd: string;
  mandatoryQuestionIds: string[];
  numAnswers: number;
}> = ({
  key,
  phaseName,
  phaseStart,
  phaseEnd,
  mandatoryQuestionIds,
  numAnswers,
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/${phaseName}`);
  };
  const phaseStatus = calcPhaseStatus(phaseStart, phaseEnd);
  return (
    <div
      key={key}
      className="w-full max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 md:grid-cols-1 md:grid-rows-2">
          <h2 className="rounded font-bold">{phaseName}</h2>
          <h4 className="rounded">
            <div className="flex-row-2 gap-x-2">
              <div>
                Beginn: {transformReadableDateTime(phaseStart)} Uhr
              </div>
              <div>
                Ende: {transformReadableDateTime(phaseEnd)} Uhr
              </div>
            </div>
          </h4>
        </div>
        <div className="p-4 rounded">
          {phaseStatus != "UPCOMING" ? (
            <ProgressBar
              mandatoryQuestionIds={mandatoryQuestionIds}
              numAnswers={numAnswers}
            />
          ) : (
            `Phase startet am ${transformReadableDate(phaseStart)}`
          )}
        </div>
        {phaseStatus != "UPCOMING" ? (
          <button
            onClick={() => handleRedirect()}
            className="apl-button-fixed-short"
          >
            Phase fortsetzen
          </button>
        ) : (
          <button aria-disabled={true} className="apl-button-fixed-short">
            Phase bevorstehend
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseOverview;
