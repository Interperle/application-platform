"use server";
import { createCurrentTimestamp } from "@/utils/helpers";
import { initSupabaseActions, supabaseServiceRole } from "@/utils/supabaseServerClients";
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
    return { ...currUser, isactive: !currUser.isactive };
  } catch (error) {
    console.error("Error toggling user status:", error);
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


export interface ApplicantsStatus {
  outcome_id: string;
  phase_id: string;
  user_id: string;
  outcome: boolean;
  reviewed_by: string;
  review_date: string;
}


export async function fetchAllApplicantsStatus() {
  const { data: applicantsStatusData, error: applicantsStatusError } = await initSupabaseActions()
    .from("phase_outcome_table")
    .select("*");
  if (applicantsStatusError) throw applicantsStatusError;
  return applicantsStatusData;
}


export async function saveApplicationOutcome(phase_id: string, user_id: string, applicantStatus: ApplicantsStatus | undefined, admin_id: string) {
  console.log(JSON.stringify(applicantStatus))
  console.log(phase_id)
  console.log(user_id)
  const supabase = await initSupabaseActions()
  if (applicantStatus === undefined) {
    const { data: applicantStatusData, error: applicantStatusError } = await supabase
      .from("phase_outcome_table")
      .insert({ "phase_id": phase_id, "user_id": user_id, "outcome": true, "reviewed_by": admin_id, "review_date": createCurrentTimestamp() });
  } else {
    const { data: applicantStatusData, error: applicantStatusError } = await supabase
      .from("phase_outcome_table")
      .update({ "outcome": !applicantStatus.outcome, "reviewed_by": admin_id, "review_date": createCurrentTimestamp() })
      .eq("outcome_id", applicantStatus.outcome_id);
  }
}


export async function finishEvaluationOfPhase(phase_id: string) {
  const { data: applicantStatusData, error: applicantStatusError } = await supabaseServiceRole
      .from("phase_table")
      .update({ "finished_evaluation": createCurrentTimestamp() })
      .eq("phaseid", phase_id);
}