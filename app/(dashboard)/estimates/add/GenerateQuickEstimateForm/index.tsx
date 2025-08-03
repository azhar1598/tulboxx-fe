import ClientForm from "@/app/(dashboard)/clients/add/ClientForm";
import CustomClientSelect from "@/components/common/CustomClientSelect";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import callApi from "@/services/apiService";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Radio,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
  IconBuilding,
  IconCurrencyDollar,
  IconHome,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

function GenerateQuickEstimateForm({
  form,
  active,
  nextStep,
  prevStep,
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
                <CustomClientSelect form={form} />
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
                <Text size="14px" fw={500} mt={7}>
                  Project Type
                </Text>
                <Radio.Group
                  {...form.getInputProps("projectType")}
                  defaultValue="residential"
                  mt={12}
                >
                  <Group>
                    <Radio
                      value="residential"
                      label="Residential"
                      // leftSection={<IconHome size={16} />}
                    />
                    <Radio
                      value="commercial"
                      label="Commercial"
                      // leftSection={<IconBuilding size={16} />}
                    />
                  </Group>
                </Radio.Group>
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
