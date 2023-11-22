"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signOutUser } from "@/actions/auth";

const Apl_Header: React.FC = () => {
  const initialState = {
    message: "",
  };
  const [state, signOutAction] = useFormState(signOutUser, initialState);
  return (
    <div className="w-full bg-white h-24 flex items-center justify-between p-4 md:p-6">
      <div className="min-w-[20px] max-w-[200px]">
        <Link href="https://generation-d.org" target="_blank">
          <Image
            src="/logos/gend_img_font.png"
            alt="Generation-D Logo"
            className="max-w-full h-auto"
            width={200}
            height={24}
          />
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/faqs">
          <span className="text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-#537575">
            FAQs
          </span>
        </Link>
        <Link href="/settings">
          <span className="text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-#537575">
            Settings
          </span>
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="apl-button-fixed">
            Ausloggen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apl_Header;
