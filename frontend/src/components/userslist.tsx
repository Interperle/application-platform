"use client";

import {
  changeRoleOfUser,
  toggleStatusOfUser,
  userData,
} from "@/actions/admin";
import {
  toggleUserActive,
  changeUserRole,
  setUsers,
} from "@/store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UserRole } from "@/utils/userRole";

import { UserSpecificRoleDropdown } from "./fields/dropdown";
import ToggleSwitch from "./fields/toggleswitch";

interface UserListProps {
  users: userData[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const dispatch = useAppDispatch();
  dispatch(setUsers(users));
  const usersGlobal = useAppSelector((state) => state.userReducer.users);

  const handleToggle = async (user: userData) => {
    const updatedUser = await toggleStatusOfUser(user);
    if (updatedUser) {
      dispatch(toggleUserActive(updatedUser.id));
    } else {
      throw Error("Some Error in toggling the Status of Users");
    }
  };

  const handleRoleChange = async (user: userData, newRoleId: UserRole) => {
    console.log("Trigger");
    const updatedUser = await changeRoleOfUser(user, newRoleId);
    if (updatedUser) {
      dispatch(
        changeUserRole({
          userId: updatedUser.id,
          newRole: updatedUser.userrole,
        }),
      );
    } else {
      throw new Error("Some Error in toggling the Status of Users");
    }
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
              Last Sign-in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
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
                {user.last_sign_in_at || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.provider}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.created_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.updated_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <UserSpecificRoleDropdown
                  user={user}
                  onRoleChange={(newRole: UserRole) =>
                    handleRoleChange(user, newRole).catch(console.error)
                  }
                />
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

export default UserList;
