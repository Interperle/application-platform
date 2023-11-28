import {
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  setupSupabaseClient,
} from "@/actions/answers/answers";
import { createBrowserClient } from "@supabase/ssr";
import moment from "moment-timezone";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export function createCurrentTimestamp() {
  return moment().tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss.SSS");
}

export function setToPrefferedTimeZone(dateString: string) {
  return moment(dateString)
    .tz("Europe/Berlin")
    .format("YYYY-MM-DDTHH:mm:ss.SSS");
}

export function transformReadableDate(dateString: string) {
  return moment(dateString).tz("Europe/Berlin").format("DD.MM.YYYY");
}

export async function fetchImageUploadAnswer(questionid: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user_id = userData.user!.id;
  const { data: applicationData, error: applicationError } = await supabase
    .from("application_table")
    .select("applicationid")
    .eq("userid", user_id)
    .single();
  if (applicationError) {
    console.log(applicationError);
  }
  const applicationid = applicationData?.applicationid;
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .eq("questionid", questionid)
    .eq("applicationid", applicationid);
  if (answerError) {
    console.log(answerError);
  }
  if (answerData!.length == 0) {
    return null;
  }
  let answerid = answerData![0].answerid;
  const bucket_name = "image-" + questionid;

  if (answerid) {
    const { data: imageUploadData, error: imageUploadError } = await supabase
      .from("image_upload_answer_table")
      .select("imagename")
      .eq("answerid", answerid)
      .single();
    if (imageUploadError) {
      alert(imageUploadError.message);
    }
    const { data: imageUploadBucketData, error: imageUploadBucketError } =
      await supabase.storage
        .from(bucket_name)
        .download(`${user_id}_${imageUploadData!.imagename}`);

    return imageUploadBucketData;
  }
  return null;
}

export async function fetchPdfUploadAnswer(questionid: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user_id = userData.user!.id;
  const { data: applicationData, error: applicationError } = await supabase
    .from("application_table")
    .select("applicationid")
    .eq("userid", user_id)
    .single();
  if (applicationError) {
    console.log(applicationError);
  }
  const applicationid = applicationData?.applicationid;
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .eq("questionid", questionid)
    .eq("applicationid", applicationid);
  if (answerError) {
    console.log(answerError);
  }
  if (answerData!.length == 0) {
    return null;
  }
  let answerid = answerData![0].answerid;
  const bucket_name = "pdf-" + questionid;

  if (answerid) {
    const { data: pdfUploadData, error: pdfUploadError } = await supabase
      .from("pdf_upload_answer_table")
      .select("pdfname")
      .eq("answerid", answerid)
      .single();
    if (pdfUploadError) {
      alert(pdfUploadError.message);
    }
    const { data: pdfUploadBucketData, error: pdfUploadBucketError } =
      await supabase.storage
        .from(bucket_name)
        .download(`${user_id}_${pdfUploadData!.pdfname}`);

    return pdfUploadBucketData;
  }
  return null;
}

export async function fetchVideoUploadAnswer(questionid: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user_id = userData.user!.id;
  const { data: applicationData, error: applicationError } = await supabase
    .from("application_table")
    .select("applicationid")
    .eq("userid", user_id)
    .single();
  if (applicationError) {
    console.log(applicationError);
  }
  const applicationid = applicationData?.applicationid;
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .eq("questionid", questionid)
    .eq("applicationid", applicationid);
  if (answerError) {
    console.log(answerError);
  }
  if (answerData!.length == 0) {
    return null;
  }
  let answerid = answerData![0].answerid;
  const bucket_name = "video-" + questionid;

  if (answerid) {
    const { data: videoUploadData, error: videoUploadError } = await supabase
      .from("video_upload_answer_table")
      .select("videoname")
      .eq("answerid", answerid)
      .single();
    if (videoUploadError) {
      alert(videoUploadError.message);
    }
    const { data: videoUploadBucketData, error: videoUploadBucketError } =
      await supabase.storage
        .from(bucket_name)
        .download(`${user_id}_${videoUploadData!.videoname}`);

    return videoUploadBucketData;
  }
  return null;
}
