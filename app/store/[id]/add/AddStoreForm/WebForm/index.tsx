import { swatches } from "@/lib/constants";
import {
  Box,
  Button,
  ColorInput,
  Divider,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import React from "react";
import WebPreview from "../../WebPreview";

function WebForm({ form, active, prevStep, nextStep }) {
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
              value={form.values.website.primaryColor}
              onChange={(color) =>
                form.setFieldValue("website.primaryColor", color)
              }
              withEyeDropper
              placeholder="Pick a color"
            />
          </Box>
          <Text size="sm" weight={500}>
            Store Secondary Color <span className="text-red-500">*</span>
          </Text>
          <Box style={{ flex: 1 }}>
            <ColorInput
              format="hex"
              swatches={swatches}
              value={form.values.website.secondaryColor}
              onChange={(color) =>
                form.setFieldValue("website.secondaryColor", color)
              }
              withEyeDropper
              placeholder="Pick a color"
            />
          </Box>
          <Group justify="" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        </SimpleGrid>
        <div className="relative">
          <WebPreview storeInfo={form.values} />
        </div>
      </SimpleGrid>
    </Box>
  );
}

export default WebForm;
