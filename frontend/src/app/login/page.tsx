"use client"
import Image from 'next/image'
import SignInForm from '@/utils/forms/signin-form'
import SignUpForm from '@/utils/forms/signup-form'
import { openPopup } from '@/store/slices/popupSlice';
import Popup from '@/components/popup'
import { useAppDispatch } from '@/store/store'

export default function Login() {
  const dispatch = useAppDispatch();
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
        <button type="button" onClick={() => dispatch(openPopup())} className="border rounded px-4 py-2 text-[#FDCC89] bg-[#153757]">
          Neues Konto anlegen
        </button>
        <div  className='text-left'>
          <Popup>
            <SignUpForm/>
          </Popup>
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
