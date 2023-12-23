"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveCheckBoxAnswer(checked: boolean, questionid: string) {
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
      const updateCheckboxAnswerResponse = await supabase
        .from("checkbox_answer_table")
        .update({
          checked: checked,
        })
        .eq("answerid", answerid);
      if (updateCheckboxAnswerResponse) {
        console.log(updateCheckboxAnswerResponse);
      }
    }
  }
}

interface LongTextAnswerResponse {
  answerid: string;
  checked: boolean;
}

const initialstate: LongTextAnswerResponse = {
  answerid: "",
  checked: false,
};

export async function fetchCheckBoxAnswer(
  questionid: string,
): Promise<LongTextAnswerResponse> {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: checkBoxData, error: checkBoxError } = await supabase
    .rpc("fetch_checkbox_answer_table", {
      question_id: questionid,
      user_id: user?.id,
    })
    .single<LongTextAnswerResponse>();
  if (checkBoxError) {
    console.log("checkBoxError:");
    console.log(checkBoxError);
  }
  return checkBoxData || initialstate;
}
