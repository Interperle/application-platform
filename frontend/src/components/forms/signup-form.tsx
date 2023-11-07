"use client"
import { useFormState, useFormStatus } from 'react-dom';
import { signUpUser } from '@/actions/auth'

const initialState = {
  message: "",
}

function SubmitButton(){
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Bestätigen</button>
  )
}

export default function SignUpForm() {

  const [state, signUpAction] = useFormState(signUpUser, initialState)

  return (
    <div>
      <h2>Registriere dich!</h2>
      <form action={signUpAction} className="space-y-6">
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
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Passwort bestätigen
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
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

/*
const supabase = createClientComponentClient<Database>()

  return (
    <Auth
      supabaseClient={supabase}
      view="sign_up"
      magicLink={false}
      appearance={{ 
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#153757',
              brandAccent: '#153757',
              brandButtonText: '#FDCC89',
              inputLabelText: '#153757',
            }
          }
        }
      }}
      showLinks={false}
      providers={[]}
      redirectTo={`${getURL()}/`}
      localization={{
        variables: {
          sign_up: {
            email_label: 'Email',
            email_input_placeholder: 'max@mustermann.de',
            password_label: 'Passwort',
            password_input_placeholder: '********',
            button_label: 'Registrieren',
            loading_button_label: 'Registrieren',
            confirmation_text: 'Wir haben dir eine Email geschickt'
          },
        },
      }}
    />
  )
 */