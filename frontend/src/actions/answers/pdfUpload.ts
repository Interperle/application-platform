"use server";

import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
  setupSupabaseClient,
} from "./answers";

export async function savePdfUploadAnswer(
  questionid: string,
  formData: FormData
) {
  const file = formData.get(questionid) as File;
  const bucket_name = "pdf-" + questionid
  if (file) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertPdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .insert({
          answerid: answerid,
          pdfname: file.name
        });
      if (insertPdfUploadAnswerResponse) {
        console.log("Inserted Pdf")
        console.log(insertPdfUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage.from(bucket_name).upload(`${(await supabase.auth.getUser()).data.user!.id}_${file.name}`, file)
      console.log(createBucketEntry)
    } else if (reqtype == "updated") {
      const getOldPdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .select("pdfname")
        .eq("answerid", answerid)
        .single();
      const updatePdfUploadAnswerResponse = await supabase
        .from("pdf_upload_answer_table")
        .update({pdfname: file.name})
        .eq("answerid", answerid);
      if (updatePdfUploadAnswerResponse) {
        console.log("Updated Pdf")
        console.log(updatePdfUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage.from(bucket_name).update(`${(await supabase.auth.getUser()).data.user!.id}_${getOldPdfUploadAnswerResponse.data?.pdfname}`, file)
      console.log(createBucketEntry)
    }
  }
}


export async function deletePdfUploadAnswer(
  questionid: string,
) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  const bucket_name = "pdf-" + questionid
  const { data: pdfUploadData, error: pdfUploadError } = await supabase
      .from("pdf_upload_answer_table")
      .select("pdfname")
      .eq("answerid", answerid)
      .single();
  const { data: pdfDeleteData, error: pdfDeleteError } = await supabase
      .storage
      .from(bucket_name)
      .remove([`${user.id}_${pdfUploadData!.pdfname}`]);
  await deleteAnswer(questionid, "pdf_upload_answer_table");
}



