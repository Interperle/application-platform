"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveDatePickerAnswer(
  pickeddate: string,
  questionid: string,
) {
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

interface DateAnswerResponse {
  answerid: string;
  pickeddate: string;
}

const initialstate: DateAnswerResponse = {
  answerid: "",
  pickeddate: "",
};

export async function fetchDatePickerAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: datePickerData, error: datePickerError } = await supabase
    .rpc("fetch_date_picker_answer_table", { question_id: questionid, user_id: user?.id })
    .single<DateAnswerResponse>();
  return datePickerData || initialstate;
}
