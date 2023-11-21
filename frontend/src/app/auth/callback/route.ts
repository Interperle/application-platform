import { getURL } from '@/utils/helpers';
import { supabaseServiceRole } from '@/utils/supabase_servicerole';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
    cookies: {
        get(name: string) {
            return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
        },
      },
    }
)

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data: roleData, error: roleError
  } = await supabase.from("user_profiles_table").select("*").eq("userid", user!.id).single()

  if (roleError){
    console.log(roleError)
  }
  var subdomain = ""
  if(!roleData){
    const { data: userProfileData, error: userProfileError } = await supabaseServiceRole.from(
      'user_profiles_table'
    ).insert({'userid': user!.id, 'userrole': 2, 'isactive': true})
    subdomain = "review"
  }else if(!roleData.isactive){
    subdomain = "auth/auth-code-error"
    await supabase.auth.signOut()
  }else if(roleData.userrole == 2){
    subdomain = "review"
  }else if(roleData.userrole == 3){
    subdomain = "admin"
  }
  return NextResponse.redirect(`${getURL()}${subdomain}/`);
}