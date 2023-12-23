"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getURL, isValidPassword } from "@/utils/helpers";
import {
  initSupabaseActions,
  supabaseServiceRole,
} from "@/utils/supabaseServerClients";
import { UserRole } from "@/utils/userRole";

export async function signUpUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    passwordConfirmation: z.string().min(1),
    legalConfirmation: z.string(),
  });
  const signUpFormData = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("confirm-password"),
    legalConfirmation: formData.get("confirm-legal"),
  });
  if (!signUpFormData.success) {
    return { message: "User Registrierung fehlgeschlagen", status: "ERROR" };
  }

  if (signUpFormData.data.legalConfirmation != "on") {
    return {
      message: "Du musst der Datenschutzerklärung zustimmen",
      status: "ERROR",
    };
  }
  if (!isValidPassword(signUpFormData.data.password)) {
    return {
      message:
        "Das Passwort muss mind. 1 Goßbuchstaben, mind. 1 Kleinbuchstaben, mind. 1 Zahl, mind. 1 Sonderzeichen enthalten und 8-72 Zeichen lang sein!",
      status: "ERROR",
    };
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
        emailRedirectTo: `${getURL()}`,
      },
    });
    revalidatePath("/login");
    if (userError) {
      console.log(JSON.stringify(userError));
      return { message: userError.message, status: "ERROR" };
    }

    if (
      userData.user &&
      userData.user.identities &&
      userData.user.identities.length === 0
    ) {
      return { message: "Der User ist bereits registriert!", status: "ERROR" };
    }

    const { data: userProfileData, error: userProfileError } =
      await supabaseServiceRole
        .from("user_profiles_table")
        .insert({ userid: userData.user!.id, userrole: 1, isactive: true });
    console.log("TEST");
    if (userProfileError) {
      if (userProfileError.code == "23505") {
        return {
          message:
            "Der User war zwar bereits registriert, dir wurde jedoch erneut eine Email gesendet, bitte schau in dein Postfach!",
          status: "SUCCESS",
        };
      }
      console.log("Userprofile Error");
      return { message: userProfileError.message, status: "ERROR" };
    }
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
    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email: signInFormData.data.email.replace(
          "@googlemail.com",
          "@gmail.com",
        ),
        password: signInFormData.data.password,
      });
    if (userError) {
      if (userError.status == 400) {
        return { message: "Deine Login Daten sind ungültig!" };
      }
      console.log(userError);
      return { message: "Fehler: " + userError.message };
    }
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles_table")
      .select("isactive")
      .eq("userid", userData.user.id)
      .single();
    if (profileData && !profileData.isactive) {
      await supabase.auth.signOut();
      return {
        message:
          "Dein User wurde deaktiviert, bitte kontaktiere uns über 'it-ressort@generation-d.org'!",
      };
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

export async function deleteUser(): Promise<{
  message: string;
  status: string;
}> {
  try {
    const supabase = initSupabaseActions();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return { message: userError.message, status: "ERROR" };
    }
    const { data, error } = await supabaseServiceRole.auth.admin.deleteUser(
      userData.user!.id,
    );
    if (error) {
      return { message: error.message, status: "ERROR" };
    }
    revalidatePath("/");
  } catch (e) {
    return {
      message: "Fehler, bitte probiere es nocheinmal.",
      status: "ERROR",
    };
  }
  return {
    message: "Der User wurde erfolgreich gelöscht!",
    status: "SUCCESS",
  };
}

export async function updatePassword(prevState: any, formData: FormData) {
  const schema = z.object({
    // For Implementation with Old Password Check: https://github.com/orgs/supabase/discussions/4042#discussioncomment-1707356
    //old_password: z.string().min(1),
    new_password: z.string().min(1),
    reenter_password: z.string().min(1),
  });
  const updatePasswordFormData = schema.safeParse({
    //old_password: formData.get("old_password"),
    new_password: formData.get("new_password"),
    reenter_password: formData.get("reenter_password"),
  });
  if (!updatePasswordFormData.success) {
    return { message: "Passwort updaten fehlgeschlagen", status: "ERROR" };
  }
  if (!isValidPassword(updatePasswordFormData.data.new_password)) {
    return {
      message:
        "Das Passwort muss mind. 1 Goßbuchstaben, mind. 1 Kleinbuchstaben, mind. 1 Zahl, mind. 1 Sonderzeichen enthalten und 8-72 Zeichen lang sein!",
      status: "ERROR",
    };
  }
  if (
    updatePasswordFormData.data.new_password !=
    updatePasswordFormData.data.reenter_password
  ) {
    return { message: "Passwörter stimmen nicht überein!", status: "ERROR" };
  }
  try {
    const supabase = initSupabaseActions();
    const { data: userData, error: userError } = await supabase.auth.updateUser(
      {
        password: updatePasswordFormData.data.new_password,
      },
    );
    if (userError) {
      if (
        userError.message ==
        "New password should be different from the old password."
      ) {
        return {
          message:
            "Dein neues Passwort muss sich vom vorherigen Passwort unterscheiden!",
          status: "ERROR",
        };
      }
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

export async function sendResetPasswordLinkFromSettings(
  prevState: any,
  formData: FormData,
) {
  const email = prevState.email;
  try {
    const supabase = initSupabaseActions();
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email.replace("@googlemail.com", "@gmail.com"),
      {
        redirectTo: `${getURL()}auth/callback?next=${getURL()}login/update-password/`,
      },
    );
    if (error) {
      return { message: error.message, status: "ERROR" };
    }
    revalidatePath("/login");
    return {
      message: `Dir wurde ein Passwort Zurücksetzen Link gesendet!`,
      status: "SUCCESS",
    };
  } catch (e) {
    return { message: "Error", status: "ERROR" };
  }
}
