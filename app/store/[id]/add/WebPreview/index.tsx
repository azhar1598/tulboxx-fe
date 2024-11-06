"use client";
import React, { useState, useEffect } from "react";
import { Card, Group } from "@mantine/core";
import {
  IconChevronRight,
  IconMenu2,
  IconSearch,
  IconShoppingCart,
} from "@tabler/icons-react";
import Image from "next/image";
import StoreLogo from "../../../../../public/assets/default-store-logo.png";

const WebPreview = ({ storeInfo }) => {
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!storeInfo?.logo) return;
    const file = storeInfo.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);

    reader.readAsDataURL(file);
  }, []);

  return (
    // Container wrapper
    <>
      {/* <div className="md:w-[390px] w-full overflow-hidden  absolute top-0 left-0 "> */}

      <div
        className="flex flex-col min-h-screen  overflow-scroll flex justify-center md:w-[390px] w-full  absolute top-0 left-0"
        style={{ backgroundColor: storeInfo?.website.primaryColor }}
      >
        <div className="w-full relative ">
          <div className="  w-full  z-20  flex justify-center items-center">
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
                <Image
                  src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/resturant-menu-video-design-template-64d136abd3ffe2ca6d32b6a9297e56a7_screen.jpg?ts=1637036712"
                  width={530}
                  height={130}
                  alt=""
                />
                <img
                  src="https://content.wepik.com/statics/29838533/preview-page0.jpg"
                  width={530}
                  height={130}
                  alt=""
                />
              </Group>
            </div>
          </div>
        </div>

        <footer className="bg-gray-800 text-white py-6 px-4 text-sm">
          <div className="flex flex-col space-y-4">
            {/* About Us */}
            <div className="">
              <h2 className="font-semibold text-lg">About Us</h2>
              <p className="mt-1 text-gray-400">
                We are dedicated to providing the best services to our
                customers. Your satisfaction is our priority.
              </p>
            </div>

            {/* Location */}
            <div className="">
              <h2 className="font-semibold text-lg">Location</h2>
              <p className="mt-1 text-gray-400">
                123 Main Street, City, Country
              </p>
            </div>

            {/* Opening Hours */}
            <div className="">
              <h2 className="font-semibold text-lg">Opening Hours</h2>
              <p className="mt-1 text-gray-400">
                Monday - Sunday: 9:00 AM - 8:00 PM
              </p>
            </div>

            {/* Copyright & Powered By */}
            <div className=" border-t border-gray-700 pt-4 w-full">
              <p className="text-gray-500">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
              <p className="text-gray-500 mt-1">Powered by Your Company</p>
            </div>
          </div>
        </footer>
      </div>

      {/* </div> */}
    </>
  );
};

export default WebPreview;
