"use client";

import Image from "next/image";
import { openPopup } from "@/store/slices/popupSlice";
import { useAppDispatch } from "@/store/store";
import SignInForm from "@/components/forms/signin-form";
import SignUpForm from "@/components/forms/signup-form";
import Popup from "@/components/popup";

export default function Login() {
  const dispatch = useAppDispatch();
  return (
    <>
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50 items-center"
      />
      <h1 className="md:text-5xl text-4xl text-secondary justify-center text-center">
        Generation-D Bewerbung
      </h1>
      <Popup />
      <div className="py-12 px-8 max-w-xl bg-[#FFFFFF] text-secondary space-y-4 rounded text-center">
        <p>
          Um eine neue Bewerbung zu starten, lege ein neues Konto an. Wenn du
          bereits ein Konto hast, logge dich ein um deine Bewerbung
          fortzusetzen.
        </p>
        <button
          type="button"
          onClick={() => dispatch(openPopup(<SignUpForm />))}
          className="apl-button-fixed"
        >
          Neues Konto anlegen
        </button>

        <p>Oder logge dich ein, um deine Bewerbung fortzusetzen</p>
        <div className="text-left">
          <SignInForm />
        </div>
      </div>
    </>
  );
}
