'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'

export default function PasswordResetForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <Auth
      supabaseClient={supabase}
      view="forgotten_password"
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
      redirectTo="http://localhost:3000/auth/callback"
      localization={{
        variables: {
          forgotten_password: {
            email_label: 'Email',
            email_input_placeholder: 'max@mustermann.de',
            password_label: 'Passwort',
            button_label: 'Passwort zurücksetzen',
            loading_button_label: 'Passwort zurücksetzen',
            confirmation_text: 'Wir haben dir eine Email geschickt'
          },
        },
      }}
    />
  )
}