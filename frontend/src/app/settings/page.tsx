"use client";
// pages/settings.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase_client";
import { User } from "@supabase/supabase-js";
import { deleteUser, updatePassword } from "@/actions/auth";
import { useFormStatus, useFormState } from "react-dom";

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const initialState = {
    message: "",
  };

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <button
        type="submit"
        aria-disabled={pending}
        className="apl-button-expanded"
      >
        Password ändern
      </button>
    );
  }
  const [state, updatePasswordAction] = useFormState(
    updatePassword,
    initialState,
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        <label>Email: {user?.email}</label>
      </div>
      <form action={updatePasswordAction} className="my-4">
        {/* 
                <div>
                    <label>Old Password</label>
                    <input type="password" name='old_password' id='old_password' />
                </div> 
                */}
        <div>
          <label>New Password</label>
          <input type="password" name="new_password" id="new_password" />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            name="reenter_password"
            id="reenter_password"
          />
        </div>
        <SubmitButton />
      </form>
      <form action={deleteUser}>
        <button
          type="submit"
          className="apl-button-fixed bg-red-500 text-white"
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
