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
// import RestaurantMenuCard from "@/app/new-page/RestaurantMenu";
// import RestaurantMenu2 from "@/app/new-page/RestautrantMenu2";
import ImageCarousel from "../WebForm/WebPreview/MenuCarousel";

function TestWeb({ storeDetail }: any) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [storeInfo, setStoreInfo] = useState({
    menuImages: [
      "https://marketplace.canva.com/EAFwRADHMsM/1/0/1035w/canva-orange-and-black-bold-geometric-restaurant-menu-AX4bhelWqNA.jpg",
      "https://marketplace.canva.com/EAFZawUn7mU/1/0/1131w/canva-black-and-red-modern-food-menu-bu62Mi5HBkk.jpg",
    ],
  });

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

  return (
    <Stack>
      <div
        className="relative max-w-500 bg-image bg-center bg-cover bg-no-repeat  bg-black/70  backdrop-blur-sm"
        style={{ backgroundImage: `url(${"ss"})` }}
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
          {/* Logo */}
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center ">
            <span className="text-xl font-bold text-white">RT</span>
          </div>

          {/* Restaurant Name */}

          <Indicator color="green" position="top-end" processing>
            <h1 className="text-lg font-bold text-white px-2 ">
              Raghavendra Tiffins
            </h1>
          </Indicator>

          <p className="text-gray-400 -mt-3">Tastes Better</p>

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
          <ImageCarousel
            images={storeInfo?.menuImages}
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
                    backgroundColor: "#a904044d",
                    borderRadius: "50%",
                    width: "30px",
                  }}
                >
                  <IconInfoSquare color="#901414" stroke={2} />
                </Box>
                <Text size="lg" fw={600} color="white">
                  About Us
                </Text>
              </Flex>
              <Box>
                <Text size="sm" color="gray.3" w="300px">
                  {storeDetail?.description}
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
                    backgroundColor: "#a904044d",
                    borderRadius: "50%",
                    width: "30px",
                  }}
                >
                  <IconMapPin size={24} color="#901414" stroke={1.5} />
                </Box>
                <Text size="lg" fw={600} color="white" ta="left">
                  Our Location
                </Text>
              </Flex>
              <Text size="sm" color="gray.3" ta="left" w="300px">
                {storeDetail?.address}, {storeDetail?.city},
                <br />
                {storeDetail?.state}, {storeDetail?.pincode}.
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
                    backgroundColor: "#a904044d",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  <IconClock size={24} color="#901414" stroke={1.5} />
                </Box>
                <h2 className="text-lg font-semibold text-white mb-3 text-s">
                  Business Hours
                </h2>
              </Flex>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-200 text-sm">
                <div>Monday - Friday</div>
                <div>7:00 AM - 10:00 PM</div>
                <div>Saturday</div>
                <div>7:00 AM - 10:00 PM</div>
                <div>Sunday</div>
                <div>7:00 AM - 9:00 PM</div>
              </div>
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

export default TestWeb;
