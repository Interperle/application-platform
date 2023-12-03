import { NextResponse } from "next/server";
import { getURL } from "@/utils/helpers";
import { initSupabaseRoute } from "@/utils/supabaseServerClients";

export async function POST(request: Request) {
  const supabase = initSupabaseRoute();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${getURL()}/login`, {
    status: 301,
  });
}
