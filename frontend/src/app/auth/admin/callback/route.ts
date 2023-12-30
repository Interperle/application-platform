import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getURL } from "@/utils/helpers";
import {
  initSupabaseRouteNew,
  supabaseServiceRole,
} from "@/utils/supabaseServerClients";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  var subdomain = "";
  if (code) {
    const supabase = initSupabaseRouteNew();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: roleData, error: roleError } = await supabase
      .from("user_profiles_table")
      .select("*")
      .eq("userid", user!.id)
      .single();

    if (roleError) {
      console.log("TESTING: ");
      console.log(roleError);
    }
    if (!roleData) {
      const { data: userProfileData, error: userProfileError } =
        await supabaseServiceRole
          .from("user_profiles_table")
          .insert({ userid: user!.id, userrole: 2, isactive: true });
      if (userProfileError) {
        console.log("userProfileError");
        console.log(userProfileError);
      }
      subdomain = "review";
    } else if (!roleData.isactive) {
      subdomain = "403";
      await supabase.auth.signOut();
    } else if (roleData.userrole == 2) {
      subdomain = "review";
    } else if (roleData.userrole == 3) {
      subdomain = "admin";
    }
  }

  return NextResponse.redirect(`${getURL()}${subdomain}`);
}
