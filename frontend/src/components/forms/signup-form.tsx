"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signUpUser } from "@/actions/auth";
import { SubmitButton } from "../submitButton";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

interface messageType {
  message: string;
  status: string;
}

const initialState: messageType = {
  message: "",
  status: "",
};

type PasswordRequirement = {
  text: string;
  test: (pw: string) => boolean;
};

type PasswordRequirements = {
  minLength: PasswordRequirement;
  upperCase: PasswordRequirement;
  lowerCase: PasswordRequirement;
  number: PasswordRequirement;
  specialChar: PasswordRequirement;
};

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUpUser, initialState);
  const [password, setPassword] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const passwordRequirements: PasswordRequirements = {
    minLength: { text: "Mindestens 8 Zeichen", test: (pw) => pw.length >= 8 },
    upperCase: {
      text: "Mindestens ein großer Buchstabe",
      test: (pw) => /[A-Z]/.test(pw),
    },
    lowerCase: {
      text: "Mindestens ein kleiner Buchstabe",
      test: (pw) => /[a-z]/.test(pw),
    },
    number: { text: "Mindestens eine Zahl", test: (pw) => /[0-9]/.test(pw) },
    specialChar: {
      text: "Mindestens ein Sonderzeichen",
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const renderPasswordRequirements = () => {
    return (
      <>
        <h2 id="accordion-collapse-heading">
          <button
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isAccordionOpen}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm rtl:text-right text-gray-500 border ${
              isAccordionOpen && "border-b-0"
            } border-gray-200 focus:ring-4 focus:ring-gray-200`}
            data-accordion-target="#accordion-collapse-body"
            aria-controls="accordion-collapse-body"
          >
            <span className="italic">
              Klicken, um Passwortanforderungen anzuzeigen
            </span>
            <svg
              data-accordion-icon
              className={`w-3 h-3 shrink-0 ${isAccordionOpen && "rotate-180"}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div
          id="accordion-collapse-body"
          className={`${isAccordionOpen ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading"
        >
          <ul className="p-5 border border-gray-200">
            {Object.keys(passwordRequirements).map((key) => {
              const requirementKey = key as keyof PasswordRequirements;
              const requirement = passwordRequirements[requirementKey];
              const isSatisfied = requirement.test(password);
              return (
                <li
                  key={key}
                  className={`italic ${
                    password.length == 0
                      ? "text-gray-500"
                      : isSatisfied
                        ? "text-green-600"
                        : "text-red-600"
                  }`}
                >
                  - {requirement.text}
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Registriere dich!</h2>
      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            onChange={(e) => handlePasswordChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {renderPasswordRequirements()}
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort bestätigen
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="confirm-legal"
            name="confirm-legal"
            required
            className="w-5 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2"
          />
          <label htmlFor="confirm-legal" className="text-sm text-gray-700">
            <span className="text-red-500">*</span>Ich habe die{" "}
            <Link
              className="underline"
              href="https://generation-d.org/legal/"
              target="_blank"
            >
              Datenschutzerklärung
            </Link>{" "}
            gelesen und stimme dieser zu!
          </label>
        </div>
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message}
        </div>
        <SubmitButton text={"Registrieren"} expanded={true} />
      </form>
    </div>
  );
}
