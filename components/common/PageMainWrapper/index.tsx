import React from "react";

function PageMainWrapper({ children, w = "1/2" }) {
  return (
    <div className="bg-white w-full mt-5 page-main-wrapper shadow-xl p-[20px]">
      <div className={`md:w-${[w]} w-full`}>{children}</div>
    </div>
  );
}

export default PageMainWrapper;
