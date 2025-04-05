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

function AdditionalForm({
  form,
  active,
  nextStep,
  prevStep,
  generateEstimation,
}: any) {
  console.log(
    "form.values.equipmentMaterials",
    form.values.equipmentMaterials,
    form.values,
    form.isValid()
  );
  return (
    <Box p={10}>
      <Divider mb="md" />

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="What equipment and materials will be used for this project? (optional)
"
            placeholder="Start typing..."
            {...form.getInputProps("equipmentMaterials")}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="Is there any additional information to include in the proposal? (optional)
"
            placeholder="Start typing..."
            {...form.getInputProps("additionalNotes")}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-start" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button
          type="submit"
          disabled={!form.isValid()}
          loading={generateEstimation.isPending}
        >
          Generate Esitmate
        </Button>
      </Group>
    </Box>
  );
}

export default AdditionalForm;
