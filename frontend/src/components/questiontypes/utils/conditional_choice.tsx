import React from "react";

export interface ChoiceProps {
  choiceid: string;
  choicetext: string;
  isSelected: boolean;
  iseditable: boolean;
  onSingleChange: () => void;
}

export const ConditionalChoice: React.FC<ChoiceProps> = ({
  choiceid,
  choicetext,
  isSelected,
  iseditable,
  onSingleChange,
}) => {
  return (
    <div key={choiceid} className="flex items-center mb-4">
        <input
          id={choiceid}
          name={choiceid}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          type="radio"
          className="w-5 h-4 text-secondary bg-gray-100 border-gray-300 focus:secondary focus:ring-2"
          checked={isSelected}
          onChange={onSingleChange}
          onClick={onSingleChange}
        />
      <label
        htmlFor={choiceid}
        className="ml-3 block text-sm font-medium text-secondary"
      >
        {choicetext}
      </label>
    </div>
  );
};
