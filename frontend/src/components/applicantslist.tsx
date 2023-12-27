"use client";

import { userData } from "@/actions/admin";
import { useAppSelector } from "@/store/store";

import ToggleSwitch from "./fields/toggleswitch";

const ApplicantsList: React.FC = () => {
  const usersGlobal = useAppSelector((state) => state.userReducer.users);

  const handleToggle = async (user: userData) => {
    return;
  };

  return (
    <div className="overflow-x-auto">
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
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Passed Phase?
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usersGlobal.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.updated_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <ToggleSwitch
                  isActive={user.isactive}
                  onClick={() => handleToggle(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;
