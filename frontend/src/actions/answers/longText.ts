"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import {
  deleteAnswer,
  saveAnswer,
} from "./answers";

export async function saveLongTextAnswer(
  answertext: string,
  questionid: string,
) {
  console.log(answertext);
  if (answertext == "") {
    await deleteAnswer(questionid, "long_text_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertLongTextAnswerResponse = await supabase
        .from("long_text_answer_table")
        .insert({
          answerid: answerid,
          answertext: answertext,
        });
      if (insertLongTextAnswerResponse) {
        console.log(insertLongTextAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateLongTextAnswerResponse = await supabase
        .from("long_text_answer_table")
        .update({
          answertext: answertext,
        })
        .eq("answerid", answerid);
      if (updateLongTextAnswerResponse) {
        console.log(updateLongTextAnswerResponse);
      }
    }
  }
}

export async function fetchLongTextAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: longTextData, error: longTextError } = await supabase
    .from("long_text_answer_table")
    .select("answertext")
    .eq("answerid", answerid)
    .single();
  return longTextData!.answertext;
}
