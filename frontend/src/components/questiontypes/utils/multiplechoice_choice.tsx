import React from "react";

export interface ChoiceProps {
  choiceid: string;
  choicetext: string;
}

export const Choice: React.FC<ChoiceProps> = ({
  choiceid: choiceId,
  choicetext: choicetext,
}) => {
  return (
    <div key={choiceId} className="flex items-center mb-2">
      <input
        id={choiceId}
        name={choiceId}
        type="radio"
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
      />
      <label
        htmlFor={choiceId}
        className="ml-3 block text-sm font-medium text-gray-700"
      >
        {choicetext}
      </label>
    </div>
  );
};
