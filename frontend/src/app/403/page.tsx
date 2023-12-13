"use client"

import { supabase } from "@/utils/supabaseBrowserClient";
import { useEffect } from "react";

const Custom403: React.FC = () => {
    useEffect(() => {
        const signOut = async () => {
            const { error } = await supabase.auth.signOut();
        };
        signOut();
    });
    return <div>Dein Account wurde deaktiviert! Bitte wende dich an 'it-ressort@generation-d.org' für weitere Fragen.</div>;
};
  
export default Custom403;
