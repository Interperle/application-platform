import SignUpForm from '@/utils/forms/signup-form';

interface SignUpPopupProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
const SignUpPopup: React.FC<SignUpPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <button onClick={onClose} className="mt-4 p-2 rounded text-[#153757]">Close</button>
        <SignUpForm/>
      </div>
    </div>
  );
}

export default SignUpPopup;