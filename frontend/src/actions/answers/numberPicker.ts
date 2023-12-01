"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
} from "./answers";

export async function saveNumberPickerAnswer(
  pickednumber: string,
  questionid: string,
) {
  console.log(pickednumber);
  if (pickednumber == "") {
    await deleteAnswer(questionid, "number_picker_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertNumberPickerAnswerResponse = await supabase
        .from("number_picker_answer_table")
        .insert({
          answerid: answerid,
          pickednumber: Number(pickednumber),
        });
      if (insertNumberPickerAnswerResponse) {
        console.log(insertNumberPickerAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateNumberPickerAnswerResponse = await supabase
        .from("number_picker_answer_table")
        .update({
          pickednumber: pickednumber,
        })
        .eq("answerid", answerid);
      if (updateNumberPickerAnswerResponse) {
        console.log(updateNumberPickerAnswerResponse);
      }
    }
  }
}

export async function fetchNumberPickerAnswer(questionid: string) {
  const supabase = await initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid) {
    const { data: numberPickerData, error: numberPickerError } = await supabase
      .from("number_picker_answer_table")
      .select("pickednumber")
      .eq("answerid", answerid)
      .single();
    return numberPickerData!.pickednumber;
  }
  return "";
}
