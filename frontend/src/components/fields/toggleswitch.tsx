import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onClick: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onClick}) => {
  return (
    <div 
        onClick={onClick}
        className={`cursor-pointer w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${isActive ? 'bg-green-400' : ''}`}>
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isActive ? 'translate-x-6' : ''}`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
