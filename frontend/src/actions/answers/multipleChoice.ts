"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import {
  deleteAnswer,
  saveAnswer,
} from "./answers";

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

export async function fetchMultipleChoiceAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: multipleChoiceData, error: multipleChoiceError } =
    await supabase
      .from("multiple_choice_answer_table")
      .select("selectedchoice")
      .eq("answerid", answerid)
      .single();
  return multipleChoiceData!.selectedchoice;
}
