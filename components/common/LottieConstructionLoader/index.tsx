"use client";

import React from "react";
import { LogoLoader } from "../LogoLoader";

interface LottieConstructionLoaderProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export const LottieConstructionLoader: React.FC<
  LottieConstructionLoaderProps
> = ({ size = "medium", message = "Loading..." }) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
  };

  return <LogoLoader size={sizeMap[size]} message={message} />;
};

export default LottieConstructionLoader;
