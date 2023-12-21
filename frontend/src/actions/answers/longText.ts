"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveLongTextAnswer(
  answertext: string,
  questionid: string,
) {
  console.log(answertext);
  if (answertext == "") {
    await deleteAnswer(questionid, "long_text_answer_table");
    return "";
  }
  const { supabase, answerid, reqtype } = await saveAnswer(questionid);
  console.log(answerid + "##" + reqtype);
  if (reqtype == "created") {
    const insertLongTextAnswerResponse = await supabase
      .from("long_text_answer_table")
      .insert({
        answerid: answerid,
        answertext: answertext,
      });
    if (insertLongTextAnswerResponse) {
      console.log("Inserted Long Text");
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
      console.log("Updated Long Text");
      console.log(updateLongTextAnswerResponse);
    }
  }
  return answerid;
}

interface FetchAnswerTextParams {
  question_id: string;
  user_id: string;
}

interface LongTextAnswerResponse {
  answerid: string;
  answertext: string;
}

const initialstate: LongTextAnswerResponse = {
  answerid: "",
  answertext: "",
};

export async function fetchLongTextAnswer(questionid: string): Promise<LongTextAnswerResponse> {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: longTextData, error: longTextError } = await supabase
    .rpc("fetch_long_text_answer_table", { question_id: questionid, user_id: user?.id })
    .single<LongTextAnswerResponse>();
  return longTextData || initialstate;
}
