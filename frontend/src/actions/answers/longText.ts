"use server";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
  setupSupabaseClient,
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

export async function fetchLongTextAnswer(questionid: string) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid) {
    const { data: longTextData, error: longTextError } = await supabase
      .from("long_text_answer_table")
      .select("answertext")
      .eq("answerid", answerid)
      .single();
    return longTextData!.answertext;
  }
  return "";
}
