import { swatches } from "@/lib/constants";
import {
  Box,
  Button,
  ColorInput,
  Divider,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import React, { useRef, useState } from "react";
import WebPreview from "../../WebPreview";

import { IconPhoto, IconX } from "@tabler/icons-react";

function WebForm({ form, active, prevStep, nextStep }) {
  const [imageFiles, setImageFiles] = useState([]);
  const imageInputRef = useRef(null);

  const handleImagesChange = (files) => {
    if (files) {
      const newImages = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file,
              preview: reader.result,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then((images) => {
        setImageFiles((prev) => [...prev, ...images]);
        form.setFieldValue("menuImages", (prev) => [...prev, ...images]);
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    form.setFieldValue(
      "menuImages",
      form.values.menuImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const isFormValid = () => {
    const webFieldValues = Object.values(form.values.website).every(
      (value) => value !== null && value !== undefined && value !== ""
    );
    return webFieldValues;
  };
  return (
    <Box p={10}>
      <Divider mb="md" />
      <Flex align={"flex-start"} justify={"space-between"}>
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
          <Text size="sm" weight={500} mb="xs">
            Menu Images
          </Text>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={(e) => handleImagesChange(e.target.files)}
          />
          <Box style={{ flex: 1 }}>
            <Button
              leftSection={<IconPhoto size="1rem" />}
              onClick={() => imageInputRef.current?.click()}
            >
              Upload Menu Images
            </Button>
            <SimpleGrid cols={4} mt="md" spacing="md">
              {form.values.menuImages.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image.preview}
                    radius="md"
                    caption={`Image ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                  >
                    <IconX size={16} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </SimpleGrid>
          </Box>
          <Group justify="" mt="xl">
            <Button onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={!isFormValid()}>
              Next step
            </Button>
          </Group>
        </SimpleGrid>
        <div className="reldative">
          <WebPreview storeInfo={form.values} />
        </div>
      </Flex>
    </Box>
  );
}

export default WebForm;
