import React from "react";

function PageMainWrapper({ children }) {
  return (
    <div className="bg-white w-full mt-5 page-main-wrapper shadow-xl p-[20px]">
      <div className="md:w-1/2 w-full">{children}</div>
    </div>
  );
}

export default PageMainWrapper;
