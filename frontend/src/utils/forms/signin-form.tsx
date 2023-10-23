'use client'
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'


export default function SignInForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <Auth
      supabaseClient={supabase}
      view="sign_in"
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
          sign_in: {
            email_label: 'Email',
            password_label: 'Passwort',
            email_input_placeholder: 'max@mustermann.de',
            password_input_placeholder: '********',
            button_label: 'Einloggen',
            loading_button_label: 'Einloggen',
          },
        },
      }}
    />
  )
}


/**
export default function SignInForm() {
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.email);
  const password = useSelector(state => state.auth.password);

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(signIn())
      .unwrap() // Since RTK query actions use createAsyncThunk under the hood, the action returns a promise. Calling unwrap on it lets us handle the resolution or rejection of that promise.
      .then(data => {
        // Handle success
        nav.redirect("/");
      })
      .catch(error => {
        console.error("Error logging in:", error.message);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email-address" className="sr-only">Email</label>
        <input
          id="email-address"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="max@mustermann.de"
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">Passwort</label>
        <input
          id="password" 
          name="password"
          type="password"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </div>
      <div className="text-[#153757] align-end focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-#537575 font-light text-sm">
        Passwort vergessen?
      </div>
      <div className='text-center'>
        <button type="submit" className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">
          Einloggen
        </button>
      </div>
    </form>
  );
}
 */
