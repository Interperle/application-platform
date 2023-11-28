"use client";

import { transformReadableDate } from "@/utils/helpers";
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

  return (
    <div
      key={key}
      className="w-full max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-rows-2">
          <h2 className="rounded font-bold">{phaseName}</h2>
          <h4 className="rounded">
            {transformReadableDate(phaseStart)} -{" "}
            {transformReadableDate(phaseEnd)}
          </h4>
        </div>
        <div className="p-4 rounded">
          <ProgressBar
            mandatoryQuestionIds={mandatoryQuestionIds}
            numAnswers={numAnswers}
          />
        </div>
        <button
          onClick={() => handleRedirect()}
          className="apl-button-fixed-short"
        >
          Phase fortsetzen
        </button>
      </div>
    </div>
  );
};

export default PhaseOverview;
