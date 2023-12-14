"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

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

export async function fetchDropdownAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: dropdownData, error: dropdownError } = await supabase
    .from("dropdown_answer_table")
    .select("selectedoptions")
    .eq("answerid", answerid)
    .single();
  return dropdownData!.selectedoptions;
}
