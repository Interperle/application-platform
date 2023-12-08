"use client";

import { CircularProgress } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseBrowserClient";
import { User } from "@supabase/supabase-js";
import { updatePassword } from "@/actions/auth";
import { useFormState } from "react-dom";
import Apl_Header from "@/components/header";
import OverviewButton from "@/components/overviewButton";
import { useAppDispatch } from "@/store/store";
import { openPopup } from "@/store/slices/popupSlice";
import SubmitDeletionForm from "@/components/forms/submitDeletionForm";
import Popup from "@/components/popup";
import { SubmitButton } from "@/components/submitButton";
import Awaiting from "@/components/awaiting";
import PasswordRequirementsComponent from "@/components/passwordRequirements";

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data) {
        setUser(data.user);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const initialState = {
    message: "",
    status: "",
  };

  const [state, updatePasswordAction] = useFormState(
    updatePassword,
    initialState,
  );

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <span className="w-full">
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <OverviewButton />
        <h1 className="text-2xl font-bold mb-4">Einstellungen</h1>
        <Popup />

        <div>
          <label>Email: {Awaiting(isLoading, user?.email)}</label>
        </div>
        <form action={updatePasswordAction} className="my-4">
          {/* 
        <div>
            <label>Old Password</label>
            <input type="password" name='old_password' id='old_password' />
        </div> 
        */}
          <h3 className="py-2 text-xl">Ändere dein Passwort</h3>
          <div>
            <h4 className="py-1 text-base">Neues Passwort</h4>
            <input
              type="password"
              placeholder="********"
              name="new_password"
              id="new_password"
              onChange={(e) => handlePasswordChange(e)}
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
            />
          </div>
          <PasswordRequirementsComponent password={password} />
          <div className="mb-4">
            <h4 className="py-1 text-base">Passwort bestätigen</h4>
            <input
              type="password"
              placeholder="********"
              name="reenter_password"
              id="reenter_password"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
            />
          </div>
          <div
            className={`italic ${
              state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
            }`}
          >
            {state?.message}
          </div>
          <SubmitButton text={"Passwort ändern"} expanded={true} />
        </form>
        <h4 className="py-2 text-xl mb-3">Lösche deinen Account</h4>
        <button
          type="submit"
          className="apl-alert-button-fixed-big"
          onClick={() =>
            dispatch(
              openPopup(<SubmitDeletionForm email={user?.email || ""} />),
            )
          }
        >
          Account löschen
        </button>
      </div>
    </span>
  );
};

export default SettingsPage;
