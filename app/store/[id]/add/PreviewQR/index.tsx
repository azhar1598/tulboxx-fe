"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PreviewQR = ({ storeInfo }) => {
  //   const { theme } = useParams();
  //   console.log("params", theme);
  //   const searchParams = useSearchParams();

  //   const [storeInfo, setStoreInfo] = useState(null);

  //   useEffect(() => {
  //     // Get the storeInfo parameter from the URL
  //     const storeInfoString = searchParams.get("storeInfo");

  //     if (storeInfoString) {
  //       try {
  //         // Parse the JSON string into an object
  //         const parsedStoreInfo = JSON.parse(storeInfoString);
  //         setStoreInfo(parsedStoreInfo);
  //       } catch (error) {
  //         console.error("Error parsing storeInfo:", error);
  //       }
  //     }
  //   }, [searchParams]);
  //   console.log("storeInfo,s", storeInfo);
  console.log("storeInfo", storeInfo);
  return (
    <div
      className={`md:h-[720px] p-8 flex items-center justify-center`}
      style={{ backgroundColor: `${storeInfo.themeColor}` }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo and Restaurant Name */}
        <div className="flex items-center justify-center gap-2 text-white">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
          </div>
          <span className="text-xl font-semibold">
            {storeInfo?.storeName || "Your Store"}
          </span>
        </div>

        {/* Main Text */}
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-white font-bold">
            Scan Here
          </h1>
          <div className="bg-orange-400 text-white text-xl py-2 px-6 rounded-full inline-block">
            To View Our Menu
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-white w-48 h-48 mx-auto rounded-lg flex items-center justify-center">
          {/* <span className="text-green-700 font-bold text-2xl text-center leading-tight">
            QR
            <br />
            CODE
            <br />
            HERE
          </span> */}
          <img src="https://img.abyssale.com/574bfa75-c880-46be-97ae-599473818958" />
        </div>

        {/* Footer Text */}
        <p className="text-white text-sm max-w-xs mx-auto">
          For any assistance or special requests, feel free to ask our friendly
          staff. Enjoy your dining experience with us!
        </p>
      </div>
    </div>
  );
};

export default PreviewQR;
