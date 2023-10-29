import React from 'react';

export interface DropdownOptionProps {
    optionId: string;
    optionText: string;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({ optionId, optionText }) => {
    return (
        <option key={optionId} value={optionId}>
            {optionText}
        </option>
    );
};