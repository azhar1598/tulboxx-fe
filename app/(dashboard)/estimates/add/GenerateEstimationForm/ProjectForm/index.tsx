import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Text,
  TextInput,
  Textarea,
  ActionIcon,
  NumberInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconPlus,
  IconMinus,
  IconCalendar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function ProjectForm({ form, active, nextStep, prevStep }: any) {
  const addLineItem = () => {
    const newId =
      form.values.lineItems.length > 0
        ? Math.max(...form.values.lineItems.map((item) => item.id)) + 1
        : 1;
    form.setFieldValue(`lineItems`, [
      ...form.values.lineItems,
      { id: newId, unitPrice: 1, description: "", quantity: 1, totalPrice: 0 },
    ]);
  };

  const removeLineItem = (id) => {
    if (form.values.lineItems.length > 1) {
      form.setFieldValue(
        `lineItems`,
        form.values.lineItems.filter((item) => item.id !== id)
      );
    }
  };

  const calculateGrandTotal = () => {
    return form.values.lineItems.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
  };

  // Check if required fields are filled
  const isFormValid = () => {
    console.log(
      "form.values.projectEstimate",
      form.values.projectEstimate,
      form.values.serviceType,
      form.values.problemDescription,
      form.values.solutionDescription,
      form.values.projectStartDate,
      form.values.projectEndDate,
      form.values.lineItems,
      form.errors.length === 0,
      form
    );

    return (
      form.values.serviceType?.trim() &&
      form.values.problemDescription?.trim() &&
      form.values.solutionDescription?.trim() &&
      form.values.projectStartDate &&
      form.values.projectEndDate &&
      form.values.projectEstimate != 0 &&
      Object.keys(form.errors).length === 0 &&
      form.values.lineItems.every((item) => item.totalPrice > 0)
    );
  };

  useEffect(() => {
    if (form.values.projectEstimate >= calculateGrandTotal()) {
      form.clearFieldError("projectEstimate");
      return;
    }

    form.setFieldError(
      "projectEstimate",
      "Project estimate is less than the grand total"
    );
  }, [form.values.lineItems]);

  return (
    <Box p={10}>
      <Divider mb="md" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="What type of service or job is this proposal for?"
            placeholder="Example: excavation, drainage, grading, tree removal, etc."
            {...form.getInputProps("serviceType")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="What problem are you solving for the customer?"
            placeholder="Example: Installing a drainage solution to prevent yard flooding."
            minRows={3}
            {...form.getInputProps("problemDescription")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Briefly describe how you will solve the problem."
            placeholder="Example: Installing a trench system to divert water away from the house."
            minRows={3}
            {...form.getInputProps("solutionDescription")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="What is the total project estimate?"
            placeholder="$5,000"
            allowDecimal={false}
            allowNegative={false}
            leftSection={<IconCurrencyDollar stroke={2} size={15} />}
            {...form.getInputProps("projectEstimate")}
            hideControls
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Project Start Date"
            valueFormat="DD MMM YYYY"
            placeholder="Date input"
            {...form.getInputProps("projectStartDate")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Project End Date"
            placeholder="Select end date"
            icon={<IconCalendar size="1rem" />}
            {...form.getInputProps("projectEndDate")}
            clearable
            minDate={form.values.projectStartDate}
          />
        </Grid.Col>

        <Grid.Col span={12} mt={10}>
          <Text fw={500} size="sm">
            Would you like to add line items? (optional)
          </Text>

          <Grid mt={10} mb={5} gutter="xs">
            <Grid.Col span={5}>
              <Text fw={500} size="sm">
                Description
              </Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text fw={500} size="sm">
                Rate
              </Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text fw={500} size="sm">
                Qty
              </Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text fw={500} size="sm">
                Total
              </Text>
            </Grid.Col>
            <Grid.Col span={1}></Grid.Col>
          </Grid>

          {form.values.lineItems.map((item, index) => (
            <Grid key={item.id} mb={10} gutter="xs" align="center">
              <Grid.Col span={5}>
                <TextInput
                  placeholder="Description"
                  // value={item.description}
                  {...form.getInputProps(`lineItems.${index}.description`)}
                  // onChange={(e) =>
                  //   updateLineItem(item.id, "description", e.target.value)
                  // }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  placeholder="$50.00"
                  allowDecimal={false}
                  allowNegative={false}
                  hideControls
                  leftSection={<IconCurrencyDollar stroke={2} size={15} />}
                  {...form.getInputProps(`lineItems.${index}.unitPrice`)}
                  onChange={(e) => {
                    form
                      .getInputProps(`lineItems.${index}.unitPrice`)
                      .onChange(Number(e));
                    const unitPrice: number = Number(e) || 0;
                    const quantity =
                      parseInt(form.values.lineItems[index].quantity) || 0;
                    console.log("unit price", unitPrice);
                    form.setFieldValue(
                      `lineItems.${index}.totalPrice`,
                      unitPrice * quantity
                    );
                  }}
                  // onChange={
                  //   (e) =>
                  //     form.setFieldValue(
                  //       `lineItems.${item.id}.totalPrice`,
                  //       e.target.value  form.values
                  //     )
                  //   // updateLineItem(item.id, "rate", e.target.value)
                  // }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  placeholder="1"
                  allowDecimal={false}
                  allowNegative={false}
                  // value={item.qty}
                  {...form.getInputProps(`lineItems.${index}.quantity`)}
                  onChange={(e) => {
                    form
                      .getInputProps(`lineItems.${index}.quantity`)
                      .onChange(Number(e));
                    const quantity: number = Number(e) || 0;

                    const unitPrice =
                      parseFloat(form.values.lineItems[index]?.unitPrice) || 0;
                    console.log("unit price", unitPrice);

                    form.setFieldValue(
                      `lineItems.${index}.totalPrice`,
                      unitPrice * quantity
                    );
                  }}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  disabled
                  {...form.getInputProps(`lineItems.${index}.totalPrice`)}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() => removeLineItem(item.id)}
                  disabled={form.values.lineItems.length <= 1}
                >
                  <IconMinus size="1rem" />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}

          <Button
            fullWidth
            leftSection={<IconPlus size="1rem" />}
            variant=""
            onClick={addLineItem}
            mb={15}
          >
            Add Line Item
          </Button>

          <Box style={{ textAlign: "right" }}>
            <Text fw={500}>
              Grand Total $ {calculateGrandTotal().toFixed(2)}
            </Text>
          </Box>
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

export default ProjectForm;
