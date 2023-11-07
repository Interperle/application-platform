'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/utils/supabase_client'
import { Database } from '../../types/supabase'

export default function ForgottenPasswordForm() {

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
      redirectTo="http://localhost:3000/"
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