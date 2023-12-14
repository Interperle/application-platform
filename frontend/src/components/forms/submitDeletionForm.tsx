"use client";

import { useState } from "react";

import router from "next/router";
import { useFormStatus } from "react-dom";

import { deleteUser } from "@/actions/auth";
import { useAppDispatch } from "@/store/store";

interface messageType {
  message: string;
  status: string;
}

const initialState: messageType = {
  message: "",
  status: "",
};

export default function SubmitDeletionForm({
  email,
}: {
  email: string | null;
}) {
  const dispatch = useAppDispatch();
  const [state, setState] = useState(initialState);

  const { pending } = useFormStatus();
  const handleDelete = async () => {
    try {
      const response = await deleteUser();
      setState(response);
      //setTimeout(() => {
      //  dispatch(closePopup());
      //}, 10000);
      setTimeout(() => {
        router.push("/login");
      }, 10000);
    } catch (error) {
      console.error("Error during user deletion:", error);
      setState({
        message:
          "Leider ist ein Fehler aufgetreten, bitte probier es nocheinmal",
        status: "ERROR",
      });
    }
  };

  return (
    <div>
      <form>
        <h4 className="py-2 text-xl mb-3">Löschen bestätigen</h4>
        <div>
          Bist du dir sicher, dass du den folgenden User löschen willst?
        </div>
        <div>{email}</div>
        <button
          disabled={pending}
          aria-disabled={pending}
          type="submit"
          className="apl-alert-button-fixed mt-3"
          onClick={handleDelete}
        >
          <div
            className={`italic ${
              state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
            }`}
          >
            {state?.message}
          </div>
          {pending ? "Bitte warten..." : "Account löschen"}
        </button>
      </form>
    </div>
  );
}
