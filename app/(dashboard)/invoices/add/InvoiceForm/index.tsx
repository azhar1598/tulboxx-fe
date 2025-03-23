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
  IconEyeDollar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";

function InvoiceForm({ form, active, nextStep, prevStep }) {
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", rate: "", qty: 1, total: 0 },
  ]);

  const addLineItem = () => {
    const newId =
      lineItems.length > 0
        ? Math.max(...lineItems.map((item) => item.id)) + 1
        : 1;
    setLineItems([
      ...lineItems,
      { id: newId, description: "", rate: "", qty: 1, total: 0 },
    ]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id, field, value) => {
    const updatedItems = lineItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Calculate total whenever rate or qty changes
        if (field === "rate" || field === "qty") {
          const rate = field === "rate" ? value : item.rate;
          const qty = field === "qty" ? value : item.qty;
          updatedItem.total = (parseFloat(rate) || 0) * (parseInt(qty) || 0);
        }

        return updatedItem;
      }
      return item;
    });

    setLineItems(updatedItems);
  };

  const calculateGrandTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  // Check if required fields are filled
  const isFormValid = () => {
    return (
      form.values.serviceType?.trim() &&
      form.values.problemDescription?.trim() &&
      form.values.solutionDescription?.trim() &&
      form.values.projectStartDate &&
      form.values.projectEndDate &&
      form.values.projectEstimate?.trim()
    );
  };

  return (
    <Box p={10}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Issue Date"
            valueFormat="YYYY MMM DD"
            placeholder="Date input"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Due Date"
            placeholder="Select end date"
            icon={<IconCalendar size="1rem" />}
            {...form.getInputProps("projectEndDate")}
            clearable
            minDate={form.values.projectStartDate}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Invoice Total Amount"
            placeholder="5,000"
            allowDecimal={false}
            leftSection={<IconCurrencyDollar stroke={2} size={15} />}
            allowNegative={false}
            // prefix="$"
            {...form.getInputProps("projectEstimate")}
            hideControls
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Invoice #"
            placeholder="$5,000"
            allowDecimal={false}
            allowNegative={false}
            disabled
            {...form.getInputProps("projectEstimate")}
            hideControls
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

          {lineItems.map((item) => (
            <Grid key={item.id} mb={10} gutter="xs" align="center">
              <Grid.Col span={5}>
                <TextInput
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(item.id, "description", e.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  placeholder="$50.00"
                  value={item.rate}
                  onChange={(e) =>
                    updateLineItem(item.id, "rate", e.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  placeholder="1"
                  value={item.qty}
                  onChange={(e) =>
                    updateLineItem(item.id, "qty", e.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput disabled value={`$${item.total.toFixed(2)}`} />
              </Grid.Col>
              <Grid.Col span={1}>
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() => removeLineItem(item.id)}
                  disabled={lineItems.length <= 1}
                >
                  <IconMinus size="1rem" />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}

          <Button
            fullWidth
            leftIcon={<IconPlus size="1rem" />}
            variant="outline"
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

        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="Invoice Summary"
            placeholder="Example: Installing a drainage solution to prevent yard flooding."
            minRows={3}
            {...form.getInputProps("problemDescription")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12 }}>
          <Text>Remit Payment To</Text>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Account Name"
              placeholder="Type here..."
              {...form.getInputProps("projectName")}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Account Number"
              placeholder="Type here..."
              {...form.getInputProps("projectName")}
              disabled
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Routing Number"
              placeholder="Type here..."
              {...form.getInputProps("projectName")}
              disabled
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Tax Id No."
              placeholder="Type here..."
              {...form.getInputProps("projectName")}
              disabled
            />
          </Grid.Col>
          <Link href="/account" className="underline text-blue-600 ">
            Edit
          </Link>
          {/* Remit Payment  */}
        </Grid.Col>
      </Grid>

      <Group justify="flex-start" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button
          onClick={nextStep}
          // disabled={!isFormValid()}
        >
          Next step
        </Button>
      </Group>
    </Box>
  );
}

export default InvoiceForm;
