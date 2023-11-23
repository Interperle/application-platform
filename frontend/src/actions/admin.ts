"use server";
import { toggleUserActive } from "@/store/slices/usersSlice";
import { useAppDispatch } from "@/store/store";
import { supabaseServiceRole } from "@/utils/supabase_servicerole";
import { UserRole } from "@/utils/userRole";

export interface userData {
  id: string;
  email: string;
  last_sign_in_at: string;
  provider: string;
  created_at: string;
  updated_at: string;
  userrole: UserRole;
  isactive: boolean;
}

function mergeUserDatas(users: any[], userProfiles: any[]): userData[] {
  return users.map((user) => {
    const correspondingItem = userProfiles.find(
      (profile) => profile.userid === user.id,
    );

    return {
      id: user.id,
      email: user.email,
      last_sign_in_at: user.last_sign_in_at,
      provider: user.app_metadata?.provider,
      created_at: user.created_at,
      updated_at: user.updated_at,
      userrole: correspondingItem?.userrole || 0,
      isactive: correspondingItem?.isactive || false,
    };
  });
}

export async function fetchAllUsers() {
  const {
    data: { users },
    error,
  } = await supabaseServiceRole.auth.admin.listUsers();
  const { data: profileData, error: profileError } = await supabaseServiceRole
    .from("user_profiles_table")
    .select("*");
  if (profileError) throw profileError;
  return mergeUserDatas(users, profileData!);
}

export async function toggleStatusOfUser(currUser: userData) {
  try {
    const { data: userProfileData, error: userProfileError } =
      await supabaseServiceRole
        .from("user_profiles_table")
        .update({ isactive: !currUser.isactive })
        .eq("userid", currUser.id);

    if (userProfileError) {
      throw userProfileError;
    }

    console.log({ ...currUser, isactive: !currUser.isactive });
    return { ...currUser, isactive: !currUser.isactive };
  } catch (error) {
    console.error("Error toggling user status:", error);
    // Handle the error appropriately
    // You might want to return 'null' or the error itself
    return null;
  }
}

export async function changeRoleOfUser(currUser: userData, role: UserRole) {
  try {
    const { data: userProfileData, error: userProfileError } =
      await supabaseServiceRole
        .from("user_profiles_table")
        .update({ userrole: role.valueOf() })
        .eq("userid", currUser.id);

    if (userProfileError) {
      console.log("Didn't change Userrole");
      throw userProfileError;
    }
    console.log("Changed Userrole");
    return { ...currUser, userrole: role.valueOf() };
  } catch (error) {
    console.error("Error changing user status:", error);
    // Handle the error appropriately
    // You might want to return 'null' or the error itself
    return null;
  }
}
