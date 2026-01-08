"use client";
import React from "react";
import Image from "next/image";
import { Stack, Text } from "@mantine/core";
import OnlyLogo from "../../../public/logo/only-logo.png";
import classes from "./logoloader.module.css";

interface LogoLoaderProps {
  message?: string;
  size?: number;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  message,
  size = 50,
}) => {
  return (
    <Stack
      align="center"
      justify="center"
      gap="lg"
      w="100%"
      h="100%"
      style={{ minHeight: 300 }}
    >
      <div className={classes.loaderContainer}>
        <div className={classes.glowRing}></div>
        <Image
          src={OnlyLogo}
          alt="Loading..."
          width={size}
          height={size}
          className={classes.spinningLogo}
          style={{ objectFit: "contain", height: "auto" }}
        />
      </div>
      {message && (
        <Text size="sm" c="dimmed" fw={500} className={classes.loadingText}>
          {message}
        </Text>
      )}
    </Stack>
  );
};

export default LogoLoader;

