"use server"

import { getURL } from "@/utils/helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { supabaseServiceRole } from "@/utils/supabase_servicerole";


export async function signUpUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    passwordConfirmation: z.string().min(1)
  })
  const signUpFormData = schema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("confirm-password")
  })
  if (signUpFormData.password != signUpFormData.passwordConfirmation){
    return {message: `Passwörter stimmen nicht überein!`}
  }
  try {
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
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: signUpFormData.email.replace("@googlemail.com", "@gmail.com"),
      password: signUpFormData.password,
      options: {
        data: {},
        emailRedirectTo: `${getURL()}`,
      },
    }) 
    revalidatePath("/login");
    if (userError){
      console.log(userError)
      return {message: userError.message}
    }
    console.log(userData)
    console.log("Success")

    const { data: userProfileData, error: userProfileError } = await supabaseServiceRole.from(
      'user_profiles_table'
    ).insert({'userid': userData.user!.id, 'userrole': 1})

    if (userProfileError){
      console.log(userProfileError)
      return {message: userProfileError.message}
    }
    console.log("Success")

    return {message: `Wir haben dir eine Email geschickt!`}
  } catch (e){
    console.log("Fehler")
    return {message: "Etwas ist schief gelaufen, bitte probiere es nocheinmal."}
  }
}


export async function signInUser(prevState: any, formData: FormData) {
  console.log("Action")
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1)
  })
  const signInFormData = schema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  })
  try {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInFormData.email.replace("@googlemail.com", "@gmail.com"),
      password: signInFormData.password,
    })
    if (error) {
      console.log(error)
    }
    revalidatePath("/");
  } catch (e){
    return {message: "Error"}
  }
  redirect("/")
}


export async function signOutUser(prevState: any, formData: FormData) {
  try {
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
    const { error } = await supabase.auth.signOut()
    if (error){
      console.log(error)
    }
  } catch (e){
    return {message: "Error"}
  }
  redirect("/")
}


export async function sendResetPasswordLink(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
  })
  const signUpFormData = schema.parse({
    email: formData.get("email"),
  })
  try {
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(signUpFormData.email.replace("@googlemail.com", "@gmail.com"), {
      redirectTo: `${getURL()}auth/callback?next=${getURL()}login/update-password/`,
    })

    revalidatePath("/login");
    return {message: `Send "Reset Password Email" successfully`}
  } catch (e){
    return {message: "Error"}
  }
}


export async function deleteUser() {
  console.log("Action")
  try {
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
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.log(userError)
    }
    console.log()
    const { data, error } = await supabaseServiceRole.auth.admin.deleteUser(userData.user!.id)
    if (error) {
      console.log(error)
    }
    revalidatePath("/");
  } catch (e){
    return {message: "Error"}
  }
  redirect("/login")
}



export async function updatePassword(prevState: any, formData: FormData) {
  console.log("Action")
  const schema = z.object({
    // For Implementation with Old Password Check: https://github.com/orgs/supabase/discussions/4042#discussioncomment-1707356
    //old_password: z.string().min(1),
    new_password: z.string().min(1),
    reenter_password: z.string().min(1)
  })
  const updatePasswordFormData = schema.parse({
    //old_password: formData.get("old_password"),
    new_password: formData.get("new_password"),
    reenter_password: formData.get("reenter_password")
  })
  if (updatePasswordFormData.new_password != updatePasswordFormData.reenter_password){
    return {message: "Passwords don't match"}
  }
  try {
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
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      password: updatePasswordFormData.new_password
    })
    if (userError) {
      console.log(userError)
    }
    console.log(userData)
    revalidatePath("/");
  } catch (e){
    return {message: "Error"}
  }
}