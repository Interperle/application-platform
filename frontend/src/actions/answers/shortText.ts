"use server";

import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
  setupSupabaseClient,
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

export async function fetchShortTextAnswer(questionid: string) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);

  if (answerid) {
    const { data: shortTextData, error: shortTextError } = await supabase
      .from("short_text_answer_table")
      .select("answertext")
      .eq("answerid", answerid)
      .single();
    return shortTextData!.answertext;
  }
  return "";
}
