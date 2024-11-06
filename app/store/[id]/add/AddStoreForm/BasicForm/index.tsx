import {
  Box,
  Button,
  Divider,
  FileInput,
  Grid,
  Group,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconBuilding, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import React, { useState } from "react";

function BasicForm({ form, active, nextStep, prevStep }) {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      form.setFieldValue("logo", file);
    }
  };

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
          <FileInput
            label="Store Logo"
            placeholder="Upload store logo"
            accept="image/png,image/jpeg"
            rightSection={<IconUpload size="1rem" />}
            onChange={handleLogoChange}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
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
        </Grid.Col>
      </Grid>
      <Group justify="" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </Box>
  );
}

export default BasicForm;
