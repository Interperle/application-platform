'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'

export default function UpdatePasswordForm() {
  const supabase = createClientComponentClient<Database>()

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
            update_password: {
                password_label: "Passwort",
                password_input_placeholder: "Passwort",
                button_label: "Neues Passwort",
                loading_button_label: "Speichere neues Passwort",
                confirmation_text: "Dein Passwort wurde geupdated",
            }
        },
      }}
    />
  )
}