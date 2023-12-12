"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseBrowserClient";
import { User } from "@supabase/supabase-js";
import OverviewButton from "@/components/overviewButton";
import { useAppDispatch } from "@/store/store";
import { openPopup } from "@/store/slices/popupSlice";
import SubmitDeletionForm from "@/components/forms/submitDeletionForm";
import Popup from "@/components/popup";
import Awaiting from "@/components/awaiting";
import CircularProgress from "@mui/material/CircularProgress";
import SendPasswordResetForm from "@/components/forms/sendPasswordReset-form";
import Apl_Header from "@/components/header";

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
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
        <h3 className="py-2 text-xl">Ändere dein Passwort</h3>
        <div>
          <h2>
            Zum Zurücksetzen deines Passworts wird dir ein Passwort zurücksetzen
            Link an obige Email Adresse gesendet
          </h2>
          {user?.email == undefined ? (
            <CircularProgress size={"1rem"} />
          ) : (
            <SendPasswordResetForm email={user!.email!} />
          )}
        </div>
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
