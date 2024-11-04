"use client";

import { Center, Group } from "@mantine/core";

import { usePathname } from "next/navigation";

import DisplayImage from "../../public/assets/auth/zazu.webp";

import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <Center
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >
      <Image
        src={DisplayImage}
        alt="Wolf Banner"
        layout="fill"
        objectFit="cover"
        priority
        unoptimized
        className="opacity-40"
      />
      <Group
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
        }}
      >
        {children}
      </Group>
    </Center>
  );
}
