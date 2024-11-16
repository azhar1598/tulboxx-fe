"use client";
// import Credits from "@/components/common/Credits";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Indicator,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
  IconClock,
  IconInfoSquare,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import BookPageComponent from "./MenuBook";
// import MenuBookModal from "./MenuBook";
import { useDisclosure } from "@mantine/hooks";
import MenuImage from "../../../../public/assets/auth/menu.png";
import MenuCarousel from "./MenuCarousel";
// import RestaurantMenuCard from "@/app/new-page/RestaurantMenu";
// import RestaurantMenu2 from "@/app/new-page/RestautrantMenu2";

function WebPreview({ storeInfo }: any) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // const [storeInfo, setStoreInfo] = useState({
  //   menuImages: [
  //     "https://marketplace.canva.com/EAFwRADHMsM/1/0/1035w/canva-orange-and-black-bold-geometric-restaurant-menu-AX4bhelWqNA.jpg",
  //     "https://marketplace.canva.com/EAFZawUn7mU/1/0/1131w/canva-black-and-red-modern-food-menu-bu62Mi5HBkk.jpg",
  //   ],
  // });

  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (!showCarousel) return;

      switch (e.key) {
        case "ArrowRight":
          setSelectedImageIndex((prev) =>
            prev === (storeInfo?.menuImages?.length || 0) - 1 ? 0 : prev + 1
          );
          break;
        case "ArrowLeft":
          setSelectedImageIndex((prev) =>
            prev === 0 ? (storeInfo?.menuImages?.length || 0) - 1 : prev - 1
          );
          break;
        case "Escape":
          setShowCarousel(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showCarousel, storeInfo?.menuImages?.length]);

  const groupedHours = storeInfo?.businessHours?.reduce((acc, hour) => {
    const { day, openTime, closeTime } = hour;
    const key = `${openTime}-${closeTime}`;
    if (!acc[key]) {
      acc[key] = { days: [day], openTime, closeTime };
    } else {
      acc[key].days.push(day);
    }
    return acc;
  }, {});

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes
      ?.toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const [storeLogo, setStoreLogo] = useState("");

  useEffect(() => {
    if (!storeInfo.logo) return;
    console.log("sss", storeInfo.logo[0]);
    setStoreLogo(URL.createObjectURL(storeInfo.logo));
  }, [storeInfo]);

  return (
    <Stack>
      <div
        className="relative max-w-500 bg-image bg-center bg-cover bg-no-repeat  bg-black/70  backdrop-blur-sm"
        style={{
          backgroundImage: `url(${storeInfo?.websiteTheme?.backgroundImage})`,
        }}
      >
        {/* <img
          src="/assets/auth/rest2.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover mt"
        / */}

        {/* Black Overlay */}
        {/* <div className="absolute inset-0 bg-black/60" /> */}
        {/* <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div> */}

        <Stack align="center" pt={20}>
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center ">
            {!storeLogo ? (
              <span className="text-xl font-bold text-white">
                {" "}
                {storeInfo?.name.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <Image
                src={storeLogo}
                alt="logo here"
                width={100}
                height={100}
                style={{ borderRadius: "100px" }}
                className="rouned-full"
              />
            )}
          </div>

          {/* Restaurant Name */}

          <Indicator color="green" position="top-end" processing>
            <h1
              className="text-lg font-bold text-white px-2 "
              style={{ color: storeInfo?.websiteTheme?.titleColor }}
            >
              {storeInfo?.name}
            </h1>
          </Indicator>

          <p
            className="text-gray-400 -mt-3"
            style={{ color: storeInfo?.websiteTheme?.taglineColor }}
          >
            {" "}
            {storeInfo?.tagLine}
          </p>

          {/* <Badge
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "6px 2px 6px 2px",
              borderRadius: "5px",
              height: "20px",
              width: "100px",
              fontWeight: 550,
            }}
            fs={"8px"}
            onClick={() => setShowCarousel(true)}
          >
            STORE OPEN
          </Badge> */}

          {/* <MenuBookModal opened={opened} close={close} /> */}
          <MenuCarousel
            storeInfo={storeInfo}
            currentIndex={selectedImageIndex}
            onClose={() => setShowCarousel(false)}
          />
          {/* <RestaurantMenuCard /> */}
          {/* <RestaurantMenu2 /> */}

          <Stack
            gap={0}
            className="flex flex-col items-center justify-center  bottom-0 w-full bg-black/60  backdrop-blur-sm"
          >
            <Flex
              direction="column"
              align="flex-start"
              gap="sm"
              p={20}
              //   className="bg-black/30 backdrop-blur-xs"
              //   bg={"black"}
            >
              <Flex gap={10}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: storeInfo?.websiteTheme.primaryColor,
                    borderRadius: "50%",
                    filter: "blur(10px)",
                    width: "30px",
                  }}
                ></Box>
                <IconInfoSquare
                  style={{ position: "absolute", left: 22 }}
                  color={storeInfo?.websiteTheme.primaryColor}
                  stroke={2}
                />

                <Text size="lg" fw={600} color="white">
                  About Us
                </Text>
              </Flex>
              <Box>
                <Text size="sm" color="gray.3" w="300px">
                  {storeInfo?.description}
                </Text>
              </Box>
            </Flex>
            <Flex
              direction="column"
              align="flex-start"
              gap="sm"
              p={20}
              //   className="bg-black/60 backdrop-blur-xs"
              //   bg={"black"}
            >
              <Flex gap={10}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: storeInfo?.websiteTheme.primaryColor,
                    borderRadius: "50%",
                    filter: "blur(10px)",
                    width: "30px",
                  }}
                ></Box>
                <IconMapPin
                  // size={24}
                  style={{ position: "absolute", left: 22 }}
                  color={storeInfo?.websiteTheme.primaryColor}
                  stroke={1.5}
                />
                <Text size="lg" fw={600} color="white" ta="left">
                  Our Location
                </Text>
              </Flex>
              <Text size="sm" color="gray.3" ta="left" w="300px">
                {storeInfo?.address}, {storeInfo?.city},
                <br />
                {storeInfo?.state}, {storeInfo?.pincode}.
              </Text>
            </Flex>
            <Flex
              direction="column"
              align="flex-start"
              gap="sm"
              p={20}
              //   className="bg-black/60 backdrop-blur-xs"
              //   bg={"black"}
            >
              <Flex gap={10}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: storeInfo?.websiteTheme.primaryColor,
                    borderRadius: "50%",
                    filter: "blur(10px)",
                    width: "30px",
                  }}
                ></Box>
                <IconClock
                  style={{ position: "absolute", left: 22, marginTop: "5px" }}
                  color={storeInfo?.websiteTheme.primaryColor}
                  stroke={1.5}
                />
                <h2 className="text-lg font-semibold text-white mb-3 text-s">
                  Business Hours
                </h2>
              </Flex>

              {groupedHours &&
                Object.values(groupedHours).map(
                  ({ days, openTime, closeTime }) => (
                    <div
                      key={`${openTime}-${closeTime}`}
                      className="text-white/80"
                    >
                      <span className="font-medium">
                        {days.length > 1
                          ? `${days.slice(0, -1).join(", ")} and ${
                              days[days.length - 1]
                            }`
                          : days[0]}
                      </span>
                      : {formatTime(openTime)} - {formatTime(closeTime)}
                    </div>
                  )
                )}
            </Flex>

            <Group
              gap="md"
              align="center"
              c={"white"}
              justify="left"
              //   bg={"black"}
              p={20}
            >
              <Group
                component="a"
                // href="mailto:ts.cafesouth.av@email.com"
                style={(theme: any) => ({
                  color: theme.colors.gray[4],
                  textDecoration: "none",
                  transition: "color 200ms ease",
                  "&:hover": {
                    color: "white",
                  },
                })}
              >
                <IconMail size={20} />
                <Text size="sm">ts.cafesouth.av@email.com</Text>
              </Group>
              <Group
                gap="xs"
                component="a"
                // href="tel:+6531192890"
                style={(theme: any) => ({
                  color: theme.colors.gray[4],
                  textDecoration: "none",
                  transition: "color 200ms ease",
                  "&:hover": {
                    color: "#901414",
                  },
                })}
              >
                <IconPhone size={20} />
                <Text size="sm">+65 3119 2890</Text>
              </Group>
            </Group>

            <Stack p={20} bg={"blasck"}>
              <Text color="gray.5" size="sm" fw={500}>
                Follow Us On
              </Text>
              <Group gap="lg">
                {[
                  { icon: IconBrandFacebook, link: "#" },
                  { icon: IconBrandInstagram, link: "#" },
                  { icon: IconBrandTwitter, link: "#" },
                  { icon: IconBrandYoutube, link: "#" },
                ].map((social, index) => (
                  <ActionIcon
                    key={index}
                    size="lg"
                    radius="xl"
                    variant="filled"
                    component="a"
                    href={social.link}
                    style={(theme) => ({
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: theme.colors.gray[3],
                      "&:hover": {
                        backgroundColor: "#a904044d",
                        color: "#901414",
                      },
                    })}
                  >
                    <social.icon size={20} />
                  </ActionIcon>
                ))}
              </Group>
            </Stack>
            {/* <Credits /> */}
          </Stack>
        </Stack>
      </div>
      {/* {showCarousel && ( */}

      {/* )} */}
    </Stack>
  );
}

export default WebPreview;

// import React, { useState, useEffect } from "react";
// import { Card, Group, Text, Modal } from "@mantine/core";
// import {
//   IconChevronRight,
//   IconClock,
//   IconMapPin,
//   IconMenu2,
//   IconSearch,
//   IconShoppingCart,
//   IconX,
//   IconChevronLeft,
// } from "@tabler/icons-react";
// import Image from "next/image";
// import IPhoneFrame from "./IPhoneFrame";

// const MenuCarousel = ({ images, currentIndex, onClose }) => {
//   const [activeIndex, setActiveIndex] = useState(currentIndex);

//   const goToNext = (e) => {
//     e.stopPropagation();
//     setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   const goToPrev = (e) => {
//     e.stopPropagation();
//     setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div className="relative w-full h-full flex items-center justify-center">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
//         >
//           <IconX size={24} />
//         </button>

//         {/* Previous button */}
//         <button
//           onClick={goToPrev}
//           className="absolute left-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
//         >
//           <IconChevronLeft size={24} />
//         </button>

//         {/* Next button */}
//         <button
//           onClick={goToNext}
//           className="absolute right-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
//         >
//           <IconChevronRight size={24} />
//         </button>

//         {/* Image */}
//         <div className="w-full h-full p-12 flex items-center justify-center">
//           <img
//             src={images[activeIndex].preview}
//             alt={`Image ${activeIndex + 1}`}
//             className="max-w-full max-h-full object-contain"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>

//         {/* Indicators */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setActiveIndex(index);
//               }}
//               className={`w-2 h-2 rounded-full transition-all ${
//                 index === activeIndex ? "w-4 bg-white" : "bg-white/50"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const MobileWebPreview = ({ storeInfo }) => {
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [showCarousel, setShowCarousel] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   useEffect(() => {
//     if (!storeInfo?.logo) return;
//     const file = storeInfo.logo;
//     const reader = new FileReader();
//     reader.onload = () => setLogoPreview(reader.result);
//     reader.readAsDataURL(file);
//   }, [storeInfo?.logo]);

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":").map(Number);
//     const ampm = hours >= 12 ? "PM" : "AM";
//     return `${hours % 12 || 12}:${minutes
//       ?.toString()
//       .padStart(2, "0")} ${ampm}`;
//   };

//   const groupedHours = storeInfo?.businessHours?.reduce((acc, hour) => {
//     const { day, openTime, closeTime } = hour;
//     const key = `${openTime}-${closeTime}`;
//     if (!acc[key]) {
//       acc[key] = { days: [day], openTime, closeTime };
//     } else {
//       acc[key].days.push(day);
//     }
//     return acc;
//   }, {});

//   const handleImageClick = (index) => {
//     setSelectedImageIndex(index);
//     setShowCarousel(true);
//   };

//   // Add keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (!showCarousel) return;

//       switch (e.key) {
//         case "ArrowRight":
//           setSelectedImageIndex((prev) =>
//             prev === (storeInfo?.menuImages?.length || 0) - 1 ? 0 : prev + 1
//           );
//           break;
//         case "ArrowLeft":
//           setSelectedImageIndex((prev) =>
//             prev === 0 ? (storeInfo?.menuImages?.length || 0) - 1 : prev - 1
//           );
//           break;
//         case "Escape":
//           setShowCarousel(false);
//           break;
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [showCarousel, storeInfo?.menuImages?.length]);

//   return (
//     <IPhoneFrame>
//       <div
//         className="flex flex-col min-h-screen w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl"
//         style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
//       >
//         {/* Header Section */}
//         <div className="relative pt-8 pb-4">
//           <div className="flex justify-center">
//             {!logoPreview ? (
//               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
//                 <Text
//                   className="text-2xl font-bold"
//                   style={{ color: storeInfo?.websiteTheme.primaryColor }}
//                 >
//                   {storeInfo?.name?.slice(0, 2).toUpperCase()}
//                 </Text>
//               </div>
//             ) : (
//               <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
//                 <img
//                   src={logoPreview}
//                   alt="Store logo"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div
//           className="flex-grow rounded-t-3xl px-6 py-8"
//           style={{ backgroundColor: storeInfo?.websiteTheme.secondaryColor }}
//         >
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-white mb-2">
//               {storeInfo?.name}
//             </h1>
//             <p className="text-white/80">{storeInfo?.tagLine}</p>
//           </div>

//           {/* Menu Images */}
//           <div className="grid grid-cols-2 gap-4 mb-8">
//             {storeInfo?.menuImages?.map((img, index) => (
//               <div
//                 key={index}
//                 className="rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
//                 onClick={() => handleImageClick(index)}
//               >
//                 <img
//                   src={img.preview}
//                   alt={`Menu ${index + 1}`}
//                   className="w-full h-48 object-cover"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Info Cards */}
//           <div className="space-y-6">
//             <Card className="bg-white/10 border-0 p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <h2 className="font-semibold text-lg text-white">About Us</h2>
//               </div>
//               <p className="text-white/80">{storeInfo?.description}</p>
//             </Card>

//             <Card className="bg-white/10 border-0 p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <IconMapPin className="w-5 h-5 text-white" />
//                 <h2 className="font-semibold text-lg text-white">Location</h2>
//               </div>
//               <p className="text-white/80">
//                 {[
//                   storeInfo?.address,
//                   storeInfo?.city,
//                   storeInfo?.state,
//                   storeInfo?.pincode,
//                 ]
//                   .filter(Boolean)
//                   .join(", ")}
//               </p>
//             </Card>

//             <Card className="bg-white/10 border-0 p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <IconClock className="w-5 h-5 text-white" />
//                 <h2 className="font-semibold text-lg text-white">
//                   Our Timings
//                 </h2>
//               </div>
//               <div className="space-y-2">
//                 {groupedHours &&
//                   Object.values(groupedHours).map(
//                     ({ days, openTime, closeTime }) => (
//                       <div
//                         key={`${openTime}-${closeTime}`}
//                         className="text-white/80"
//                       >
//                         <span className="font-medium">
//                           {days.length > 1
//                             ? `${days.slice(0, -1).join(", ")} and ${
//                                 days[days.length - 1]
//                               }`
//                             : days[0]}
//                         </span>
//                         : {formatTime(openTime)} - {formatTime(closeTime)}
//                       </div>
//                     )
//                   )}
//               </div>
//             </Card>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="bg-gray-900 text-white py-6 px-6">
//           <div className="space-y-4">
//             <div className="text-center">
//               <p className="text-gray-400">
//                 © {new Date().getFullYear()} {storeInfo?.name}
//               </p>
//               <p className="text-gray-500 text-sm">Powered by Your Company</p>
//             </div>
//           </div>
//         </footer>

//         {/* Custom Image Carousel */}
//         {showCarousel && (
//           <MenuCarousel
//             images={storeInfo?.menuImages}
//             currentIndex={selectedImageIndex}
//             onClose={() => setShowCarousel(false)}
//           />
//         )}
//       </div>
//     </IPhoneFrame>
//   );
// };

// export default MobileWebPreview;
