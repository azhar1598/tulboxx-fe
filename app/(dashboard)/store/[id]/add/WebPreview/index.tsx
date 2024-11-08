import React, { useState, useEffect } from "react";
import { Card, Group, Text } from "@mantine/core";
import {
  IconChevronRight,
  IconMenu2,
  IconSearch,
  IconShoppingCart,
} from "@tabler/icons-react";
import Image from "next/image";
import StoreLogo from "../../../../../public/assets/default-store-logo.png";
import mobilePreview from "@/public/assets/placeholders/mobile-preview.png";
import IPhoneFrame from "./IPhoneFrame";

const MobileWebPreview = ({ storeInfo }) => {
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!storeInfo?.logo) return;
    const file = storeInfo.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);

    reader.readAsDataURL(file);
  }, []);

  // Function to format time as AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const groupedHours = storeInfo?.businessHours.reduce((acc, hour) => {
    const { day, openTime, closeTime } = hour;
    const key = `${openTime}-${closeTime}`;
    if (!acc[key]) {
      acc[key] = {
        days: [day],
        openTime,
        closeTime,
      };
    } else {
      acc[key].days.push(day);
    }
    return acc;
  }, {});

  return (
    <IPhoneFrame>
      <div
        className="flex flex-col min-h-screen overflow-auto w-[340px] rounded-xl overflow-scroll"
        style={{ backgroundColor: storeInfo?.website.primaryColor }}
      >
        <div className="w-full relative ">
          <div className=" w-full z-20 flex justify-center items-center">
            {!logoPreview && (
              <div
                className="w-12 h-12 bg-white flex items-center justify-center mt-[20px]"
                style={{ borderRadius: storeInfo?.qr.radius }}
              >
                <Text color="cyan" className="rounded-full" fw={550}>
                  {storeInfo?.name.slice(0, 2).toUpperCase()}
                </Text>
              </div>
            )}
            {logoPreview && (
              <Image
                src={logoPreview}
                width={130}
                height={130}
                alt=""
                style={{ marginTop: "20px" }}
                className="rounded-full"
              />
            )}
          </div>

          <div className="relative pt-[10px]">
            <div
              className="rounded-t-3xl min-h-screen"
              style={{ backgroundColor: storeInfo?.website.secondaryColor }}
            >
              <div className="px-4 py-4">
                <h1 className="text-white text-3xl font-bold text-center mb-2">
                  {storeInfo?.name}
                </h1>
                <p className="text-white/80 text-center mb-2">
                  {storeInfo?.tagline}
                </p>
              </div>

              <Group gap={0} className=" rounded-t-3xl px-1">
                {storeInfo?.menuImages.map((img, index) => (
                  <Image
                    src={img.preview}
                    width={530}
                    height={130}
                    alt=""
                    key={index}
                  />
                ))}
              </Group>
            </div>
          </div>
        </div>

        <footer className="bg-gray-800 text-white py-6 px-4 text-sm">
          <div className="flex flex-col space-y-4">
            <div className="">
              <h2 className="font-semibold text-lg">About Us</h2>
              <p className="mt-1 text-gray-400">{storeInfo?.description}</p>
            </div>

            <div className="">
              <h2 className="font-semibold text-lg">Location</h2>
              <p className="mt-1 text-gray-400">
                {storeInfo?.address},{storeInfo?.city},{storeInfo?.state},
                {storeInfo?.pincode}.
              </p>
            </div>

            <div className="">
              <h2 className="font-semibold text-lg">Our Timings</h2>

              {groupedHours &&
                Object?.values(groupedHours).map(
                  ({ days, openTime, closeTime }) => (
                    <p
                      className="mt-1 text-gray-400"
                      key={`${openTime}-${closeTime}`}
                    >
                      {days.length > 1
                        ? `${days.slice(0, -1).join(", ")} and ${
                            days[days.length - 1]
                          }`
                        : days[0]}
                      : {formatTime(openTime)} - {formatTime(closeTime)}
                    </p>
                  )
                )}
            </div>

            <div className=" border-t border-gray-700 pt-4 w-full">
              <p className="text-gray-500">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
              <p className="text-gray-500 mt-1">Powered by Your Company</p>
            </div>
          </div>
        </footer>
      </div>
    </IPhoneFrame>
  );
};

export default MobileWebPreview;
