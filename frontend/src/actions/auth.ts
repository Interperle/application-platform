"use server";

import { getURL } from "@/utils/helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import {
  initSupabaseActions,
  supabaseServiceRole,
} from "@/utils/supabaseServerClients";
import { UserRole } from "@/utils/userRole";
import { SupabaseClient } from "@supabase/supabase-js";

export async function signUpUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    passwordConfirmation: z.string().min(1),
  });
  const signUpFormData = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("confirm-password"),
  });

  if (!signUpFormData.success) {
    return { message: "User Registrierung fehlgeschlagen", status: "ERROR" };
  }

  if (
    signUpFormData.data.password != signUpFormData.data.passwordConfirmation
  ) {
    return { message: `Passwörter stimmen nicht überein!`, status: "ERROR" };
  }
  try {
    const supabase = initSupabaseActions();
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: signUpFormData.data.email.replace("@googlemail.com", "@gmail.com"),
      password: signUpFormData.data.password,
      options: {
        data: {},
        emailRedirectTo: `${getURL()}`,
      },
    });
    revalidatePath("/login");
    if (userError) {
      return { message: userError.message, status: "ERROR" };
    }

    const { data: userProfileData, error: userProfileError } =
      await supabaseServiceRole
        .from("user_profiles_table")
        .insert({ userid: userData.user!.id, userrole: 1, isactive: true });

    if (userProfileError) {
      console.log(userProfileError);
      return { message: userProfileError.message };
    }
    console.log("Success");
    const sendData = { userid: userData!.user!.id };
    const { data: applicationData, error: applicationError } =
      await supabaseServiceRole.from("application_table").insert(sendData);
    if (applicationError) {
      console.log(applicationError);
      return { message: applicationError.message, status: "ERROR" };
    }

    return {
      message: `Wir haben dir eine Email geschickt!`,
      status: "SUCCESS",
    };
  } catch (e) {
    return {
      message: "Etwas ist schief gelaufen, bitte probiere es nocheinmal.",
      status: "ERROR",
    };
  }
}

export async function signInUser(prevState: any, formData: FormData) {
  console.log("SignIn User");
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
  });
  const signInFormData = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!signInFormData.success) {
    return { message: "User Login fehlgeschlagen" };
  }

  try {
    const supabase = initSupabaseActions();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInFormData.data.email.replace("@googlemail.com", "@gmail.com"),
      password: signInFormData.data.password,
    });
    if (error) {
      console.log(error);
      return { message: "Fehler: " + error.message };
    }
    revalidatePath("/");
  } catch (e) {
    return {
      message: "Etwas ist schief gelaufen. Bitte probiere es nocheinmal",
    };
  }
  redirect("/");
}

export async function signOutUser(prevState: any, formData: FormData) {
  try {
    const supabase = initSupabaseActions();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { message: error.message, status: "ERROR" };
    }
  } catch (e) {
    return { message: String(e), status: "ERROR" };
  }
  redirect("/");
}

export async function sendResetPasswordLink(
  prevState: any,
  formData: FormData,
) {
  const schema = z.object({
    email: z.string().min(1),
  });
  const resetPasswordFormData = schema.safeParse({
    email: formData.get("email"),
  });

  if (!resetPasswordFormData.success) {
    return { message: "Passwort zurücksetzen fehlgeschlagen", status: "ERROR" };
  }
  try {
    const supabase = initSupabaseActions();
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      resetPasswordFormData.data.email.replace("@googlemail.com", "@gmail.com"),
      {
        redirectTo: `${getURL()}auth/callback?next=${getURL()}login/update-password/`,
      },
    );
    console.log(error);
    if (error) {
      return { message: error.message, status: "ERROR" };
    }

    revalidatePath("/login");
    return {
      message: `Wenn du einen Account bei uns besitzt wurde dir ein Passwort Zurücksetzen Link gesendet!`,
      status: "SUCCESS",
    };
  } catch (e) {
    return { message: "Error", status: "ERROR" };
  }
}

export async function deleteUser() {
  console.log("Action");
  try {
    const supabase = initSupabaseActions();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return { message: userError.message };
    }
    console.log();
    const { data, error } = await supabaseServiceRole.auth.admin.deleteUser(
      userData.user!.id,
    );
    if (error) {
      return { message: error.message };
    }
    revalidatePath("/");
  } catch (e) {
    return { message: "Error" };
  }
  redirect("/login");
}

export async function updatePassword(prevState: any, formData: FormData) {
  console.log("Action");
  const schema = z.object({
    // For Implementation with Old Password Check: https://github.com/orgs/supabase/discussions/4042#discussioncomment-1707356
    //old_password: z.string().min(1),
    new_password: z.string().min(1),
    reenter_password: z.string().min(1),
  });
  const updatePasswordFormData = schema.parse({
    //old_password: formData.get("old_password"),
    new_password: formData.get("new_password"),
    reenter_password: formData.get("reenter_password"),
  });
  if (
    updatePasswordFormData.new_password !=
    updatePasswordFormData.reenter_password
  ) {
    return { message: "Passwords don't match", status: "ERROR" };
  }
  try {
    const supabase = initSupabaseActions();
    const { data: userData, error: userError } = await supabase.auth.updateUser(
      {
        password: updatePasswordFormData.new_password,
      },
    );
    if (userError) {
      return { message: userError.message, status: "ERROR" };
    }
    revalidatePath("/");
  } catch (e) {
    return {
      message: "Es ist ein Fehler aufgetreten, probiere es nocheinmal!",
      status: "ERROR",
    };
  }
  redirect("/");
}

export async function signInWithSlack() {
  const supabase = initSupabaseActions();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options: {
      redirectTo: `${getURL()}auth/callback/`,
    },
  });
  console.log(error);
  console.log(data);
  if (data && data.url) {
    console.log("Redirect to " + data.url);
    redirect(data.url);
  } else {
    console.log("Error during sign in:", error);
  }
}

export async function isAuthorized(
  supabase: SupabaseClient,
  requiredRole: UserRole,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userProfileData, error: userProfileError } = await supabase
    .from("user_profiles_table")
    .select("userrole")
    .eq("userid", user!.id)
    .single();
  if (userProfileError) {
    throw userProfileError;
  }
  if (userProfileData.userrole >= requiredRole.valueOf()) {
    return null; // User has the required role
  }

  // Redirect based on the user's role
  return userProfileData.userrole === UserRole.Reviewer
    ? "/review"
    : userProfileData.userrole === UserRole.Admin
      ? "/admin"
      : "/";
}
