"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveDateTimePickerAnswer(
  pickeddatetime: string,
  questionid: string,
) {
  if (pickeddatetime == "" || pickeddatetime == "Invalid date") {
    await deleteAnswer(questionid, "datetime_picker_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
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

interface DateTimeAnswerResponse {
  answerid: string;
  pickeddatetime: string;
}

const initialstate: DateTimeAnswerResponse = {
  answerid: "",
  pickeddatetime: "",
};

export async function fetchDateTimePickerAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dateTimePickerData, error: dateTimePickerError } = await supabase
    .rpc("fetch_datetime_picker_answer_table", { question_id: questionid, user_id: user?.id })
    .single<DateTimeAnswerResponse>();
  return dateTimePickerData || initialstate;
}
