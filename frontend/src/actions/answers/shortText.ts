"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveShortTextAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid, "short_text_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertShortTextAnswerResponse = await supabase
        .from("short_text_answer_table")
        .insert({
          answerid: answerid,
          answertext: answertext,
        });
      if (insertShortTextAnswerResponse) {
        console.log(insertShortTextAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateShortTextAnswerResponse = await supabase
        .from("short_text_answer_table")
        .update({
          answertext: answertext,
        })
        .eq("answerid", answerid);
      if (updateShortTextAnswerResponse) {
        console.log(updateShortTextAnswerResponse);
      }
    }
  }
}

interface ShortTextAnswerResponse {
  answerid: string;
  answertext: string;
}

const initialstate: ShortTextAnswerResponse = {
  answerid: "",
  answertext: "",
};

export async function fetchShortTextAnswer(
  questionid: string,
): Promise<ShortTextAnswerResponse> {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shortTextData, error: shortTextError } = await supabase
    .rpc("fetch_short_text_answer_table", {
      question_id: questionid,
      user_id: user?.id,
    })
    .single<ShortTextAnswerResponse>();
  return shortTextData || initialstate;
}
