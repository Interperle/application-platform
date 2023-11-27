import React from "react";

export interface ChoiceProps {
  choiceid: string;
  choicetext: string;
  isSelected: boolean;
  mandatory: boolean;
  onChange: () => void;
}

export const Choice: React.FC<ChoiceProps> = ({
  choiceid,
  choicetext,
  isSelected,
  mandatory,
  onChange,
}) => {
  return (
    <div key={choiceid} className="flex items-center mb-2">
      {mandatory ? (
        <input
          id={choiceid}
          name={choiceid}
          type="radio"
          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          checked={isSelected}
          onChange={onChange}
        />
      ) : (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onChange}
          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
        />
      )}
      <label
        htmlFor={choiceid}
        className="ml-3 block text-sm font-medium text-gray-700"
      >
        {choicetext}
      </label>
    </div>
  );
};
