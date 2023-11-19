import { NextResponse } from 'next/server'
import { getURL } from '@/utils/helpers';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          cookies: {
          get(name: string) {
              return cookieStore.get(name)?.value
          },
          },
      }
  )

  await supabase.auth.signOut();

  return NextResponse.redirect(`${getURL()}/login`, {
    status: 301,
  })
}