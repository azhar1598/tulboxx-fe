import { Flex } from "@mantine/core";
import React from "react";
import QRCode from "react-qr-code";

const ReviewUI = () => {
  return (
    <div
      className="relative  mx-auto p-6 bg-white border shadow-lg rounded-xl overflow-hidden"
      style={{
        height: "200mm",
        width: "200mm", // Exact 10 cm
      }}
      id="print-qr"
    >
      {/* Colorful Borders */}
      <div className="absolute -top-0 -left-0 w-full h-full border-[15px] border-t-blue-500 border-r-red-500 border-b-green-500 border-l-yellow-500 rounded-xl pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-7xl font-bold text-gray-800">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </h1>

          <Flex
            gap={10}
            className="flex mt-1 items-center justify-between spacing-x-3"
          >
            <h2 className="text-2xl">Reviews</h2>
            <div className="mt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="text-yellow-400 text-lg">
                  &#9733;
                </span>
              ))}
            </div>
          </Flex>
        </div>

        {/* QR Code Section */}
        <div className="mt-4 flex justify-center">
          <div className="border-4 border-gray-300 rounded-md p-2">
            <QRCode value={""} size={256} className="h-64 w-64" />
          </div>
        </div>
        <p className="text-center mt-2 text-gray-600">
          Just Tap and Scan the QR and leave us a review
        </p>

        {/* Feedback Icons */}
        <div className="mt-4 flex justify-between">
          {["😡", "😟", "😐", "🙂", "😃"].map((emoji, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-3xl">{emoji}</span>
            </div>
          ))}
        </div>

        {/* Rating Bar */}
        <div className="flex items-center mt-4">
          <div className="w-full bg-gray-300 h-2 rounded-md overflow-hidden">
            <div className="bg-red-500 h-full" style={{ width: "20%" }}></div>
            <div
              className="bg-yellow-400 h-full"
              style={{ width: "20%" }}
            ></div>
            <div className="bg-gray-500 h-full" style={{ width: "20%" }}></div>
            <div className="bg-green-400 h-full" style={{ width: "20%" }}></div>
            <div className="bg-green-600 h-full" style={{ width: "20%" }}></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="font-bold text-red-500 text-lg">HELP US IMPROVE!</p>
          <p className="text-gray-500">We want your feedback</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewUI;
