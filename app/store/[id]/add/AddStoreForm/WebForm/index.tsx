import { swatches } from "@/lib/constants";
import { Box, ColorInput, Divider, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import WebPreview from "../../WebPreview";

function WebForm({ form }) {
  return (
    <Box p={10}>
      <Divider mb="md" />
      <SimpleGrid cols={2}>
        <SimpleGrid cols={2} mt={20}>
          <Text size="sm">
            Store Primary Color <span className="text-red-500">*</span>
          </Text>
          <Box style={{ flex: 1 }}>
            <ColorInput
              format="hex"
              swatches={swatches}
              value={form.values.themeColor}
              onChange={(color) => form.setFieldValue("themeColor", color)}
              withEyeDropper
              placeholder="Pick a color"
              error={form.errors.themeColor}
            />
          </Box>
          <Text size="sm" weight={500}>
            Store Secondary Color <span className="text-red-500">*</span>
          </Text>
          <Box style={{ flex: 1 }}>
            <ColorInput
              format="hex"
              swatches={swatches}
              value={form.values.themeColor}
              onChange={(color) => form.setFieldValue("themeColor", color)}
              withEyeDropper
              placeholder="Pick a color"
              error={form.errors.themeColor}
            />
          </Box>
        </SimpleGrid>
        <div className="relative">
          <WebPreview form={form} />
        </div>
      </SimpleGrid>
    </Box>
  );
}

export default WebForm;
