"use server";

import { storageSaveName } from "@/utils/helpers";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";

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
    }
  }
}

export async function deletePdfUploadAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .rpc("fetch_pdf_upload_answer_table", {
      question_id: questionid,
      user_id: user.id,
    })
    .single<PdfAnswerResponse>();
  const bucket_name = "pdf-" + questionid;
  const { data: pdfDeleteData, error: pdfDeleteError } = await supabase.storage
    .from(bucket_name)
    .remove([`${user.id}_${pdfUploadData?.pdfname}`]);
  await deleteAnswer(questionid, "pdf_upload_answer_table");
}

interface PdfAnswerResponse {
  answerid: string;
  pdfname: string;
}

export async function fetchPdfUploadAnswer(questionid: string) {
  const supabase = initSupabaseActions();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user_id = userData.user!.id;

  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .rpc("fetch_pdf_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<PdfAnswerResponse>();

  if (pdfUploadError) {
    return null;
  }
  return { ...pdfUploadData, userid: user_id };
}
