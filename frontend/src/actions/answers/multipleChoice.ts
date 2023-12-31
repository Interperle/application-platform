"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveMultipleChoiceAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid, "multiple_choice_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertMultipleChoiceAnswerResponse = await supabase
        .from("multiple_choice_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertMultipleChoiceAnswerResponse) {
        console.log(insertMultipleChoiceAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateMultipleChoiceAnswerResponse = await supabase
        .from("multiple_choice_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateMultipleChoiceAnswerResponse) {
        console.log(updateMultipleChoiceAnswerResponse);
      }
    }
  }
}

interface MultipleChoiceAnswerResponse {
  answerid: string;
  selectedchoice: string;
}

const initialstate: MultipleChoiceAnswerResponse = {
  answerid: "",
  selectedchoice: "",
};

export async function fetchMultipleChoiceAnswer(
  questionid: string,
): Promise<MultipleChoiceAnswerResponse> {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: multipleChoiceData, error: multipleChoiceError } =
    await supabase
      .rpc("fetch_multiple_choice_answer_table", {
        question_id: questionid,
        user_id: user?.id,
      })
      .single<MultipleChoiceAnswerResponse>();
  if (multipleChoiceError) {
    if (multipleChoiceError.code == "PGRST116") {
      return initialstate;
    }
    console.log("multipleChoiceError:");
    console.log(multipleChoiceError);
  }
  return multipleChoiceData || initialstate;
}
