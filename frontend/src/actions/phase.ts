"use server";

import { DefaultQuestion, Question } from "@/components/questions";
import {
  QuestionType,
  QuestionTypeTable,
} from "@/components/questiontypes/utils/questiontype_selector";
import { PhaseData } from "@/store/slices/phaseSlice";
import { createCurrentTimestamp } from "@/utils/helpers";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { cache } from "react";

type IdType = {
  questionid: string;
  [key: string]: any;
};

function get_supabase() {
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
  return supabase;
}

export async function fetch_question_type_table(questions: DefaultQuestion[]) {
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
      await get_supabase()
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

export async function fetchAdditionalParams(
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

  const { data: paramsData, error } = await get_supabase()
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

async function append_params(
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

export async function fetch_question_table(
  phaseId: string,
): Promise<Question[]> {
  const { data: questionData, error: errorData } = await get_supabase()
    .from("question_table")
    .select("*")
    .eq("phaseid", phaseId);

  if (errorData) {
    console.log("Error:" && errorData);
    redirect("/404", RedirectType.replace);
  }

  if (!questionData) {
    console.log("No Data");
    redirect("/404", RedirectType.replace);
  }

  const questionTypesData = await fetch_question_type_table(questionData);
  const choicesData = await fetchAdditionalParams(QuestionType.MultipleChoice);
  const optionsData = await fetchAdditionalParams(QuestionType.Dropdown);
  const combinedQuestions = await questionData.map(
    async (question: DefaultQuestion) => {
      return await append_params(
        questionTypesData,
        question,
        choicesData,
        optionsData,
      );
    },
  );

  return await Promise.all(combinedQuestions);
}

export async function fetch_phase_by_name(
  phaseName: string,
): Promise<PhaseData> {
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
  const { data: phaseData, error: phaseError } = await supabase
    .from("phase_table")
    .select("*")
    .eq("phasename", phaseName)
    .single();
  // Redirection if error
  if (phaseError) {
    console.log("Error: " + phaseError + " -> Redirect");
    redirect("/", RedirectType.replace);
  }
  // Redirection if no phaseName
  if (!phaseData) {
    console.log("No data " + phaseData + " -> Redirect");
    redirect("/", RedirectType.replace);
  }

  return phaseData;
}

export async function fetch_all_phases(): Promise<PhaseData[]> {
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

  const { data: phasesData, error: phasesError } = await supabase
    .from("phase_table")
    .select("*");
  if (phasesError) {
    console.log("Error: " + phasesError);
  }
  if (!phasesData) {
    console.log("No data " + phasesData);
  }
  return phasesData || [];
}

type Phase = {
  phaseid: string;
  phasename: string;
  phaseorder: number;
  startdate: string;
  enddate: string;
};

export async function extractCurrentPhase(currentTime: Date): Promise<Phase> {
  const phasesData = await fetch_all_phases();
  const sortedPhases = phasesData!.sort((a, b) => a.phaseorder - b.phaseorder);

  var previous_phase: Phase;
  previous_phase = {
    phaseid: "",
    phasename: "",
    phaseorder: -1,
    startdate: "",
    enddate: "",
  };
  for (const phase of sortedPhases) {
    const startDate = new Date(phase.startdate);
    const endDate = new Date(phase.enddate);

    if (currentTime < startDate) {
      return previous_phase;
    } else if (currentTime >= startDate && currentTime <= endDate) {
      return phase;
    }
    previous_phase = phase;
  }
  return previous_phase;
}

export async function fetch_answer_table(
  questionIds: string[],
): Promise<number> {
  const { data: answerData, error: answerError } = await get_supabase()
    .from("answer_table")
    .select("answerid")
    .in("questionid", questionIds);

  if (answerError) {
    console.log("Error:" && answerError);
  }

  return answerData ? answerData.length : 0;
}

export async function fetch_all_questions(): Promise<DefaultQuestion[]> {
  const { data: questionData, error: errorData } = await get_supabase()
    .from("question_table")
    .select("*");

  if (errorData) {
    console.log("Error:" && errorData);
  }

  if (!questionData) {
    console.log("No Data");
    return [];
  }

  return questionData as DefaultQuestion[];
}
