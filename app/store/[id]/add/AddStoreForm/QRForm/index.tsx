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
import PreviewQR from "../../PreviewQR";

function QRForm({ form }) {
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
    <Box p={10}>
      <Divider mb="md" />
      {/* <Group spacing="xs" mb="md">
        <ThemeIcon size="lg" variant="light" color="grape">
          <IconPalette size="1.2rem" />
        </ThemeIcon>
        <Text size="lg" weight={500}>
          Branding
        </Text>
      </Group> */}

      <SimpleGrid cols={2}>
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
          </Grid.Col>
        </Grid>
        <PreviewQR storeInfo={form.values} />
      </SimpleGrid>
    </Box>
  );
}

export default QRForm;
