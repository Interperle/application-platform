import { NextRequest, NextResponse } from "next/server";

import { initSupabaseRouteNew } from "@/utils/supabaseServerClients";
import { getURL } from "@/utils/helpers";

export async function GET(req: NextRequest) {
    console.log(req)
  let options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${getURL()}/admin/auth/callback`,
  };

  const supabase = initSupabaseRouteNew();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options,
  });
  console.log(data)

  if (error) throw error;

  return NextResponse.redirect(data.url);
}
