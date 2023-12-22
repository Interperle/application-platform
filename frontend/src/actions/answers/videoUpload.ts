"use server";

import { storageSaveName } from "@/utils/helpers";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";

export async function saveVideoUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = "video-" + questionid;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertVideoUploadAnswerResponse = await supabase
        .from("video_upload_answer_table")
        .insert({
          answerid: answerid,
          videoname: uploadFile.name,
        });
      if (insertVideoUploadAnswerResponse) {
        console.log("Inserted Video");
        console.log(insertVideoUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
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
        .update({ videoname: uploadFile.name })
        .eq("answerid", answerid);
      if (updateVideoUploadAnswerResponse) {
        console.log("Updated Video: " + uploadFile.name);
        console.log(updateVideoUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${getOldVideoUploadAnswerResponse.data?.videoname}`,
          uploadFile,
        );
      console.log(createBucketEntry);
    }
  }
}

export async function deleteVideoUploadAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const { data: videoUploadData, error: videoUploadError } = await supabase
    .rpc("fetch_video_upload_answer_table", {
      question_id: questionid,
      user_id: user.id,
    })
    .single<VideoAnswerResponse>();
  const bucket_name = "video-" + questionid;
  const { data: videoDeleteData, error: videoDeleteError } =
    await supabase.storage
      .from(bucket_name)
      .remove([`${user.id}_${videoUploadData?.videoname}`]);
  await deleteAnswer(questionid, "video_upload_answer_table");
}

interface VideoAnswerResponse {
  answerid: string;
  videoname: string;
}

export async function fetchVideoUploadAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user_id = userData.user!.id;

  const { data: videoUploadData, error: videoUploadError } = await supabase
    .rpc("fetch_video_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<VideoAnswerResponse>();

  if (videoUploadError) {
    return null;
  }
  return { ...videoUploadData, userid: user_id };
}
