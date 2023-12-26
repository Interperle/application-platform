"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

export async function saveConditionalAnswer(
  answertext: string,
  questionid: string,
) {
  console.log(answertext)
  if (answertext == "") {
    await deleteAnswer(questionid, "conditional_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    console.log(answerid)
    console.log(reqtype)
    if (reqtype == "created") {
      const insertConditionalAnswerResponse = await supabase
        .from("conditional_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertConditionalAnswerResponse) {
        console.log(insertConditionalAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateConditionalAnswerResponse = await supabase
        .from("conditional_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateConditionalAnswerResponse) {
        console.log(updateConditionalAnswerResponse);
      }
    }
  }
}

interface ConditionalAnswerResponse {
  answerid: string;
  selectedchoice: string;
}

const initialstate: ConditionalAnswerResponse = {
  answerid: "",
  selectedchoice: "",
};

export async function fetchConditionalAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: conditionalTextData, error: conditionalTextError } =
    await supabase
      .rpc("fetch_conditional_answer_table", {
        question_id: questionid,
        user_id: user?.id,
      })
      .single<ConditionalAnswerResponse>();
  if (conditionalTextError) {
    console.log("conditionalTextError:");
    console.log(conditionalTextError);
  }
  return conditionalTextData || initialstate;
}
