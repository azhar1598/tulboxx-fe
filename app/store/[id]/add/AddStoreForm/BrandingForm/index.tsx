import { swatches } from "@/lib/constants";
import {
  Box,
  Button,
  ColorInput,
  Divider,
  FileInput,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconPalette, IconPhoto, IconUpload } from "@tabler/icons-react";
import React, { useRef, useState } from "react";

function BrandingForm({ form }) {
  const imageInputRef = useRef(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const handleLogoChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
      });
    }
  };
  return (
    <Box>
      {/* <Group spacing="xs" mb="md">
        <ThemeIcon size="lg" variant="light" color="grape">
          <IconPalette size="1.2rem" />
        </ThemeIcon>
        <Text size="lg" weight={500}>
          Branding
        </Text>
      </Group> */}
      <Divider mb="md" />

      <Grid>
        <Grid.Col span={12}>
          <SimpleGrid cols={2} mb={20}>
            <Text size="sm" weight={500}>
              QR Primary Color <span className="text-red-500">*</span>
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
              QR Secondary Color <span className="text-red-500">*</span>
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
              QR Primary Text <span className="text-red-500">*</span>
            </Text>
            <Box style={{ flex: 1 }}>
              <TextInput />
            </Box>
            <Text size="sm" weight={500}>
              QR Secondary Text <span className="text-red-500">*</span>
            </Text>
            <Box style={{ flex: 1 }}>
              <Textarea />
            </Box>
          </SimpleGrid>
          <hr />
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
        </Grid.Col>
        <Grid.Col span={12}>
          <FileInput
            label="Store Logo"
            placeholder="Upload store logo"
            accept="image/png,image/jpeg"
            icon={<IconUpload size="1rem" />}
            onChange={handleLogoChange}
            withAsterisk
          />
          {logoPreview && (
            <Image
              src={logoPreview}
              alt="Store logo"
              width={50}
              height={50}
              fit="contain"
              radius="md"
              mt="md"
            />
          )}
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" weight={500} mb="xs">
            Store Images <span className="text-red-500">*</span>
          </Text>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={(e) => handleImagesChange(e.target.files)}
          />
          <Button
            leftSection={<IconPhoto size="1rem" />}
            onClick={() => imageInputRef.current?.click()}
          >
            Upload Menu Images
          </Button>
          <SimpleGrid cols={4} mt="md" spacing="md">
            {imageFiles.map((image, index) => (
              <Image
                key={index}
                src={image.preview}
                radius="md"
                caption={`Image ${index + 1}`}
              />
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default BrandingForm;
