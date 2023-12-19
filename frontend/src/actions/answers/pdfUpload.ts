"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";
import { storageSaveName } from "@/utils/helpers";

export async function savePdfUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = "pdf-" + questionid;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertPdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .insert({
          answerid: answerid,
          pdfname: uploadFile.name,
        });
      if (insertPdfUploadAnswerResponse) {
        console.log("Inserted Pdf");
        console.log(insertPdfUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      console.log(createBucketEntry);
    } else if (reqtype == "updated") {
      const getOldPdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .select("pdfname")
        .eq("answerid", answerid)
        .single();
      const updatePdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .update({ pdfname: uploadFile.name })
        .eq("answerid", answerid);
      if (updatePdfUploadAnswerResponse) {
        console.log("Updated Pdf");
        console.log(updatePdfUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${getOldPdfUploadAnswerResponse.data?.pdfname}`,
          uploadFile,
        );
      console.log(createBucketEntry);
    }
  }
}

export async function deletePdfUploadAnswer(
  questionid: string,
  answerid: string,
) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const bucket_name = "pdf-" + questionid;
  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .from("pdf_upload_answer_table")
    .select("pdfname")
    .eq("answerid", answerid)
    .single();
  const { data: pdfDeleteData, error: pdfDeleteError } = await supabase.storage
    .from(bucket_name)
    .remove([`${user.id}_${pdfUploadData!.pdfname}`]);
  await deleteAnswer(questionid, "pdf_upload_answer_table");
}
