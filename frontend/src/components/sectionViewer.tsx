"use client";
import { useState } from "react";

import { Answer } from "@/actions/answers/answers";
import { PhaseData, SectionData } from "@/store/slices/phaseSlice";

import Questionnaire, { Question } from "./questions";

export type SectionQuestionsMap = {
  [key: string]: Question[];
};

export function SectionView({
  phaseData,
  mapQuestions,
  phaseAnswers,
  phaseSections,
  iseditable,
}: {
  phaseData: PhaseData;
  mapQuestions: SectionQuestionsMap;
  phaseAnswers: Answer[];
  phaseSections: SectionData[];
  iseditable: boolean;
}) {
  const sortedSections = phaseSections.sort(
    (a, b) => a.sectionorder - b.sectionorder,
  );
  const [selectedSection, setSelectedSection] = useState(() => {
    return sortedSections.length > 0 ? sortedSections[0].sectionid : "";
  });
  const selectedSectionDescription =
    sortedSections.find((section) => section.sectionid === selectedSection)
      ?.sectiondescription || "";

  const moveToNextSection = () => {
    const currentIndex = sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex < sortedSections.length) {
      setSelectedSection(sortedSections[nextIndex].sectionid);
    }
  };

  const moveToPreviousSection = () => {
    const currentIndex = sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    );
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedSection(sortedSections[prevIndex].sectionid);
    }
  };

  const isNotFirstSection =
    sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    ) > 0;
  const isNotLastSection =
    sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    ) <
    sortedSections.length - 1;

  return (
    <div className="text-sm font-medium text-gray-500 border-gray-200 mt-7 mb-7">
      <ul className="flex flex-wrap -mb-px">
        {sortedSections.map((phaseSection) => {
          return (
            <button
              type="button"
              key={phaseSection.sectionid}
              className={`flex-1 py-2 px-4 ${
                selectedSection === phaseSection.sectionid
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedSection(phaseSection.sectionid)}
            >
              {phaseSection.sectionname}
            </button>
          );
        })}
      </ul>
      {sortedSections.map((phaseSection) => {
        const isVisible = selectedSection === phaseSection.sectionid;
        return (
          <div
            key={phaseSection.sectionid}
            className={`p-4 mt-4 ${isVisible ? 'visible' : 'hidden'}`}
          >
            {isVisible ? (
              <>
                <div>{phaseSection.sectiondescription}</div>
                <Questionnaire
                  phaseData={phaseData}
                  phaseQuestions={mapQuestions[phaseSection.sectionid]}
                  phaseAnswers={phaseAnswers}
                  iseditable={iseditable}
                  selectedSection={selectedSection}
                />
                <div className="flex justify-between mt-4">
                  {isNotFirstSection ? (
                    <button
                      type="button"
                      onClick={moveToPreviousSection}
                      className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded"
                    >
                      Zurück
                    </button>
                  ) : (
                    <div className="py-2 px-4"></div>
                  )}
                  {isNotLastSection ? (
                    <button
                      type="button"
                      onClick={moveToNextSection}
                      className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded"
                    >
                      Weiter
                    </button>
                  ) : (
                    <div className="py-2 px-4"></div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
