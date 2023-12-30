import { NextRequest, NextResponse } from "next/server";

import { initSupabaseRouteNew } from "@/utils/supabaseServerClients";

export async function GET(req: NextRequest) {
  let options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${new URL(req.url).origin}/admin/auth/callback`,
  };

  const supabase = initSupabaseRouteNew();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options,
  });

  if (error) throw error;

  return NextResponse.redirect(data.url);
}
