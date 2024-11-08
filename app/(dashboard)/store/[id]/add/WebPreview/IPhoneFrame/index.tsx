import React from "react";

export const IPhoneFrame = ({ children }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-transsparent w-96">
      <div className="relative w-[350px] h-[650px] bg-black rounded-[45px] p-2 shadow-xl">
        {/* Device frame */}
        <div className="relative w-full h-full bg-white rounded-[35px] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-[14px] z-10 flex items-center justify-center">
            {/* Camera dot */}
            <div className="absolute right-[25%] w-[8px] h-[8px] bg-gray-900 rounded-full"></div>
          </div>

          {/* Main content area */}
          <div className="w-full h-full bg-white overflow-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneFrame;
