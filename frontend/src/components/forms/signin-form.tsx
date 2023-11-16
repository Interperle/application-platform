'use client'
import { useFormState, useFormStatus } from 'react-dom';
import { signInUser } from '@/actions/auth'
import { JSX } from 'react';
import ForgottenPasswordForm from './forgottenpassword-form';
import { useAppDispatch } from '@/store/store';
import { openPopup } from '@/store/slices/popupSlice';

const initialState = {
  message: null,
}

function SubmitButton(){
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending} className="w-full flex justify-center border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">Bestätigen</button>
  )
}

export default function SignInForm() {

  const [state, sigInAction] = useFormState(signInUser, initialState)

  const dispatch = useAppDispatch();

  return (
    <div>
      <form action={sigInAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
        <div className="flex justify-end">
          <button type="button" onClick={() => dispatch(openPopup(<ForgottenPasswordForm/>))} className="px-1 text-[#153757]">
              Passwort vergessen?
          </button>
        </div>
        <p aria-live="polite" className="sr-only" role="status">
          {state?.message}
        </p>
        <div>
          <SubmitButton/>
        </div>
      </form>
    </div>
  );
}