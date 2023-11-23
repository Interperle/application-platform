import { RedirectType, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function fetch_phase_by_name(phaseName: string) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  const { data: phaseData, error: phaseError } = await supabase
    .from("phase_table")
    .select("*")
    .eq("phasename", phaseName)
    .single();
  // Redirection if error
  if (phaseError) {
    console.log("Error: " + phaseError + " -> Redirect");
    redirect("/", RedirectType.replace);
  }
  // Redirection if no phaseName
  if (!phaseData) {
    console.log("No data " + phaseData + " -> Redirect");
    redirect("/", RedirectType.replace);
  }
  return phaseData;
}

export async function fetch_all_phases() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data: phasesData, error: phasesError } = await supabase
    .from("phase_table")
    .select("*");
  if (phasesError) {
    console.log("Error: " + phasesError);
  }
  if (!phasesData) {
    console.log("No data " + phasesData);
  }
  return phasesData;
}

type Phase = {
  phaseid: string;
  phasename: string;
  phaseorder: number;
  startdate: string;
  enddate: string;
};

export async function extractCurrentPhase(currentTime: Date): Promise<Phase> {
  const phasesData = await fetch_all_phases();
  const sortedPhases = phasesData!.sort((a, b) => a.phaseorder - b.phaseorder);

  var previous_phase: Phase;
  previous_phase = {
    phaseid: "",
    phasename: "",
    phaseorder: -1,
    startdate: "",
    enddate: "",
  };
  for (const phase of sortedPhases) {
    const startDate = new Date(phase.startdate);
    const endDate = new Date(phase.enddate);

    if (currentTime < startDate) {
      return previous_phase;
    } else if (currentTime >= startDate && currentTime <= endDate) {
      return phase;
    }
    previous_phase = phase;
  }
  return previous_phase;
}
