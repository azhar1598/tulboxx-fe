import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconBuilding, IconPhoto, IconX } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Dropzone } from "@mantine/dropzone";

function BasicForm({ form, active, nextStep, prevStep }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [imageName, setImageName] = useState<string>("");

  const handleLogoChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      setImageName(file.name);
      reader.readAsDataURL(file);
      form.setFieldValue("logo", file);
    }
  };

  // Check if required fields are filled
  const isFormValid = () => {
    return (
      form.values.name?.trim() &&
      // form.values.categoryId?.trim() &&
      form.values.description?.trim() &&
      form.values.tagLine?.trim()
    );
  };

  useEffect(() => {
    if (!form.values.logo) return;
    const file = form.values.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    setImageName(file.name);
    reader.readAsDataURL(file);
  }, []);

  return (
    <Box p={10}>
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
              { value: "1", label: "Restaurant" },
              { value: "2", label: "Retail" },
              { value: "3", label: "Grocery" },
              { value: "4", label: "Electronics" },
              { value: "5", label: "Fashion" },
            ]}
            // {...form.getInputProps("categoryId")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Store License Id"
            placeholder="Enter store licenseId"
            icon={<IconBuilding size="1rem" />}
            {...form.getInputProps("licenseId")}
            // withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Store tagline"
            placeholder="Enter store tagline"
            icon={<IconBuilding size="1rem" />}
            {...form.getInputProps("tagLine")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Store Description"
            placeholder="Enter store description"
            icon={<IconBuilding size="1rem" />}
            {...form.getInputProps("description")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="14px" fw={500} mb={5}>
            Store Logo
          </Text>

          <div
            style={{
              border: "1px dashed #d9d9d9",
              borderRadius: "10px",
              padding: "12px",
              cursor: "pointer",
            }}
          >
            {!logoPreview && (
              <Dropzone onDrop={handleLogoChange}>
                <Group justify="center">
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                    }}
                    stroke={1.5}
                  />
                </Group>
                <Group justify="center"></Group>
              </Dropzone>
            )}

            {logoPreview && (
              <Group align="center">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={logoPreview}
                    width={50}
                    height={30}
                    alt="Preview"
                  />

                  <ActionIcon
                    color="red"
                    size="sm"
                    radius="xl"
                    variant="filled"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-10px",
                    }}
                    onClick={() => {
                      setLogoPreview(null);
                      form.setFieldValue("logo", null);
                    }}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
                <div
                  style={{
                    flex: 1,
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="sm"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {imageName}
                  </Text>
                </div>
              </Group>
            )}
          </div>
        </Grid.Col>
      </Grid>
      <Group justify="" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!isFormValid()}>
          Next step
        </Button>
      </Group>
    </Box>
  );
}

export default BasicForm;
