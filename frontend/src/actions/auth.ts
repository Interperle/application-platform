"use server"

import { getURL } from "@/utils/helpers";
import { supabase } from "@/utils/supabase_server";
import { revalidatePath } from "next/cache";
import { z } from "zod";


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
    const { data, error } = await supabase.auth.signUp({
      email: signUpFormData.email,
      password: signUpFormData.password,
      options: {
        data: {},
        emailRedirectTo: `${getURL()}/`,
      },
    }) 
    revalidatePath("/login");
    if (error){
      return {message: error.message}
    }
    return {message: `Wir haben dir eine Email geschickt!`}
  } catch (e){
    return {message: "Etwas ist schief gelaufen, bitte probiere es nocheinmal."}
  }
}


export async function signInUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1)
  })
  const signUpFormData = schema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  })
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signUpFormData.email,
      password: signUpFormData.password,
    })
    revalidatePath("/");
    return {message: `SignedIn User ${signUpFormData.email} successfully`}
  } catch (e){
    return {message: "Error"}
  }
}


export async function signOutUser(prevState: any, formData: FormData) {
  try {
    const { error } = await supabase.auth.signOut()
    revalidatePath("/login");
    return {message: `SignedOut User successfully`}
  } catch (e){
    return {message: "Error"}
  }
}


export async function sendResetPasswordLink(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
  })
  const signUpFormData = schema.parse({
    email: formData.get("email"),
  })
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(signUpFormData.email, {
      redirectTo: `${getURL()}/login/update-password/`,
    })
    revalidatePath("/login");
    return {message: `SignedIn User ${signUpFormData.email} successfully`}
  } catch (e){
    return {message: "Error"}
  }
}