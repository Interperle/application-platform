import React from "react";

export interface DropdownOptionProps {
  optionid: string;
  optiontext: string;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  optionid,
  optiontext,
}) => {
  return (
    <option key={optionid} value={optionid}>
      {optiontext}
    </option>
  );
};
