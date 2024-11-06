"use client";
import { useForm, zodResolver } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import {
  TextInput,
  Textarea,
  Select,
  FileInput,
  Group,
  Button,
  Box,
  Paper,
  Title,
  Grid,
  Stack,
  Image,
  CloseButton,
  SimpleGrid,
  Text,
  ColorInput,
  Flex,
  Container,
  Card,
  Divider,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconBuilding,
  IconUpload,
  IconPhoto,
  IconUser,
  IconPhone,
  IconMail,
  IconClock,
  IconMapPin,
  IconPalette,
  IconPower,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { indianStates, swatches } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const AddStoreForm = ({ form }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const imageInputRef = useRef(null);

  const router = useRouter();

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
    <Card shadow="md" radius="md" p={0}>
      <Paper p="xl">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack spacing="xl">
            {/* Basic Information */}
            <Box>
              <Group spacing="xs" mb="md">
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconBuilding size="1.2rem" />
                </ThemeIcon>
                <Text size="lg" weight={500}>
                  Basic Information
                </Text>
              </Group>
              <Divider mb="md" />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Store Name"
                    placeholder="Enter store name"
                    icon={<IconBuilding size="1rem" />}
                    {...form.getInputProps("name")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Category"
                    placeholder="Select store category"
                    data={[
                      { value: "restaurant", label: "Restaurant" },
                      { value: "retail", label: "Retail" },
                      { value: "grocery", label: "Grocery" },
                      { value: "electronics", label: "Electronics" },
                      { value: "fashion", label: "Fashion" },
                    ]}
                    {...form.getInputProps("category")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <TextInput
                    label="Store Tagline"
                    placeholder="Enter store tagline"
                    icon={<IconBuilding size="1rem" />}
                    {...form.getInputProps("tagline")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Textarea
                    label="Store Description"
                    placeholder="Enter store description"
                    icon={<IconBuilding size="1rem" />}
                    {...form.getInputProps("description")}
                  />
                </Grid.Col>
              </Grid>
            </Box>

            {/* Branding */}
            <Box>
              <Group spacing="xs" mb="md">
                <ThemeIcon size="lg" variant="light" color="grape">
                  <IconPalette size="1.2rem" />
                </ThemeIcon>
                <Text size="lg" weight={500}>
                  Branding
                </Text>
              </Group>
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
                        onChange={(color) =>
                          form.setFieldValue("themeColor", color)
                        }
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
                        onChange={(color) =>
                          form.setFieldValue("themeColor", color)
                        }
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
                      Store Primary Color{" "}
                      <span className="text-red-500">*</span>
                    </Text>
                    <Box style={{ flex: 1 }}>
                      <ColorInput
                        format="hex"
                        swatches={swatches}
                        value={form.values.themeColor}
                        onChange={(color) =>
                          form.setFieldValue("themeColor", color)
                        }
                        withEyeDropper
                        placeholder="Pick a color"
                        error={form.errors.themeColor}
                      />
                    </Box>
                    <Text size="sm" weight={500}>
                      Store Secondary Color{" "}
                      <span className="text-red-500">*</span>
                    </Text>
                    <Box style={{ flex: 1 }}>
                      <ColorInput
                        format="hex"
                        swatches={swatches}
                        value={form.values.themeColor}
                        onChange={(color) =>
                          form.setFieldValue("themeColor", color)
                        }
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

            {/* Contact Information */}
            <Box>
              <Group spacing="xs" mb="md">
                <ThemeIcon size="lg" variant="light" color="indigo">
                  <IconUser size="1.2rem" />
                </ThemeIcon>
                <Text size="lg" weight={500}>
                  Contact Information
                </Text>
              </Group>
              <Divider mb="md" />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Owner Name"
                    placeholder="Enter owner name"
                    icon={<IconUser size="1rem" />}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Phone Number"
                    placeholder="+1234567890"
                    icon={<IconPhone size="1rem" />}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Email"
                    placeholder="Enter email address"
                    icon={<IconMail size="1rem" />}
                    disabled
                  />
                </Grid.Col>
              </Grid>
            </Box>

            {/* Business Hours & Location */}
            <Box>
              <Group spacing="xs" mb="md">
                <ThemeIcon size="lg" variant="light" color="orange">
                  <IconClock size="1.2rem" />
                </ThemeIcon>
                <Text size="lg" weight={500}>
                  Business Hours & Location
                </Text>
              </Group>
              <Divider mb="md" />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TimeInput
                    label="Opening Time"
                    icon={<IconClock size="1rem" />}
                    {...form.getInputProps("openTime")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TimeInput
                    label="Closing Time"
                    icon={<IconClock size="1rem" />}
                    {...form.getInputProps("closeTime")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="State"
                    placeholder="Select state"
                    data={indianStates}
                    icon={<IconMapPin size="1rem" />}
                    {...form.getInputProps("state")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="City"
                    placeholder="Enter city name"
                    icon={<IconMapPin size="1rem" />}
                    {...form.getInputProps("city")}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Complete Address"
                    placeholder="Enter complete address"
                    minRows={2}
                    icon={<IconMapPin size="1rem" />}
                    {...form.getInputProps("address")}
                    withAsterisk
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Group position="right" mt="xl">
              <Button variant="light" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" gradient={{ from: "blue", to: "cyan" }}>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Card>
  );
};

export default AddStoreForm;
