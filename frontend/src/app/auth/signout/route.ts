import { supabase } from '@/utils/supabase_server'
import { NextResponse } from 'next/server'
import { getURL } from '@/utils/helpers';

export async function POST(request: Request) {
  await supabase.auth.signOut();

  return NextResponse.redirect(`${getURL()}/login`, {
    status: 301,
  })
}