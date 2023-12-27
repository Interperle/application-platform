import { NextResponse } from "next/server";

import { getURL } from "@/utils/helpers";
import {
  initSupabaseActions,
  supabaseServiceRole,
} from "@/utils/supabaseServerClients";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const code_challenge = requestUrl.searchParams.get("code_challenge");

  const supabase = initSupabaseActions();
  console.log(request.url)
  console.log("Redirect To:")
  console.log(`${getURL()}`)

  if (code) {
    const data = await supabase.auth.exchangeCodeForSession(code);
    console.log(data)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user){
    console.log("No User found!")
    return NextResponse.redirect(`${getURL()}`);
  }
  const { data: roleData, error: roleError } = await supabase
    .from("user_profiles_table")
    .select("*")
    .eq("userid", user!.id)
    .single();

  if (roleError) {
    console.log("TESTING: ");
    console.log(roleError);
  }
  var subdomain = "";
  if (!roleData) {
    const { data: userProfileData, error: userProfileError } =
      await supabaseServiceRole
        .from("user_profiles_table")
        .insert({ userid: user!.id, userrole: 2, isactive: true });
    if (userProfileError){
      console.log("userProfileError")
      console.log(userProfileError)
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
  return NextResponse.redirect(`${getURL()}${subdomain}/`);
}
