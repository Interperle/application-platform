import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { getURL } from "@/utils/helpers";
import { initSupabaseRouteNew } from "@/utils/supabaseServerClients";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "";

  if (token_hash && type) {
    const supabase = initSupabaseRouteNew();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (error) {
      // TODO: return the user to an error page with some instructions
      console.log(JSON.stringify(error));
    }
  }

  return NextResponse.redirect(`${getURL()}${next}`);
}
