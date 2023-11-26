import {
  cached_fetch_phase_by_name,
  cached_fetch_phase_questions,
} from "@/utils/cached";
import Apl_Header from "@/components/header";
import Questionnaire from "@/components/questions";
import { createCurrentTimestamp } from "@/utils/helpers";
import { RedirectType, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { phase_name: string };
}) {
  const phaseName = params.phase_name;
  console.log("");
  console.log("Phasename: " + phaseName);

  const phaseData = await cached_fetch_phase_by_name(phaseName);
  const currentDate = new Date(createCurrentTimestamp());
  const startDate = new Date(phaseData.startdate);
  const endDate = new Date(phaseData.enddate);

  if (currentDate < startDate) {
    console.log("Phase didn't start yet");
    return redirect("/", RedirectType.replace);
  }

  const isEditable = currentDate >= startDate && currentDate <= endDate;
  const phase_questions = await cached_fetch_phase_questions(phaseData.phaseid);

  console.log("Render Questionnaire");
  return (
    <span className="w-full">
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <div className="">
          <h2 className="p-4 rounded text-secondary">
            <b>Bewerbungs-Phase: {phaseName}</b>
          </h2>
          {!isEditable && (
            <div>
              <strong>
                Die Phase ist bereits um, du kannst deine Eingaben nur noch
                einlesen!
              </strong>
            </div>
          )}
          <div className="space-y-4 max-w-screen-xl">
            <Questionnaire
              phaseData={phaseData}
              phaseQuestions={phase_questions}
            />
          </div>
        </div>
      </div>
    </span>
  );
}
