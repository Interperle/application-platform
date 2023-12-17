"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveCheckBoxAnswer(
  checked: boolean,
  questionid: string,
) {
  if (!checked) {
    await deleteAnswer(questionid, "checkbox_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertCheckBoxAnswerResponse = await supabase
        .from("checkbox_answer_table")
        .insert({
          answerid: answerid,
          checked: checked,
        });
      if (insertCheckBoxAnswerResponse) {
        console.log(insertCheckBoxAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateMultipleChoiceAnswerResponse = await supabase
        .from("checkbox_answer_table")
        .update({
          checked: checked,
        })
        .eq("answerid", answerid);
      if (updateMultipleChoiceAnswerResponse) {
        console.log(updateMultipleChoiceAnswerResponse);
      }
    }
  }
}

export async function fetchCheckBoxAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  const { data: multipleChoiceData, error: multipleChoiceError } =
  await supabase
    .from("checkbox_answer_table")
    .select("checked")
    .eq("answerid", answerid)
    .single();
  return multipleChoiceData!.checked || false;
}
