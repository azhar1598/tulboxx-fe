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

function AdditionalForm({ form, active, nextStep, prevStep }) {
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
        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="What equipment and materials will be used for this project? (optional)
"
            placeholder="Start typing..."
            {...form.getInputProps("customerAddress")}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="Is there any additional information to include in the proposal? (optional)
"
            placeholder="Start typing..."
            {...form.getInputProps("customerAddress")}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-start" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!isFormValid()}>
          Generate Esitmate
        </Button>
      </Group>
    </Box>
  );
}

export default AdditionalForm;
