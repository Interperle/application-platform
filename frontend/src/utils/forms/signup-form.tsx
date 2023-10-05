'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'
import { useState } from 'react';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import router from 'next/router'


export default function SignUpForm() {
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
      redirectTo="/login"
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
}


/**
 * 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // instantiate supabase client
  const supabase = createClientComponentClient()

  const handleEmailChange = (event: { target: { value: SetStateAction<string> } }) => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = (event: { target: { value: SetStateAction<string> } }) => {
    setPassword(event.target.value)
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // sends a sign up request to supabase email provider
    await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
     })

    console.log('Submitted:', { email, password })
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required            
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
 */