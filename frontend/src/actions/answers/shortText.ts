"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import {
  deleteAnswer,
  saveAnswer,
} from "./answers";

export async function saveShortTextAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid, "short_text_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertShortTextAnswerResponse = await supabase
        .from("short_text_answer_table")
        .insert({
          answerid: answerid,
          answertext: answertext,
        });
      if (insertShortTextAnswerResponse) {
        console.log(insertShortTextAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateShortTextAnswerResponse = await supabase
        .from("short_text_answer_table")
        .update({
          answertext: answertext,
        })
        .eq("answerid", answerid);
      if (updateShortTextAnswerResponse) {
        console.log(updateShortTextAnswerResponse);
      }
    }
  }
}

export async function fetchShortTextAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: shortTextData, error: shortTextError } = await supabase
    .from("short_text_answer_table")
    .select("answertext")
    .eq("answerid", answerid)
    .single();
  return shortTextData!.answertext;
}
