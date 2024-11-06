import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";
import React from "react";

function BasicForm({ form, active, nextStep, prevStep }) {
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
      </Grid>
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </Box>
  );
}

export default BasicForm;
