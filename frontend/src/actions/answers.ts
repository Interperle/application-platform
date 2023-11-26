"use server";

import { createCurrentTimestamp } from "@/utils/helpers";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient, User, UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";


interface saveAnswerType {
  supabase: SupabaseClient
  answerid: string
}


export async function saveAnswer(questionid: string): Promise<saveAnswerType>{
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.log(userError);
  }

  const { data: applicationData, error: applicationError } = await supabase
    .from("application_table")
    .select("applicationid")
    .eq("userid", userData!.user!.id)
    .single();
  if (applicationError) {
    console.log(applicationError);
  }

  const now = createCurrentTimestamp();
  console.log(now);
  const insertAnswerResponse = await supabase.from("answer_table").insert({
    questionid: questionid,
    applicationid: applicationData!.applicationid,
    created: now,
    lastupdated: now,
  });

  if (insertAnswerResponse) {
    console.log(insertAnswerResponse);
  }


  const selectAnswerResponse = await supabase.from("answer_table").select("answerid").eq("applicationid", applicationData!.applicationid).eq("questionid", questionid).single();

  if (selectAnswerResponse) {
    console.log(selectAnswerResponse);
  }

  return {supabase: supabase, answerid: selectAnswerResponse!.data!.answerid}
}



export async function saveShortTextAnswer(answertext: string, questionid: string) {
  const { supabase, answerid } = await saveAnswer(questionid)

  const insertShortTextAnswerResponse = await supabase
    .from("short_text_answer_table")
    .insert({
      answerid: answerid,
      answertext: answertext,
    });
  if (insertShortTextAnswerResponse) {
    console.log(insertShortTextAnswerResponse);
  }
}


export async function saveLongTextAnswer(answertext: string, questionid: string) {
  const { supabase, answerid } = await saveAnswer(questionid)

  const insertLongTextAnswerResponse = await supabase
    .from("long_text_answer_table")
    .insert({
      answerid: answerid,
      answertext: answertext,
    });
  if (insertLongTextAnswerResponse) {
    console.log(insertLongTextAnswerResponse);
  }
}


export async function saveDatePickerAnswer(pickeddate: Date, questionid: string) {
  const { supabase, answerid } = await saveAnswer(questionid)

  const insertDatePickerAnswerResponse = await supabase
    .from("date_picker_answer_table")
    .insert({
      answerid: answerid,
      pickeddate: pickeddate,
    });
  if (insertDatePickerAnswerResponse) {
    console.log(insertDatePickerAnswerResponse);
  }
}


export async function saveDateTimePickerAnswer(pickeddate: string, questionid: string) {
  const { supabase, answerid } = await saveAnswer(questionid)

  const insertDatePickerAnswerResponse = await supabase
    .from("datetime_picker_answer_table")
    .insert({
      answerid: answerid,
      pickeddate: pickeddate,
    });
  if (insertDatePickerAnswerResponse) {
    console.log(insertDatePickerAnswerResponse);
  }
}




export async function saveNumberPickerAnswer(pickednumber: Number, questionid: string) {
  const { supabase, answerid } = await saveAnswer(questionid)

  const insertNumberPickerAnswerResponse = await supabase
    .from("number_picker_answer_table")
    .insert({
      answerid: answerid,
      pickednumber: pickednumber,
    });
  if (insertNumberPickerAnswerResponse) {
    console.log(insertNumberPickerAnswerResponse);
  }
}