"use client"
import Image from 'next/image'
import SignInForm from '@/utils/forms/signin-form'
import SignUpPopup from '@/components/signupPopup'
import PasswordResetForm from '@/utils/forms/passwortreset-form'
import SignUpForm from '@/utils/forms/signup-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SetStateAction, useState } from 'react'

export default function Login() {
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);

  return (
    <main className="grid-cols-1 flex flex-col items-center justify-between space-y-6">
      <Image src="/logos/gend_img.png" width={80} height={80} alt="Generation-D Image Logo" className="max-w-50 max-h-50" />
      <h1 className="text-5xl text-[#153757]">
        Generation-D Bewerbung
      </h1>
      <div className="py-12 px-8 max-w-xl bg-[#FFFFFF] text-[#153757] space-y-4 rounded text-center">
        <p>
          Um eine neue Bewerbung zu starten, lege ein neues Konto an. Wenn du bereits ein Konto hast, logge dich ein um deine Bewerbung fortzusetzen.
        </p>
        <button type="button" onClick={() => setShowSignUpPopup(true)} className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">
          Neues Konto anlegen
        </button>
        <div  className='text-left'>
          {showSignUpPopup && <SignUpPopup onClose={() => setShowSignUpPopup(false)} isOpen={true} />}
        </div>
        <p>
          Oder logge dich ein, um deine Bewerbung fortzusetzen
        </p>
        <div className='text-left'>
          <SignInForm/>
        </div>
        
      </div>
    </main>
  )

}
