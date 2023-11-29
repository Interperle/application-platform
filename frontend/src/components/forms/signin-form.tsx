"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signInUser } from "@/actions/auth";
import { JSX } from "react";
import ForgottenPasswordForm from "./forgottenpassword-form";
import { useAppDispatch } from "@/store/store";
import { openPopup } from "@/store/slices/popupSlice";

interface messageType {
  message: string | null,
}

const initialState: messageType = {
  message: null,
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

export default function SignInForm() {
  const [state, formAction] = useFormState(signInUser, initialState);

  const dispatch = useAppDispatch();

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <div>
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
        </div>
        <div className="mb-0">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => dispatch(openPopup(<ForgottenPasswordForm />))}
            className="px-1 text-secondary"
          >
            Passwort vergessen?
          </button>
        </div>
        <div className="text-red-600 italic">
          {state?.message}
        </div>
        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
