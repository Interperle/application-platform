"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";

export async function saveVideoUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const bucket_name = "video-" + questionid;
  if (file) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertVideoUploadAnswerResponse = await supabase
        .from("video_upload_answer_table")
        .insert({
          answerid: answerid,
          videoname: file.name,
        });
      if (insertVideoUploadAnswerResponse) {
        console.log("Inserted Video");
        console.log(insertVideoUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${file.name}`,
          file,
        );
      console.log(createBucketEntry);
    } else if (reqtype == "updated") {
      const getOldVideoUploadAnswerResponse = await supabase
        .from("video_upload_answer_table")
        .select("videoname")
        .eq("answerid", answerid)
        .single();
      const updateVideoUploadAnswerResponse = await supabase
        .from("video_upload_answer_table")
        .update({ videoname: file.name })
        .eq("answerid", answerid);
      if (updateVideoUploadAnswerResponse) {
        console.log("Updated Video: " + file.name);
        console.log(updateVideoUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${getOldVideoUploadAnswerResponse.data?.videoname}`,
          file,
        );
      console.log(createBucketEntry);
    }
  }
}

export async function deleteVideoUploadAnswer(
  questionid: string,
  answerid: string,
) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const bucket_name = "video-" + questionid;
  const { data: videoUploadData, error: videoUploadError } = await supabase
    .from("video_upload_answer_table")
    .select("videoname")
    .eq("answerid", answerid)
    .single();
  const { data: videoDeleteData, error: videoDeleteError } =
    await supabase.storage
      .from(bucket_name)
      .remove([`${user.id}_${videoUploadData!.videoname}`]);
  await deleteAnswer(questionid, "video_upload_answer_table");
}
