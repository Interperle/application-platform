import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import {
  fetch_all_phases,
  fetch_all_questions,
  fetch_conditional_questionid_mapping,
} from "@/actions/phase";
import Apl_Header from "@/components/header";
import PhaseOverview from "@/components/phaseOverview";
import { Question } from "@/components/questions";
import Logger from "@/logger/logger";
import getOverviewPageText from "@/utils/getMarkdownText";
import "github-markdown-css/github-markdown-light.css";

export default async function Home() {
  const log = new Logger("Overview Page");
  const contentHtml = await getOverviewPageText();
  const phasesData = await fetch_all_phases();
  const phase_questions = await fetch_all_questions();
  const ConditionalChoiceIdToQuestionId =
    await fetch_conditional_questionid_mapping();

  const phase_answers = await fetchAllAnswersOfApplication();
  const mandatoryQuestions = phase_questions.filter(
    (q) => q.mandatory && q.depends_on == null,
  );
  const dependingOn: Record<string, string[]> = phase_questions
    .filter((q) => q.mandatory && q.depends_on != null)
    .reduce(
      (acc: Record<string, string[]>, question: Question) => {
        if (!question.mandatory) {
          return acc;
        }
        const dependsOn = ConditionalChoiceIdToQuestionId[
          question!.depends_on!
        ] as string;
        if (!(dependsOn in acc)) {
          acc[dependsOn] = [question.questionid];
        } else {
          acc[dependsOn].push(question.questionid);
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );
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
              phaseAnswers={phase_answers}
            />
          );
        })}
    </>
  );
}
