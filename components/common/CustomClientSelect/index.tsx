import {
  Paper,
  TextInput,
  Box,
  UnstyledButton,
  Button,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CustomModal from "../CustomMoodal";
import ClientForm from "@/app/(dashboard)/clients/add/ClientForm";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";

const CustomClientSelect = ({ form }: { form: any }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const ref = useClickOutside(() => close());

  const [clientModalOpened, setClientModalOpened] = useState(false);

  const getClients = useQuery({
    queryKey: ["get-clients"],
    queryFn: async () => {
      const response = await callApi.get(`/clients`, {
        params: {
          limit: -1,
        },
      });

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

      <CustomModal
        opened={clientModalOpened}
        onClose={() => setClientModalOpened(false)}
        title="ADD NEW CLIENT"
        size="md"
      >
        <ClientForm
          setClientModalOpened={setClientModalOpened}
          getClients={getClients}
          estimateForm={form}
          invoiceForm={form}
          md={12}
        />
      </CustomModal>
    </Box>
  );
};

export default CustomClientSelect;
