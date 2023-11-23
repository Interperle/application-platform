"use server";
import { createCurrentTimestamp } from "@/utils/helpers";
import { createBrowserClient } from "@supabase/ssr";

export async function saveShortTextAnswer(formData: FormData) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const insertAnswerResponse = await supabase
    .from("answer_table")
    .insert({
      questionid: "",
      applicationid: applicationData!.applicationid,
      created: now,
      lastupdated: now,
    });

  if (insertAnswerResponse) {
    console.log(insertAnswerResponse);
  }

  const insertShortTextAnswerResponse = await supabase
    .from("short_text_answer_table")
    .insert({
      answerid: insertAnswerResponse!.data!,
      answertext: "HALLO WELT",
    });
  if (insertShortTextAnswerResponse) {
    console.log(insertShortTextAnswerResponse);
  }
}
