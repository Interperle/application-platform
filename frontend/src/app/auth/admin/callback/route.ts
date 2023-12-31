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
    try{
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error){
      console.log(error)
      return NextResponse.redirect(`${getURL()}`);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: roleData, error: roleError } = await supabase
      .from("user_profiles_table")
      .select("*")
      .eq("userid", user!.id)
      .single();

    if (roleError) {
      if (roleError.code == "PGRST116") {
        console.log("No Role yet");
      } else {
        console.log("RoleError:");
        console.log(roleError);
      }
    }
    if (!roleData) {
      const { data: userProfileData, error: userProfileError } =
        await supabaseServiceRole
          .from("user_profiles_table")
          .insert({ userid: user!.id, userrole: 2, isactive: true });
      if (userProfileError) {
        console.log("userProfileError");
        console.log(userProfileError);
      } else {
        console.log("Created Reviewer Role...");
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
  console.log(`Auth/Admin/Callback Redirect To: ${getURL()}${subdomain}`);

  return NextResponse.redirect(`${getURL()}${subdomain}`);
}
