"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useFormState } from "react-dom";
import { signOutUser } from "@/actions/auth";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggle } from "@/store/slices/menuSlice";
import { SubmitButton } from "./submitButton";

const Apl_Header: React.FC = () => {
  const initialState = {
    message: "",
    status: "",
  };
  const [state, signOutAction] = useFormState(signOutUser, initialState);
  const isMenuOpen = useAppSelector((state) => state.menuReducer.isOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full bg-white h-24 flex items-center justify-between p-4 md:p-6">
      <div className="min-w-[20px] max-w-[200px] h-auto">
        <Link href="https://generation-d.org" target="_blank">
          <Image
            src="/logos/gend_img_font.png"
            alt="Generation-D Logo"
            className="max-w-full h-auto"
            priority={true}
            width={200}
            height={34}
            style={{minWidth: "20px", maxWidth: "200px", maxHeight: "34px" }}
          />
        </Link>
      </div>
      <div className="md:hidden">
        <button
          onClick={() => dispatch(toggle())}
          className="p-2 focus:outline-none focus:shadow-outline"
        >
          <div className="block w-6 h-1 bg-secondary rounded-md"></div>
          <div className="block w-6 h-1 bg-secondary my-1.5 rounded-md"></div>
          <div className="block w-6 h-1 bg-secondary rounded-md"></div>
        </button>
      </div>
      <div
        className={`${
          isMenuOpen
            ? "border space-y-2 absolute bg-white right-10 top-24 z-10 p-4 flex flex-col justify-center"
            : "hidden md:flex items-center"
        } space-x-4`}
      >
        <Link href="/faqs">
          <span className="text-secondary block text-center">FAQs</span>
        </Link>
        <Link href="/settings">
          <span className="text-secondary block text-center">
            Einstellungen
          </span>
        </Link>
        <form action={signOutAction}>
          <SubmitButton text={"Ausloggen"} expanded={false} />
          <div className={`italic text-red-600`}>{state?.message}</div>
        </form>
      </div>
    </div>
  );
};

export default Apl_Header;
