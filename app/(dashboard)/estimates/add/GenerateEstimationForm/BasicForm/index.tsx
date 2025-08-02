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
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
  IconBuilding,
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

function BasicForm({
  form,
  active,
  nextStep,
  prevStep,
  setClientModalOpened,
  getClients,
}) {
  // Check if required fields are filled
  const isFormValid = () => {
    return form.values.projectName?.trim() && form.values.clientId?.trim();
  };

  return (
    <Box p={10}>
      <Divider mb="md" />

      <Stack gap={10}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {/* <Flex justify="space-between" align="center" className=""> */}
            {/* <Select
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
              </Button> */}
            <CustomClientSelect
              form={form}
              getClients={getClients}
              setClientModalOpened={setClientModalOpened}
            />
            {/* </Flex> */}
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
            <Text size="14px" fw={500} mt={7}>
              Project Type
            </Text>
            <Radio.Group
              {...form.getInputProps("type")}
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
        </Grid>

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
    </Box>
  );
}

export default BasicForm;
