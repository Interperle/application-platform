import Logger from "@/logger/logger";
import Apl_Header from "@/components/header";
import getOverviewPageText from "@/utils/getMarkdownText";
import {
  fetch_all_phases,
  fetch_all_questions,
  fetch_answer_table,
} from "@/actions/phase";
import PhaseOverview from "@/components/phaseOverview";
import "github-markdown-css/github-markdown-light.css";

export default async function Home() {
  const log = new Logger("Overview Page");
  const contentHtml = await getOverviewPageText();
  const phasesData = await fetch_all_phases();
  const phase_questions = await fetch_all_questions();

  const mandatoryQuestions = phase_questions.filter((q) => q.mandatory);

  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      {phasesData
        .sort((a, b) => a.phaseorder - b.phaseorder)
        .map(async (phase) => {
          const mandatoryPhaseQuestionIds = mandatoryQuestions
            .filter((q) => q.phaseid == phase.phaseid)
            .map((q) => q.questionid);
          const alreadyAnsweredPhaseQuestions = await fetch_answer_table(
            mandatoryPhaseQuestionIds,
          );
          return (
            <PhaseOverview
              key={phase.phaseid}
              phaseName={phase.phasename}
              phaseLabel={phase.phaselabel}
              phaseOrder={phase.phaseorder}
              phaseStart={phase.startdate}
              phaseEnd={phase.enddate}
              mandatoryQuestionIds={mandatoryPhaseQuestionIds}
              numAnswers={alreadyAnsweredPhaseQuestions}
            />
          );
        })}
    </>
  );
}
