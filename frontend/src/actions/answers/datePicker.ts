"use server";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
  setupSupabaseClient,
} from "./answers";

export async function saveDatePickerAnswer(
  pickeddate: string,
  questionid: string,
) {
  console.log("%"+pickeddate+"%");
  if (pickeddate == "") {
    await deleteAnswer(questionid, "date_picker_answer_table");
    return;
  } else {
    
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertDatePickerAnswerResponse = await supabase
        .from("date_picker_answer_table")
        .insert({
          answerid: answerid,
          pickeddate: new Date(pickeddate),
        });
      if (insertDatePickerAnswerResponse) {
        console.log(insertDatePickerAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateDatePickerAnswerResponse = await supabase
        .from("date_picker_answer_table")
        .update({
          pickeddate: new Date(pickeddate),
        })
        .eq("answerid", answerid);
      if (updateDatePickerAnswerResponse) {
        console.log(updateDatePickerAnswerResponse);
      }
    }
  }
}

export async function fetchDatePickerAnswer(questionid: string) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid) {
    const { data: datePickerData, error: datePickerError } = await supabase
      .from("date_picker_answer_table")
      .select("pickeddate")
      .eq("answerid", answerid)
      .single();
    return datePickerData!.pickeddate;
  }
  return "";
}
