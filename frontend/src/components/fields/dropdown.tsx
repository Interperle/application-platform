import React from "react";

import { userData } from "@/actions/admin";
import { UserRole } from "@/utils/userRole";

interface DropdownProps<T extends Record<string, string | number>> {
  enum: T;
  currentOption: T[keyof T];
  onChange: (newOption: T[keyof T]) => void;
}

function Dropdown<T extends Record<string, string | number>>({
  enum: enumObj,
  currentOption,
  onChange,
}: DropdownProps<T>) {
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = parseInt(
      event.target.value,
      10,
    ) as unknown as T[keyof T];
    onChange(selectedOption);
  };

  return (
    <select
      value={String(currentOption)}
      onChange={handleOptionChange}
      className="form-select"
    >
      {Object.entries(enumObj)
        .filter(([key]) => !isNaN(parseInt(key)))
        .map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
    </select>
  );
}

interface UserSpecificRoleDropdownProps {
  user: userData;
  onRoleChange: (newRole: UserRole) => void;
}

export const UserSpecificRoleDropdown: React.FC<
  UserSpecificRoleDropdownProps
> = ({ user, onRoleChange }) => {
  return (
    <Dropdown
      enum={UserRole}
      currentOption={user.userrole}
      onChange={onRoleChange}
    />
  );
};

export default Dropdown;
