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
import React, { useEffect, useState } from "react";

function InvoiceForm({ form, generateInvoice, isButtonEnabled, id }) {
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", rate: "", qty: 1, total: 0 },
  ]);

  const addLineItem = () => {
    const newId =
      form.values.lineItems.length > 0
        ? Math.max(...form.values.lineItems.map((item) => item.id)) + 1
        : 1;
    form.setFieldValue(`lineItems`, [
      ...form.values.lineItems,
      {
        id: newId,
        unitPrice: "",
        description: "",
        quantity: "",
        totalPrice: "",
      },
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
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
  };

  useEffect(() => {
    if (form.values.invoiceTotalAmount >= calculateGrandTotal()) {
      form.clearFieldError("invoiceTotalAmount");
      return;
    }

    form.setFieldError(
      "invoiceTotalAmount",
      "Invoice total amount is less than the grand total"
    );
  }, [form.values.lineItems]);

  return (
    <Box p={10}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Issue Date"
            valueFormat="DD MMM YYYY"
            placeholder="Date input"
            {...form.getInputProps("issueDate")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Due Date"
            placeholder="Select due date"
            valueFormat="DD MMM YYYY"
            icon={<IconCalendar size="1rem" />}
            {...form.getInputProps("dueDate")}
            minDate={form.values.issueDate}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Invoice Total Amount"
            placeholder="5,000"
            allowDecimal={false}
            leftSection={<IconCurrencyDollar stroke={2} size={15} />}
            allowNegative={false}
            {...form.getInputProps("invoiceTotalAmount")}
            onChange={(e) => {
              form.getInputProps(`invoiceTotalAmount`).onChange(Number(e));
            }}
            hideControls
          />
        </Grid.Col>

        {/* <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Invoice #"
            placeholder="$5,000"
            allowDecimal={false}
            allowNegative={false}
            disabled
            value="72645"
            // {...form.getInputProps("projectEstimate")}
            hideControls
          />
        </Grid.Col> */}

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

        <Grid.Col span={{ base: 12 }}>
          <Textarea
            label="Invoice Summary"
            placeholder="Example: Installing a drainage solution to prevent yard flooding."
            minRows={3}
            {...form.getInputProps("invoiceSummary")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Grid>
            {id === "standalone" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text fw={500} size="sm" mb="md">
                  Customer Information
                </Text>
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Customer Name"
                      placeholder="Enter customer name"
                      {...form.getInputProps("customerName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Email"
                      placeholder="customer@email.com"
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Phone"
                      placeholder="(555) 555-5555"
                      {...form.getInputProps("phone")}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text fw={500} size="sm" mb="md">
                Remit Payment To
              </Text>
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    label="Account Name"
                    placeholder="Type here..."
                    {...form.getInputProps("remitPayment.accountName")}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Account Number"
                    placeholder="Type here..."
                    {...form.getInputProps("remitPayment.accountNumber")}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Routing Number"
                    placeholder="Type here..."
                    {...form.getInputProps("remitPayment.routingNumber")}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Tax Id No."
                    placeholder="Type here..."
                    {...form.getInputProps("remitPayment.taxId")}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Link href="/account" className="underline text-blue-600">
                    Edit
                  </Link>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>

      <Group justify="flex-start" mt="xl">
        <Button
          disabled={!isButtonEnabled}
          type="submit"
          loading={generateInvoice.isPending}
        >
          Generate Invoice
        </Button>
      </Group>
    </Box>
  );
}

export default InvoiceForm;
