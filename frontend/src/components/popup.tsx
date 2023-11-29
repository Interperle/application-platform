import { FC } from "react";
import { closePopup } from "../store/slices/popupSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const Popup: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.popupReducer.isOpen);
  const content = useAppSelector((state) => state.popupReducer.content);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        {/* Use of `sm:align-middle` helps vertically center the content */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        {/* The main popup container adjusts its size based on content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-4 relative overflow-y-auto">
            {" "}
            {/* Added overflow-y-auto for scrollable content */}
            {/* Close button */}
            <button
              type="button"
              className="absolute top-0 right-0 p-4 bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => dispatch(closePopup())}
            >
              <span >Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Content container */}
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
