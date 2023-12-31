import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import { fetch_all_phases } from "@/actions/phase";
import ApplicationOverview from "@/components/applicationOverview";
import Easteregg from "@/components/easteregg";
import Apl_Header from "@/components/layout/header";
import { Question } from "@/components/questions";
import Logger from "@/logger/logger";
import { cached_fetch_phase_questions } from "@/utils/cached";
import getOverviewPageText from "@/utils/getMarkdownText";
import "github-markdown-css/github-markdown-light.css";

export default async function Home() {
  const log = new Logger("Overview Page");
  const contentHtml = await getOverviewPageText();
  const phasesData = await fetch_all_phases();
  const phasesQuestions: Record<string, Question[]> = {};
  for (const phase of phasesData) {
    phasesQuestions[phase.phaseid] = await cached_fetch_phase_questions(
      phase.phaseid,
    );
  }
  const phaseAnswers = await fetchAllAnswersOfApplication();

  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      <span className="hidden">
        <Easteregg person="emma" />
      </span>
      <ApplicationOverview
        phasesData={phasesData}
        phasesQuestions={phasesQuestions}
        phaseAnswers={phaseAnswers}
      />
    </>
  );
}
