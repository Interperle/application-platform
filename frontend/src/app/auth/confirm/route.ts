import { getURL } from "@/utils/helpers";
import { initSupabaseRoute } from "@/utils/supabaseServerClients";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? `${getURL()}/`;

  if (token_hash && type) {
    const supabase = initSupabaseRoute();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    console.log(error);
    if (!error) {
      return NextResponse.redirect(`${getURL()}${next}`);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${getURL()}auth/auth-code-error`);
}
