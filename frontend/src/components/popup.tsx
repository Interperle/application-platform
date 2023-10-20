import { FC, ReactNode } from 'react';
import { closePopup } from '../store/slices/popupSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

type PopupProps = {
  children: ReactNode;
};

const Popup: FC<PopupProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.popupReducer.isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-4 relative">
            <button
              type="button"
              className="absolute top-0 right-0 p-4 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => dispatch(closePopup())}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Popup content */}
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;