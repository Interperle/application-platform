"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpUser, updatePassword } from "@/actions/auth";
import { SubmitButton } from "../submitButton";

interface messageType {
  message: string;
  status: string;
}

const initialState: messageType = {
  message: "",
  status: "",
};

export default function SignUpForm() {
  const [state, formAction] = useFormState(updatePassword, initialState);

  return (
    <div>
      <h2>Update dein Passwort!</h2>
      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Neues Passwort
          </label>
          <input
            id="new_password"
            type="password"
            name="new_password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="reenter_password"
            className="block text-sm font-medium text-gray-700"
          >
            Neues Passwort bestätigen
          </label>
          <input
            type="password"
            id="reenter_password"
            name="reenter_password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message}
        </div>
        <SubmitButton text={"Passwort updaten"} expanded={true} />
      </form>
    </div>
  );
}


/*
"use client"

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/utils/supabaseBrowserClient";

export default function UpdatePasswordForm() {
  return (
    <Auth
      supabaseClient={supabase}
      view="update_password"
      magicLink={false}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "#153757",
              brandAccent: "#153757",
              brandButtonText: "#FDCC89",
              inputLabelText: "#153757",
            },
          },
        },
      }}
      showLinks={false}
      providers={[]}
      redirectTo="http://localhost:3000/auth/callback"
      localization={{
        variables: {
          update_password: {
            password_label: "Passwort",
            password_input_placeholder: "Passwort",
            button_label: "Neues Passwort",
            loading_button_label: "Speichere neues Passwort",
            confirmation_text: "Dein Passwort wurde geupdated",
          },
        },
      }}
    />
  );
}*/
