"use client"
// pages/settings.tsx
import React, { useEffect, useState } from 'react';
import {supabase} from '@/utils/supabase_client';
import { User } from '@supabase/supabase-js';
import { deleteUser, updatePassword } from '@/actions/auth';
import { useFormStatus, useFormState } from 'react-dom';

const SettingsPage: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
      }
      
    function SubmitButton(){
        const { pending } = useFormStatus()
        
        return (
            <button type="submit" aria-disabled={pending} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Password ändern</button>
        )
    }
    const [state, updatePasswordAction] = useFormState(updatePassword, initialState)


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
                    <input type="password" name='new_password' id='new_password' />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input type="password" name='reenter_password' id='reenter_password' />
                </div>
                <SubmitButton />
            </form>
            <form action={deleteUser}>
                <button type='submit' className="bg-red-500 text-white p-2 rounded">
                    Delete Account
                </button>
            </form>
        </div>
    );
};

export default SettingsPage;
