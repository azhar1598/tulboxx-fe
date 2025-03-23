import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Radio,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import React from "react";

function BasicForm({ form, active, nextStep, prevStep }) {
  // Check if required fields are filled
  const isFormValid = () => {
    return (
      form.values.projectName?.trim() &&
      form.values.customerName?.trim() &&
      form.values.customerEmail?.trim() &&
      form.values.customerPhone?.trim() &&
      form.values.customerAddress?.trim()
    );
  };

  return (
    <Box p={10}>
      <Divider mb="md" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Project Name"
            placeholder="Type here..."
            {...form.getInputProps("projectName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Lookup Customer (optional)"
            placeholder="Search Customers..."
            {...form.getInputProps("customerLookup")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Customer Name"
            placeholder="Type here..."
            {...form.getInputProps("customerName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Customer Email"
            placeholder="customer@email.com"
            {...form.getInputProps("customerEmail")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Customer Phone"
            placeholder="(555) 555-5555"
            {...form.getInputProps("customerPhone")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }} mt={8}>
          <Text size="14px" fw={500} mb={5}>
            Customer Type
          </Text>
          <Radio.Group
            {...form.getInputProps("customerType")}
            defaultValue="residential"
            mt={12}
          >
            <Group>
              <Radio value="residential" label="Residential" />
              <Radio value="commercial" label="Commercial" />
            </Group>
          </Radio.Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Customer Address"
            placeholder="Start typing..."
            {...form.getInputProps("customerAddress")}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-start" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!isFormValid()}>
          Next step
        </Button>
      </Group>
    </Box>
  );
}

export default BasicForm;
