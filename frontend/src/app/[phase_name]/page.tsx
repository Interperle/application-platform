import Apl_Header from "@/components/header";
import Questionnaire, { DefaultQuestion } from "@/components/questions";
import { Question } from "@/components/questions";
import {
  QuestionType,
  QuestionTypeTable,
} from "@/components/questiontypes/utils/questiontype_selector";
import { fetch_phase_by_name } from "@/utils/fetchPhaseTable";
import { createCurrentTimestamp } from "@/utils/helpers";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

type IdType = {
  questionid: string;
  [key: string]: any;
};

export default async function Page({
  params,
}: {
  params: { phase_name: string };
}) {
  const phaseName = params.phase_name;
  console.log("");
  console.log("Phasename: " + phaseName);
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  async function fetch_question_type_table(questions: DefaultQuestion[]) {
    const result: Record<QuestionType, any> = {
      [QuestionType.ShortText]: {},
      [QuestionType.LongText]: {},
      [QuestionType.NumberPicker]: {},
      [QuestionType.DatetimePicker]: {},
      [QuestionType.DatePicker]: {},
      [QuestionType.ImageUpload]: {},
      [QuestionType.VideoUpload]: {},
      [QuestionType.PDFUpload]: {},
      [QuestionType.MultipleChoice]: {},
      [QuestionType.Dropdown]: {},
    };
    for (const questionType of Object.values(QuestionType)) {
      const tableName =
        QuestionTypeTable[
          `${questionType[0].toUpperCase()}${questionType.slice(
            1,
          )}QuestionTable` as keyof typeof QuestionTypeTable
        ];
      if (!tableName) {
        console.log(
          `Table for question type "${questionType}" is missing. Skipping...`,
        );
        continue;
      }

      const { data: questionTypeData, error: questionTypeError } =
        await supabase
          .from(tableName)
          .select("*")
          .in(
            "questionid",
            questions
              .filter((q) => q.questiontype === questionType)
              .map((q) => q.questionid),
          );

      if (questionTypeError) {
        console.log("QuestionType Error: Return Null");
        console.error(questionTypeError);
        result[questionType] = [{}];
      } else if (questionTypeData) {
        result[questionType] = questionTypeData;
      } else {
        console.log("No data found for question type: " + questionType);
        result[questionType] = [{}];
      }
    }

    return result;
  }

  async function fetchAdditionalParams(
    questiontype: QuestionType,
  ): Promise<Record<string, any>> {
    var table_name = "";
    if (questiontype == QuestionType.MultipleChoice) {
      table_name = "multiple_choice_question_choice_table";
    } else if (questiontype == QuestionType.Dropdown) {
      table_name = "dropdown_question_option_table";
    } else {
      console.error("Not possible for others");
    }

    const { data: paramsData, error } = await supabase
      .from(table_name)
      .select("*");

    if (error) {
      console.error("Error fetching multiple choice choices:", error);
      return {};
    }

    const paramsDict: Record<
      string,
      Array<{
        choiceid?: string;
        choicetext?: string;
        optionid?: string;
        optiontext?: string;
      }>
    > = {};

    paramsData?.forEach((param) => {
      if (!paramsDict[param.questionid]) {
        paramsDict[param.questionid] = [];
      }
      if (questiontype == QuestionType.MultipleChoice) {
        paramsDict[param.questionid].push({
          choiceid: param.choiceid,
          choicetext: param.choicetext,
        });
      } else if (questiontype == QuestionType.Dropdown) {
        paramsDict[param.questionid].push({
          optionid: param.optionid,
          optiontext: param.optiontext,
        });
      }
    });
    return paramsDict;
  }

  function append_params(
    question_types_questions: any,
    question: DefaultQuestion,
    choicesData: Record<string, string[]>,
    optionsData: Record<string, string[]>,
  ) {
    const question_type_questions =
      question_types_questions[question.questiontype];
    const question_type_params =
      question_type_questions!.find(
        (params: IdType) => params.questionid === question.questionid,
      ) || {};
    console.log("Questiontext: " + question.questiontext);
    const { questionid, ...rest } = question_type_params;
    if (question.questiontype === QuestionType.MultipleChoice) {
      rest["choices"] = choicesData[question.questionid];
    } else if (question.questiontype === QuestionType.Dropdown) {
      rest["options"] = optionsData[question.questionid];
    }
    return {
      ...question,
      params: rest,
    };
  }

  async function fetch_question_table(phaseId: string): Promise<Question[]> {
    const { data: questionData, error: errorData } = await supabase
      .from("question_table")
      .select("*")
      .eq("phaseid", phaseId);
    //TODO
    if (errorData) {
      console.log("Error:" && errorData);
      redirect("/404", RedirectType.replace);
    }
    //TODO
    if (!questionData) {
      console.log("No Data");
      redirect("/404", RedirectType.replace);
    }
    // TODO also fetch all other question types
    const questionTypesData = await fetch_question_type_table(questionData);
    const choicesData = await fetchAdditionalParams(
      QuestionType.MultipleChoice,
    );
    const optionsData = await fetchAdditionalParams(QuestionType.Dropdown);
    const combinedQuestions = questionData.map(async (question) => {
      return await append_params(
        questionTypesData,
        question,
        choicesData,
        optionsData,
      );
    });

    return await Promise.all(combinedQuestions);
  }

  const phaseData = await fetch_phase_by_name(phaseName);

  const currentDate = new Date(createCurrentTimestamp());
  const startDate = new Date(phaseData.startdate);
  const endDate = new Date(phaseData.enddate);

  if (currentDate < startDate) {
    console.log("Phase didn't start yet");
    return redirect("/", RedirectType.replace);
  }

  const isEditable = ((currentDate >= startDate) && (currentDate <= endDate));
  const phase_questions = await fetch_question_table(phaseData.phaseid);

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
            <Questionnaire questions={phase_questions} />
          </div>
        </div>
      </div>
    </span>
  );
}
