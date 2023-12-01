"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
} from "./answers";

export async function saveDropdownAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "" || answertext == "empty" || answertext == "invalid") {
    await deleteAnswer(questionid, "dropdown_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertDropdownAnswerResponse = await supabase
        .from("dropdown_answer_table")
        .insert({
          answerid: answerid,
          selectedoptions: answertext,
        });
      if (insertDropdownAnswerResponse) {
        console.log(insertDropdownAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateDropdownAnswerResponse = await supabase
        .from("dropdown_answer_table")
        .update({
          selectedoptions: answertext,
        })
        .eq("answerid", answerid);
      if (updateDropdownAnswerResponse) {
        console.log(updateDropdownAnswerResponse);
      }
    }
  }
}

export async function fetchDropdownAnswer(questionid: string) {
  const supabase = await initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid) {
    const { data: dropdownData, error: dropdownError } = await supabase
      .from("dropdown_answer_table")
      .select("selectedoptions")
      .eq("answerid", answerid)
      .single();
    return dropdownData!.selectedoptions;
  }
  return "";
}
