"use client";
import { useFormState, useFormStatus } from "react-dom";
import { sendResetPasswordLink } from "@/actions/auth";

interface messageType {
  message: string,
  status: string,
}

const initialState: messageType = {
  message: "",
  status: ""
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="apl-button-expanded"
    >
      Bestätigen
    </button>
  );
}

export default function SignUpForm() {
  const [state, formAction] = useFormState(sendResetPasswordLink, initialState);

  return (
    <div>
      <h2>Setze dein Passwort zurück</h2>
      <form action={formAction} className="space-y-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        <div className={`italic ${state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"}`}>
          {state?.message}
        </div>
        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
