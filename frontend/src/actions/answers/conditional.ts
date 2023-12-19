"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveConditionalAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid, "conditional_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertConditionalAnswerResponse = await supabase
        .from("conditional_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertConditionalAnswerResponse) {
        console.log(insertConditionalAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateConditionalAnswerResponse = await supabase
        .from("conditional_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateConditionalAnswerResponse) {
        console.log(updateConditionalAnswerResponse);
      }
    }
  }
}

export async function fetchConditionalAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: conditionalData, error: conditionalError } =
    await supabase
      .from("conditional_answer_table")
      .select("selectedchoice")
      .eq("answerid", answerid)
      .single();
  return conditionalData!.selectedchoice;
}
