import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getURL } from "@/utils/helpers";
import { initSupabaseRouteNew } from "@/utils/supabaseServerClients";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (code) {
    const supabase = initSupabaseRouteNew();
    try{
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error){
      console.log(error)
      return NextResponse.redirect(`${getURL()}`);
    }
  }
  return NextResponse.redirect(`${getURL()}${next}`);
}
