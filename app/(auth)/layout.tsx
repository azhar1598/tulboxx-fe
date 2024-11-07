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
  return (
    // <Center
    //   style={{
    //     position: "relative",
    //     width: "100%",
    //     height: "100vh",
    //   }}
    // >
    //   <Image
    //     src={DisplayImage}
    //     alt="Wolf Banner"
    //     layout="fill"
    //     objectFit="cover"
    //     priority
    //     unoptimized
    //     className="opacity-40"
    //   />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      {children}
    </div>
    // </Center>
  );
}
