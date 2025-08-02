import ClientForm from "@/app/(dashboard)/clients/add/ClientForm";
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

const CustomClientSelect = ({
  form,
  getClients,
  setClientModalOpened,
}: {
  form: any;
  getClients: any;
  setClientModalOpened: (opened: boolean) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const ref = useClickOutside(() => close());

  useEffect(() => {
    const selectedClient = getClients?.data?.find(
      (c) => c.value === form.values.clientId
    );
    if (selectedClient) {
      setSearch(selectedClient.label);
    } else if (!opened) {
      setSearch("");
    }
  }, [form.values.clientId, getClients?.data, opened]);

  const filteredClients = (getClients?.data || []).filter((client) =>
    client.label.toLowerCase().includes(search.toLowerCase().trim())
  );

  const items = filteredClients.map((item) => (
    <UnstyledButton
      key={item.value}
      p="xs"
      onClick={() => {
        form.setFieldValue("clientId", item.value);
        close();
      }}
      style={{ borderRadius: "var(--mantine-radius-sm)" }}
      className="hover:bg-gray-100 w-full"
    >
      <Text size="sm">{item.label}</Text>
    </UnstyledButton>
  ));

  return (
    <Box ref={ref} style={{ position: "relative" }}>
      <TextInput
        label="Choose Client"
        placeholder="Search Clients..."
        value={search}
        onChange={(event) => {
          setSearch(event.currentTarget.value);
          form.setFieldValue("clientId", null); // Clear selection when searching
          open();
        }}
        onFocus={open}
        rightSection={<IconSearch size={16} color="gray" />}
      />

      {opened && (
        <Paper
          shadow="md"
          withBorder
          p="md"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            marginTop: 4,
          }}
        >
          <Button
            fullWidth
            leftSection={<IconPlus size={16} />}
            onMouseDown={(e) => {
              // e.preventDefault();
              console.log("hello");
              setClientModalOpened(true);
              // close();
            }}
            mb="sm"
          >
            Add New Client
          </Button>

          <ScrollArea.Autosize mah={200}>
            {items.length > 0 ? (
              items
            ) : (
              <Text c="dimmed" ta="center" size="sm">
                Nothing found
              </Text>
            )}
          </ScrollArea.Autosize>
        </Paper>
      )}
    </Box>
  );
};

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
                <CustomClientSelect
                  form={form}
                  getClients={getClients}
                  setClientModalOpened={setClientModalOpened}
                />
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
