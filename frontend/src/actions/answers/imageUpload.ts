"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import {
  deleteAnswer,
  getCurrentUser,
  saveAnswer,
} from "./answers";

export async function saveImageUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const bucket_name = "image-" + questionid;
  if (file) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .insert({
          answerid: answerid,
          imagename: file.name,
        });
      if (insertImageUploadAnswerResponse) {
        console.log("Inserted Image");
        console.log(insertImageUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${file.name}`,
          file,
        );
      console.log(createBucketEntry);
    } else if (reqtype == "updated") {
      const getOldImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .select("imagename")
        .eq("answerid", answerid)
        .single();
      const updateImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .update({ imagename: file.name })
        .eq("answerid", answerid);
      if (updateImageUploadAnswerResponse) {
        console.log("Updated Image");
        console.log(updateImageUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${getOldImageUploadAnswerResponse.data?.imagename}`,
          file,
        );
      console.log(createBucketEntry);
    }
  }
}

export async function deleteImageUploadAnswer(
  questionid: string,
  answerid: string,
) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const bucket_name = "image-" + questionid;
  const { data: imageUploadData, error: imageUploadError } = await supabase
    .from("image_upload_answer_table")
    .select("imagename")
    .eq("answerid", answerid)
    .single();
  if (!imageUploadError) {
    const { data: imageDeleteData, error: imageDeleteError } =
      await supabase.storage
        .from(bucket_name)
        .remove([`${user.id}_${imageUploadData!.imagename}`]);
  }
  await deleteAnswer(questionid, "image_upload_answer_table");
}
