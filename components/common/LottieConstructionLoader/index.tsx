"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, Stack, Text } from "@mantine/core";
import constructionAnimation from "./construction.json";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieConstructionLoaderProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export const LottieConstructionLoader: React.FC<
  LottieConstructionLoaderProps
> = ({ size = "medium", message = "Loading..." }) => {
  const sizeMap = {
    small: { width: 120, height: 120 },
    medium: { width: 200, height: 200 },
    large: { width: 300, height: 300 },
  };

  const { width, height } = sizeMap[size];

  return (
    <Stack
      align="center"
      justify="center"
      gap={16}
      style={{ minHeight: 300, width: "100%" }}
    >
      <Box
        style={{
          width: width,
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // Ensure animation doesn't overflow
        }}
      >
        <Lottie
          animationData={constructionAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      <Text size="sm" c="dimmed" ta="center" fw={500}>
        {message}
      </Text>
    </Stack>
  );
};

export default LottieConstructionLoader;
