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
  NumberInput,
  SimpleGrid,
  Slider,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IconPalette,
  IconPhoto,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import PreviewQR from "../../PreviewQR";

function QRForm({ form, active, createStore, prevStep }) {
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
      const newImages = Array.from(files).map((file: File) => {
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

  const isFormValid = () => {
    const qrFieldsValid = Object.values(form.values.qrTheme).every(
      (value) => value !== null && value !== undefined && value !== ""
    );
    return qrFieldsValid;
  };
  return (
    <Box p={10}>
      <Divider mb="md" />
      {/* <Group spacing="xs" mb="md">
        <ThemeIcon size="lg" variant="light" color="grape">
          <IconPalette size="1.2rem" />
        </ThemeIcon>
        <Text size="lg" fw={500}>
          Branding
        </Text>
      </Group> */}

      <SimpleGrid cols={2}>
        <Grid>
          <Grid.Col span={12}>
            <SimpleGrid cols={2} mb={20}>
              <Text size="sm" fw={500}>
                Title Font Size <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <NumberInput
                  placeholder="Enter font size"
                  {...form.getInputProps("qrTheme.titleFontSize")}
                  maxLength={2}
                  allowDecimal={false}
                  allowNegative={false}
                />
              </Box>
              <Text size="sm" fw={500}>
                QR Primary Color <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <ColorInput
                  format="hex"
                  swatches={swatches}
                  value={form.values.qrTheme.primaryColor}
                  onChange={(color) =>
                    form.setFieldValue("qrTheme.primaryColor", color)
                  }
                  withEyeDropper
                  placeholder="Pick a color"
                  //   error={form.errors.qrTheme.primaryColor}
                />
              </Box>
              <Text size="sm" fw={500}>
                QR Secondary Color <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <ColorInput
                  format="hex"
                  swatches={swatches}
                  value={form.values.qrTheme.secondaryColor}
                  onChange={(color) =>
                    form.setFieldValue("qrTheme.secondaryColor", color)
                  }
                  withEyeDropper
                  placeholder="Pick a color"
                  //   error={form.errors.qrTheme.secondaryColor}
                />
              </Box>
              <Text size="sm" fw={500}>
                QR Primary Text <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <TextInput
                  placeholder="Enter primary text"
                  {...form.getInputProps("qrTheme.primaryText")}
                  maxLength={10}
                />
              </Box>
              <Text size="sm" fw={500}>
                Logo Radius <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <Slider
                  color="blue"
                  marks={[
                    { value: 20, label: "" },
                    { value: 50, label: "" },
                    { value: 80, label: "" },
                  ]}
                  {...form.getInputProps("qrTheme.radius")}
                />
              </Box>
              <Text size="sm" fw={500} mt={5}>
                QR CTA Text <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <Textarea
                  placeholder="Enter CTA text"
                  {...form.getInputProps("qrTheme.ctaText")}
                  maxLength={20}
                  mt={5}
                />
              </Box>
              <Text size="sm" fw={500} mt={5}>
                QR CTA Color <span className="text-red-500">*</span>
              </Text>
              <Box style={{ flex: 1 }}>
                <ColorInput
                  format="hex"
                  swatches={swatches}
                  value={form.values.qrTheme.ctaColor}
                  onChange={(color) =>
                    form.setFieldValue("qrTheme.ctaColor", color)
                  }
                  withEyeDropper
                  placeholder="Pick a color"
                  //   error={form.errors.qrTheme.secondaryColor}
                />
              </Box>
            </SimpleGrid>
          </Grid.Col>
          <Group justify="" mt="xl">
            <Button onClick={prevStep}>Back</Button>
            <Button
              type="submit"
              leftSection={<IconPlus />}
              disabled={!isFormValid()}
              loading={createStore.isPending}
            >
              Create Store
            </Button>
          </Group>
        </Grid>
        <PreviewQR storeInfo={form.values} />
      </SimpleGrid>
    </Box>
  );
}

export default QRForm;
