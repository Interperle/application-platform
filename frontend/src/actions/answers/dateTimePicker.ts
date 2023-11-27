"use server";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
  setupSupabaseClient,
} from "./answers";

export async function saveDateTimePickerAnswer(
  pickeddatetime: string,
  questionid: string,
) {
  if (pickeddatetime == "" || pickeddatetime == "Invalid date") {
    await deleteAnswer(questionid, "datetime_picker_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    console.log(answerid);
    if (reqtype == "created") {
      const insertDateTimePickerAnswerResponse = await supabase
        .from("datetime_picker_answer_table")
        .insert({
          answerid: answerid,
          pickeddatetime: new Date(pickeddatetime),
        });
      if (insertDateTimePickerAnswerResponse) {
        console.log(insertDateTimePickerAnswerResponse);
      }
    } else if (reqtype == "update") {
      const updateDateTimePickerAnswerResponse = await supabase
        .from("datetime_picker_answer_table")
        .update({
          pickeddatetime: new Date(pickeddatetime),
        })
        .eq("answerid", answerid);
      if (updateDateTimePickerAnswerResponse) {
        console.log(updateDateTimePickerAnswerResponse);
      }
    }
  }
}

export async function fetchDateTimePickerAnswer(questionid: string) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid) {
    const { data: datetimePickerData, error: datetimePickerError } =
      await supabase
        .from("datetime_picker_answer_table")
        .select("pickeddatetime")
        .eq("answerid", answerid)
        .single();
    return datetimePickerData!.pickeddatetime;
  }
  return "";
}
