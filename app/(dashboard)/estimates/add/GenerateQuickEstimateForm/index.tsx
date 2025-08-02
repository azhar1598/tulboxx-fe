import ClientForm from "@/app/(dashboard)/clients/add/ClientForm";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import callApi from "@/services/apiService";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  IconBuilding,
  IconCurrencyDollar,
  IconHome,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

function GenerateQuickEstimateForm({
  form,
  active,
  nextStep,
  prevStep,
  setClientModalOpened,
  getClients,
  generateEstimation,
}) {
  // Check if required fields are filled
  const isFormValid = () => {
    return (
      form.values.projectName?.trim() &&
      form.values.clientId?.trim() &&
      form.values.projectEstimate
    );
  };

  const objectToFormData = (
    obj: any,
    formData = new FormData(),
    parentKey = ""
  ) => {
    if (obj && typeof obj === "object" && !(obj instanceof File)) {
      Object.keys(obj).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;

        // Check if the key is 'menuImages' to append all values under the same key

        objectToFormData(obj[key], formData, fullKey);
      });
    } else {
      // Only append if the value is not an empty string
      if (obj !== "") {
        formData.append(parentKey, obj);
      }
    }
    return formData;
  };

  return (
    <div className="bg-white w-fulal mt-5 page-main-wrapper p-[20px] mb-20">
      <form
        onSubmit={form.onSubmit(() => {
          const newFormValues = structuredClone(form.values);
          // const formData: any = objectToFormData(newFormValues);

          generateEstimation.mutate(newFormValues);
        })}
      >
        <Paper>
          <Stack gap={10}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Flex justify="space-between" align="center" className="">
                  <Select
                    label="Choose Client"
                    placeholder="Search Clients..."
                    data={getClients?.data}
                    searchable
                    clearable
                    w="75%"
                    {...form.getInputProps("clientId")}
                    rightSection={<IconSearch size={16} color="gray" />}
                  />
                  <Button
                    size="sm"
                    color="white"
                    mt={25}
                    leftSection={<IconPlus size={16} color="white" />}
                    onClick={() => setClientModalOpened(true)}
                  >
                    <Text size="14px" fw={500}>
                      New Client
                    </Text>
                  </Button>
                </Flex>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Project Name"
                  placeholder="Type here..."
                  className=""
                  {...form.getInputProps("projectName")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Project Estimate"
                  placeholder="$5,000"
                  className=""
                  allowDecimal={false}
                  allowNegative={false}
                  hideControls
                  leftSection={<IconCurrencyDollar stroke={2} size={15} />}
                  {...form.getInputProps("projectEstimate")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Additional Notes"
                  placeholder="Additional Notes"
                  minRows={3}
                  {...form.getInputProps("additionalNotes")}
                />
              </Grid.Col>
            </Grid>
          </Stack>

          <Group justify="flex-start" mt="xl">
            <Button
              type="submit"
              disabled={!isFormValid()}
              loading={generateEstimation.isPending}
            >
              Generate Estimate
            </Button>
          </Group>
        </Paper>
      </form>
    </div>
  );
}

export default GenerateQuickEstimateForm;
