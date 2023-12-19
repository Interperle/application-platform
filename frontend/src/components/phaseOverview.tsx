"use client";

import React from "react";

import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import {
  calcPhaseStatus,
  transformReadableDate,
  transformReadableDateTime,
} from "@/utils/helpers";

import { ProgressBar } from "./progressbar";

const PhaseOverview: React.FC<{
  key: string;
  phaseName: string;
  phaseLabel: string;
  phaseOrder: number;
  phaseStart: string;
  phaseEnd: string;
  mandatoryQuestionIds: string[];
  numAnswers: number;
}> = ({
  key,
  phaseName,
  phaseLabel,
  phaseOrder,
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
  const statusIcon = () => {
    switch (phaseStatus) {
      case "UPCOMING":
        return <CalendarDaysIcon className="h-6 w-6 text-secondary" />;
      case "ENDED":
        return <DocumentCheckIcon className="h-6 w-6 text-secondary" />; // Replace with your actual check icon component
      default:
        return <PencilSquareIcon className="h-6 w-6 text-secondary" />; // Replace with your actual pen icon component
    }
  };

  return (
    <div
      key={key}
      className={`w-full max-w-screen-xl mx-auto p-8 rounded-lg shadow-md  ${
        phaseStatus === "UPCOMING" ? "bg-[#B8B8B8] opacity-30" : "bg-white"
      }`}
    >
      <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 md:grid-cols-1 md:grid-rows-2">
          <div className="flex items-center">
            {statusIcon()}
            <h2 className="rounded font-bold ml-2">
              Phase {phaseOrder + 1}: {phaseLabel}
            </h2>
          </div>
          <h4 className="rounded">
            <div className="flex-row-2 gap-x-2">
              <div>Beginn: {transformReadableDateTime(phaseStart)} Uhr</div>
              <div>Ende: {transformReadableDateTime(phaseEnd)} Uhr</div>
            </div>
          </h4>
        </div>
        <div className="p-4 rounded">
          {phaseStatus != "UPCOMING" ? (
            <ProgressBar
              progressbarId={`${key}-overview`}
              mandatoryQuestionIds={mandatoryQuestionIds}
              numAnswers={numAnswers}
              endDate={phaseEnd}
            />
          ) : (
            `Phase startet am ${transformReadableDate(phaseStart)}`
          )}
        </div>
        {phaseStatus == "UPCOMING" ? (
          <button type="button" className="rounded px-1 py-2 text-[#B8B8B8] max-h-14 bg-[#4D4D4D] cursor-default">
            Phase bevorstehend
          </button>
        ) : phaseStatus == "ENDED" ? (
          <button
            type="button"
            aria-disabled={true}
            className="apl-button-fixed-short"
            onClick={() => handleRedirect()}
          >
            Phase einsehen
          </button>
        ) : (
          <button
            type="button"
            aria-disabled={true}
            className="apl-button-fixed-short"
            onClick={() => handleRedirect()}
          >
            Phase bearbeiten
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseOverview;
