"use client";
import { Avatar, Text } from "@mantine/core";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const PreviewQR = ({ storeInfo }) => {
  const [logoPreview, setLogoPreview] = useState<any>("");

  useEffect(() => {
    if (!storeInfo?.logo) return;
    const file = storeInfo?.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);

    reader.readAsDataURL(file);
  }, []);

  return (
    <div
      className={`md:h-[720px] p-8 flex items-center justify-center`}
      style={{ backgroundColor: `${storeInfo?.qrTheme.primaryColor}` }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo and Restaurant Name */}
        <div className="flex items-center justify-center gap-2 text-white">
          <div
            className="w-12 h-12 bg-white flex items-center justify-center"
            style={{ borderRadius: storeInfo?.qrTheme.radius }}
          >
            {!logoPreview && (
              <Text color="cyan" className="rounded-full" fw={550}>
                {storeInfo?.name.slice(0, 2).toUpperCase()}
              </Text>
            )}

            {logoPreview && (
              <Image
                src={logoPreview}
                width={130}
                height={130}
                alt=""
                style={{ borderRadius: storeInfo?.qrTheme.radius }}
              />
            )}

            {/* </div> */}
          </div>
          <span
            className="text-xl font-semibold"
            style={{ fontSize: storeInfo?.qrTheme.titleFontSize || "16px" }}
          >
            {storeInfo?.name || "Your Store"}
          </span>
        </div>

        {/* Main Text */}
        <div className="space-y-4">
          <h1
            className={`text-6xl font-serif text-white font-bold`}
            style={{ color: storeInfo?.qrTheme.secondaryColor }}
          >
            {storeInfo?.qrTheme.primaryText}
          </h1>
          <div
            className=" text-white text-xl py-2 px-6 rounded-full inline-block"
            style={{ backgroundColor: storeInfo?.qrTheme.ctaColor }}
          >
            {storeInfo?.qrTheme.ctaText}
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-white w-48 h-48 mx-auto rounded-lg flex items-center justify-center">
          <img
            src="https://img.abyssale.com/574bfa75-c880-46be-97ae-599473818958"
            alt="sample qr"
          />

          {/* {qrCode && (
            <QRCode
              id="store-qr-code"
              value={qrCode}
              size={256}
              className="h-64 w-64"
            />
          )} */}
        </div>

        {/* Footer Text */}
        <p className="text-white text-sm max-w-xs mx-auto">
          For any assistance or special requests, feel free to ask our friendly
          staff. Enjoy your dining experience with us!
        </p>
        <Text c={"white"}>Powered by DigiMenu</Text>
      </div>
    </div>
  );
};

export default PreviewQR;
