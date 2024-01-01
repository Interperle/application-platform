"use client";

import { ApplicantsStatus, finishEvaluationOfPhase, saveApplicationOutcome, userData } from "@/actions/admin";

import ToggleSwitch from "./fields/toggleswitch";
import { PhaseData } from "@/store/slices/phaseSlice";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseBrowserClient";
import { SubmitButton } from "./submitButton";

const ApplicantsList: React.FC<{ users: userData[]; phases: PhaseData[]; applicantsStatus: ApplicantsStatus[] }> = ({ users, phases, applicantsStatus }) => {
  const [currentAdminId, setCurrentAdminId] = useState<string>("")
  const [applicantsState, setApplicantsState] = useState<Record<string, boolean>>({})
  let renderedUnfinishedPhase = false;
  useEffect(() => {
    async function loadAnswer() {
      const { data: user, error: userError } = await supabase.auth.getUser()
      setCurrentAdminId(user?.user?.id || "");
    }
    loadAnswer();
  });

  useEffect(() => {
    // Initialize applicantsState based on applicantsStatus
    const newState: Record<string, boolean> = {};
    applicantsStatus.forEach(status => {
      newState[status.user_id] = status.outcome || false;
    });
    setApplicantsState(newState);
  }, [applicantsStatus]);

  const handleToggle = async (phase_id: string, user_id: string, applicantStatus: ApplicantsStatus | undefined) => {
    await saveApplicationOutcome(phase_id, user_id, applicantStatus, currentAdminId)
    setApplicantsState(prevState => ({
      ...prevState,
      [user_id]: !prevState[user_id]
    }));
  };

  return (
    <div className="overflow-x-auto">
      {phases.map((phase) => {
        if (phase.finished_evaluation !== null || !renderedUnfinishedPhase) {
          if (phase.finished_evaluation === null) {
            renderedUnfinishedPhase = true;
          }
          return (
            <div key={phase.phaseid}>
              <h3 className="text-l font-bold mb-4 mt-7">{phase.phaselabel}</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passed Phase?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed by
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    if (user.userrole > 1) {
                      return null;
                    }
                    const applicantStatus = applicantsStatus.find((status) => status.phase_id === phase.phaseid && status.user_id === user.id);
                    const reviewer = users.find((reviewer) => reviewer.id === applicantStatus?.reviewed_by);
                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <ToggleSwitch
                            isActive={applicantsState[user.id]}
                            onClick={() => handleToggle(phase.phaseid, user.id, applicantStatus)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reviewer?.email || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {applicantStatus?.review_date || ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-5 flex justify-end">
              <SubmitButton text={"Finish Evaluation"} expanded={false} onClick={(event) => finishEvaluationOfPhase(phase.phaseid)} />
              </div>
            </div>
          );
        }
        return null; // Return null if the phase should not be rendered
      })}
    </div>
  );
};

export default ApplicantsList;
