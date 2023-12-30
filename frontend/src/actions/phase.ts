"use server";

import { RedirectType, redirect } from "next/navigation";

import { DefaultQuestion, Question } from "@/components/questions";
import {
  QuestionType,
  QuestionTypeTable,
} from "@/components/questiontypes/utils/questiontype_selector";
import { PhaseData, SectionData } from "@/store/slices/phaseSlice";
import { createCurrentTimestamp, setToPrefferedTimeZone } from "@/utils/helpers";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import {
  getApplicationIdOfCurrentUser,
  getCurrentUser,
} from "./answers/answers";

type IdType = {
  questionid: string;
  [key: string]: any;
};

export async function fetch_question_type_table(questions: DefaultQuestion[]) {
  const result: Record<QuestionType, any> = {
    [QuestionType.ShortText]: [{}],
    [QuestionType.LongText]: [{}],
    [QuestionType.NumberPicker]: [{}],
    [QuestionType.DatetimePicker]: [{}],
    [QuestionType.DatePicker]: [{}],
    [QuestionType.ImageUpload]: [{}],
    [QuestionType.VideoUpload]: [{}],
    [QuestionType.PDFUpload]: [{}],
    [QuestionType.MultipleChoice]: [{}],
    [QuestionType.Dropdown]: [{}],
    [QuestionType.CheckBox]: [{}],
    [QuestionType.Conditional]: [{}],
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
      await initSupabaseActions()
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
  } else if (questiontype == QuestionType.Conditional) {
    table_name = "conditional_question_choice_table";
  } else {
    console.error("Not possible for others");
  }

  const { data: paramsData, error } = await initSupabaseActions()
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
      choicevalue?: string;
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
    } else if (questiontype == QuestionType.Conditional) {
      paramsDict[param.questionid].push({
        choiceid: param.choiceid,
        choicevalue: param.choicevalue,
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
  conditionalChoicesData: Record<string, string[]>,
) {
  const question_type_questions =
    question_types_questions[question.questiontype];
  const question_type_params =
    question_type_questions!.find(
      (params: IdType) => params.questionid === question.questionid,
    ) || {};
  const { questionid, ...rest } = question_type_params;
  if (question.questiontype === QuestionType.MultipleChoice) {
    rest["choices"] = choicesData[question.questionid];
  } else if (question.questiontype === QuestionType.Dropdown) {
    rest["options"] = optionsData[question.questionid];
  } else if (question.questiontype === QuestionType.Conditional) {
    rest["choices"] = conditionalChoicesData[question.questionid];
  }
  return {
    ...question,
    params: rest,
  };
}

export async function fetch_question_table(
  phaseId: string,
): Promise<Question[]> {
  const { data: questionData, error: errorData } = await initSupabaseActions()
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

  const conditionalChoicesData = await fetchAdditionalParams(
    QuestionType.Conditional,
  );
  const combinedQuestions = await questionData.map(
    async (question: DefaultQuestion) => {
      return await append_params(
        questionTypesData,
        question,
        choicesData,
        optionsData,
        conditionalChoicesData,
      );
    },
  );
  const awaitedQuestions = await Promise.all(combinedQuestions);
  const standaloneQuestions = awaitedQuestions.filter(
    (q: Question) => q.depends_on == null,
  );
  const dependingQuestions = awaitedQuestions.filter(
    (q: Question) => q.depends_on != null,
  );
  const finishedQuestions = standaloneQuestions.map((question: Question) => {
    if (question.questiontype != QuestionType.Conditional) {
      return question;
    }
    question.params.choices.map((choice: Record<string, any>) => {
      choice["questions"] = dependingQuestions.filter(
        (q: Question) => q.depends_on == choice.choiceid,
      );
      return choice;
    });
    return question;
  });

  return finishedQuestions as Question[];
}

export async function fetch_conditional_questionid_mapping() {
  const { data: conditionalData, error: conditionalError } =
    await initSupabaseActions()
      .from("conditional_question_choice_table")
      .select("*");
  if (conditionalError) {
    console.log(JSON.stringify(conditionalError));
    return {} as Record<string, string[]>;
  }
  return conditionalData?.reduce(
    (
      acc: Record<string, string>,
      question: { choiceid: string; questionid: string; choicevalue: string },
    ) => {
      acc[question.choiceid] = question.questionid;
      return acc;
    },
    {} as Record<string, string[]>,
  );
}

export async function fetch_phase_by_name(
  phaseName: string,
): Promise<PhaseData> {
  const supabase = initSupabaseActions();
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
  phaseData.startdate = setToPrefferedTimeZone(phaseData.startdate)
  phaseData.enddate = setToPrefferedTimeZone(phaseData.enddate)
  return phaseData;
}

export async function fetch_all_phases(): Promise<PhaseData[]> {
  const supabase = initSupabaseActions();

  const { data: phasesData, error: phasesError } = await supabase
    .from("phase_table")
    .select("*");
  if (phasesError) {
    console.log("Error: " + JSON.stringify(phasesError, null, 2));
  }
  if (!phasesData) {
    console.log("No data: " + JSON.stringify(phasesData, null, 2));
  }

  return phasesData?.map(phase => ({
    ...phase,
    startdate: setToPrefferedTimeZone(phase.startdate),
    enddate: setToPrefferedTimeZone(phase.enddate),
  })) || [];
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
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);

  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .in("questionid", questionIds)
    .eq("applicationid", applicationid);

  if (answerError) {
    console.log("Error:" + answerError);
  }

  return answerData ? answerData.length : 0;
}

export async function fetch_first_phase_over(): Promise<boolean> {
  const supabase = initSupabaseActions();
  const { data: phaseData, error: phaseError } = await supabase
    .from("phase_table")
    .select("enddate")
    .eq("phaseorder", 0)
    .single();

  if (phaseError) {
    console.log(
      "Error Fetch First Phase: " +
        JSON.stringify(phaseError, null, 2) +
        " -> Redirect",
    );
    return true;
  }

  if (!phaseData) {
    console.log(
      "No Data: " + JSON.stringify(phaseData, null, 2) + " -> Redirect",
    );
    return true;
  }
  const currentDate = new Date(createCurrentTimestamp());
  const endDate = new Date(setToPrefferedTimeZone(phaseData!.enddate));
  return currentDate < endDate;
}

export async function fetch_sections_by_phase(
  phaseId: string,
): Promise<SectionData[]> {
  const supabase = initSupabaseActions();
  const { data: sectionsData, error: sectionsError } = await supabase
    .from("sections_table")
    .select("*")
    .eq("phaseid", phaseId);
  if (sectionsError) {
    console.log("Error: " + JSON.stringify(sectionsError));
  }
  if (!sectionsData) {
    console.log("No data " + JSON.stringify(sectionsData));
  }
  return sectionsData as SectionData[];
}
