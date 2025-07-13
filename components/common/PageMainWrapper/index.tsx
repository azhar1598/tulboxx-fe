import { Box } from "@mantine/core";
import React from "react";

function PageMainWrapper({ children, w = "1/2" }) {
  return (
    <Box
      mt="lg"
      style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 15%), #ffffff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "var(--mantine-radius-lg)",
        boxShadow:
          "0 8px 20px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.05)",
        padding: "var(--mantine-spacing-xl)",
      }}
    >
      <div className={`md:w-${w} w-full`}>{children}</div>
    </Box>
  );
}

export default PageMainWrapper;
