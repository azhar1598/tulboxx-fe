import {
  ActionIcon,
  Box,
  Button,
  Divider,
  FileInput,
  Grid,
  Group,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconBuilding,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

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

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Store Tagline"
            placeholder="Enter store tagline"
            icon={<IconBuilding size="1rem" />}
            {...form.getInputProps("tagline")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Store Description"
            placeholder="Enter store description"
            icon={<IconBuilding size="1rem" />}
            {...form.getInputProps("description")}
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
              // width: "308px",
            }}
          >
            {!logoPreview && (
              <Dropzone onDrop={handleLogoChange}>
                <Group justify="center">
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                      // color: `${
                      //   errorMessage ? "red" : "var(--mantine-color-dimmed)"
                      // }`,
                    }}
                    stroke={1.5}
                  />
                </Group>
                <Group justify="center">
                  {/* {errorMessage && (
                  <Text color="red" size="sm" mt="sm">
                    {errorMessage}
                  </Text>
                )} */}
                </Group>
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
                    // onClick={() => setOpen(true)}
                  >
                    {imageName}
                  </Text>
                </div>
              </Group>
            )}
          </div>
        </Grid.Col>

        {console.log("form.value", form.values.logo)}
        {/* <Grid.Col span={{ base: 12, md: 6 }}>
          {logoPreview && (
            <Image
              src={logoPreview}
              alt="Store logo"
              width={120}
              height={120}
              fit="contain"
              radius="md"
              mt="md"
            />
          )}
        </Grid.Col> */}
      </Grid>
      <Group justify="" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </Box>
  );
}

export default BasicForm;
