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
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

function BasicForm({ form, active, nextStep, prevStep }) {
  const [clientModalOpened, setClientModalOpened] = useState(false);

  // Check if required fields are filled
  const isFormValid = () => {
    return (
      form.values.projectName?.trim() &&
      form.values.customerName?.trim() &&
      form.values.email?.trim() &&
      form.values.phone &&
      form.values.address?.trim() &&
      form.values.type?.trim()
    );
  };

  const getClients = useQuery({
    queryKey: ["get-clients"],
    queryFn: async () => {
      const response = await callApi.get(`/clients`);

      return response.data;
    },
    select(data) {
      console.log("data", data);
      const options = data?.data?.map((option) => ({
        label: `${option.name} - ${option.email}`,
        value: option.id.toString(),
      }));

      console.log("options", options);

      return options;
    },
  });

  console.log("getClients", getClients?.data);

  return (
    <Box p={10}>
      <Divider mb="md" />

      <Stack gap={10}>
        <TextInput
          label="Project Name"
          placeholder="Type here..."
          className="md:w-1/2"
          {...form.getInputProps("projectName")}
        />
        <Flex justify="space-between" align="center" className="md:w-1/2">
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

        {/* 
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
            {...form.getInputProps("email")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Customer Phone"
            allowDecimal={false}
            hideControls
            allowNegative={false}
            placeholder="(555) 555-5555"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }} mt={8}>
          <Text size="14px" fw={500} mb={5}>
            Customer Type
          </Text>
          <Radio.Group
            {...form.getInputProps("type")}
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
            {...form.getInputProps("address")}
          />
        </Grid.Col> */}
      </Stack>

      <Group justify="flex-start" mt="xl">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!isFormValid()}>
          Next step
        </Button>
      </Group>

      <Modal
        opened={clientModalOpened}
        onClose={() => setClientModalOpened(false)}
        title="Create New Client"
        size="md"
      >
        <ClientForm md={12} setClientModalOpened={setClientModalOpened} />
      </Modal>
    </Box>
  );
}

export default BasicForm;
