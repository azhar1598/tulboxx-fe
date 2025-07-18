"use client";

import React, { useState, useMemo } from "react";
import {
  Stack,
  Group,
  Paper,
  Text,
  Button,
  TextInput,
  Title,
  Badge,
  Avatar,
  Box,
  Menu,
  ActionIcon,
  Grid,
  Card,
  ThemeIcon,
  Flex,
  ScrollArea,
  Modal,
  Select,
  NumberInput,
  Textarea,
  rem,
  SimpleGrid,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconUsers,
  IconCurrencyDollar,
  IconTarget,
  IconTrendingUp,
  IconCalendar,
  IconGripVertical,
  IconEdit,
  IconTrash,
  IconChevronRight,
  IconProgressCheck,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { PageHeader } from "@/components/common/PageHeader";

// Mock data for the lead management system
const mockLeads = {
  "new-lead": {
    id: "new-lead",
    title: "New Lead",
    color: "#10b981",
    leads: [],
    value: 0,
    weighted: 0,
  },
  "lead-achieved": {
    id: "lead-achieved",
    title: "Lead achieved",
    color: "#10b981",
    leads: [
      {
        id: "1",
        name: "Michael Thompson",
        percentage: 30,
        value: 12000,
        date: "25/06/2025",
        avatar: "MT",
      },
      {
        id: "2",
        name: "James Wilson",
        percentage: 35,
        value: 6800,
        date: "13/05/2025",
        avatar: "JW",
      },
    ],
    value: 18800,
    weighted: 5980,
  },
  contacted: {
    id: "contacted",
    title: "Contacted",
    color: "#3b82f6",
    leads: [
      {
        id: "3",
        name: "Kevin Miller",
        percentage: 50,
        value: 28000,
        date: "20/07/2025",
        avatar: "KM",
      },
      {
        id: "4",
        name: "Robert Martinez",
        percentage: 55,
        value: 18000,
        date: "05/08/2025",
        avatar: "RM",
      },
    ],
    value: 46000,
    weighted: 25300,
  },
  estimate: {
    id: "estimate",
    title: "Estimate",
    color: "#f59e0b",
    leads: [
      {
        id: "5",
        name: "Brian Rogers",
        percentage: 75,
        value: 45000,
        date: "01/08/2025",
        avatar: "BR",
      },
      {
        id: "6",
        name: "William Anderson",
        percentage: 80,
        value: 22000,
        date: "15/08/2025",
        avatar: "WA",
      },
    ],
    value: 67000,
    weighted: 50250,
  },
};

const LeadCard = ({ lead }) => (
  <Card
    shadow="sm"
    padding="md"
    radius="md"
    withBorder
    style={{
      marginBottom: rem(8),
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
    className="hover:shadow-lg hover:scale-[1.02]"
  >
    <Stack gap="xs">
      <Group justify="space-between" align="flex-start">
        <Group gap="xs">
          <div
            style={{
              width: rem(12),
              height: rem(12),
              borderRadius: "50%",
              backgroundColor: "#e9ecef",
              border: "2px solid #dee2e6",
            }}
          />
          <Box>
            <Text size="sm" fw={500}>
              {lead.name}
            </Text>
            <Text size="xs" c="dimmed">
              {lead.percentage}%
            </Text>
          </Box>
        </Group>
        <Menu withinPortal position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={14} />}>
              Edit Lead
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">
              Delete Lead
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Value
          </Text>
          <Text size="sm" fw={600}>
            ${lead.value.toLocaleString()}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Due Date
          </Text>
          <Text size="xs" c="dimmed">
            {lead.date}
          </Text>
        </Group>
      </Stack>
    </Stack>
  </Card>
);

const KanbanColumn = ({ column, leads }) => (
  <Paper
    withBorder
    radius="md"
    p="md"
    style={{
      minWidth: rem(280),
      maxWidth: rem(320),
      flex: "0 0 auto",
      backgroundColor: "#fafafa",
      height: "fit-content",
    }}
  >
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <div
            style={{
              width: rem(8),
              height: rem(8),
              borderRadius: "50%",
              backgroundColor: column.color,
            }}
          />
          <Text size="sm" fw={600} c="dark">
            {column.title}
          </Text>
        </Group>
        <Menu withinPortal position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={14} />}>
              Edit Stage
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">
              Delete Stage
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          {leads.length} leads • ${column.weighted.toLocaleString()} weighted
        </Text>
      </Group>

      <Box style={{ minHeight: rem(200) }}>
        {leads.length === 0 ? (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: rem(200),
              color: "#868e96",
              fontSize: rem(14),
              border: "2px dashed #dee2e6",
              borderRadius: rem(4),
            }}
          >
            No leads in this stage
          </Box>
        ) : (
          <Stack gap="xs">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  </Paper>
);

const AddLeadModal = ({ opened, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    value: "",
    percentage: "",
    stage: "new-lead",
    notes: "",
  });

  const handleSubmit = () => {
    console.log("Adding lead:", form);
    // Here you would typically call an API to add the lead
    onClose();
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      value: "",
      percentage: "",
      stage: "new-lead",
      notes: "",
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Lead" size="md">
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Enter lead name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextInput
          label="Email"
          placeholder="Enter email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextInput
          label="Phone"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <TextInput
          label="Company"
          placeholder="Enter company name"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <NumberInput
          label="Estimated Value"
          placeholder="Enter estimated value"
          value={form.value}
          onChange={(value) => setForm({ ...form, value })}
          leftSection="$"
        />
        <NumberInput
          label="Probability (%)"
          placeholder="Enter probability"
          value={form.percentage}
          onChange={(value) => setForm({ ...form, percentage: value })}
          min={0}
          max={100}
          rightSection="%"
        />
        <Select
          label="Stage"
          value={form.stage}
          onChange={(value) => setForm({ ...form, stage: value })}
          data={[
            { value: "new-lead", label: "New Lead" },
            { value: "lead-achieved", label: "Lead Achieved" },
            { value: "contacted", label: "Contacted" },
            { value: "estimate", label: "Estimate" },
          ]}
        />
        <Textarea
          label="Notes"
          placeholder="Enter any additional notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Lead</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const AddStageModal = ({ opened, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    color: "#3b82f6",
    probability: "",
  });

  const handleSubmit = () => {
    console.log("Adding stage:", form);
    // Here you would typically call an API to add the stage
    onClose();
    setForm({
      title: "",
      color: "#3b82f6",
      probability: "",
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Stage" size="md">
      <Stack gap="md">
        <TextInput
          label="Stage Title"
          placeholder="Enter stage name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Select
          label="Color"
          value={form.color}
          onChange={(value) => setForm({ ...form, color: value })}
          data={[
            { value: "#10b981", label: "Green" },
            { value: "#3b82f6", label: "Blue" },
            { value: "#f59e0b", label: "Yellow" },
            { value: "#ef4444", label: "Red" },
            { value: "#8b5cf6", label: "Purple" },
            { value: "#06b6d4", label: "Cyan" },
          ]}
        />
        <NumberInput
          label="Default Probability (%)"
          placeholder="Enter default probability"
          value={form.probability}
          onChange={(value) => setForm({ ...form, probability: value })}
          min={0}
          max={100}
          rightSection="%"
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Stage</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default function PipelinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState(mockLeads);
  const [addLeadOpened, { open: openAddLead, close: closeAddLead }] =
    useDisclosure(false);
  const [addStageOpened, { open: openAddStage, close: closeAddStage }] =
    useDisclosure(false);

  // Calculate statistics
  const statistics = useMemo(() => {
    const allLeads = Object.values(columns).flatMap((column) => column.leads);
    const totalLeads = allLeads.length;
    const pipelineValue = Object.values(columns).reduce(
      (sum, column) => sum + column.value,
      0
    );
    const weightedValue = Object.values(columns).reduce(
      (sum, column) => sum + column.weighted,
      0
    );
    const activeStages = Object.values(columns).filter(
      (column) => column.leads.length > 0
    ).length;

    return {
      totalLeads,
      pipelineValue,
      weightedValue,
      activeStages,
    };
  }, [columns]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        maxWidth: "90vw",
        overflow: "hidden",
      }}
    >
      <Stack gap="xl">
        {/* Header */}
        <PageHeader
          title="Pipeline"
          rightSection={
            <Group>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openAddLead}
                size="sm"
              >
                Add Lead
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                size="sm"
                onClick={openAddStage}
              >
                Add Stage
              </Button>
            </Group>
          }
        />

        {/* Search and Filter Bar */}
        <Paper withBorder p="md" radius="md" shadow="sm">
          <Group justify="space-between">
            <TextInput
              placeholder="Search leads..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, maxWidth: rem(400) }}
            />
            <Group>
              <Button leftSection={<IconFilter size={16} />} size="sm">
                More
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Statistics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <Paper
            withBorder
            p="md"
            radius="md"
            shadow="sm"
            style={{ height: "100%" }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                  Total Leads
                </Text>
                <Text size="2rem" fw={700} lh={1} c="blue">
                  {statistics.totalLeads}
                </Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" color="blue" variant="light">
                <IconUsers size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper
            withBorder
            p="md"
            radius="md"
            shadow="sm"
            style={{ height: "100%" }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                  Pipeline Value
                </Text>
                <Text size="2rem" fw={700} lh={1} c="green">
                  ${statistics.pipelineValue.toLocaleString()}
                </Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" color="green" variant="light">
                <IconCurrencyDollar size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper
            withBorder
            p="md"
            radius="md"
            shadow="sm"
            style={{ height: "100%" }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                  Weighted Value
                </Text>
                <Text size="2rem" fw={700} lh={1} c="orange">
                  ${statistics.weightedValue.toLocaleString()}
                </Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" color="orange" variant="light">
                <IconTarget size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper
            withBorder
            p="md"
            radius="md"
            shadow="sm"
            style={{ height: "100%" }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                  Active Stages
                </Text>
                <Text size="2rem" fw={700} lh={1} c="violet">
                  {statistics.activeStages}
                </Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" color="violet" variant="light">
                <IconProgressCheck size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Kanban Board */}
        <ScrollArea type="auto" style={{ width: "78vw" }}>
          <Flex
            gap="md"
            style={{
              minWidth: "max-content",
              paddingBottom: rem(20),
              paddingLeft: rem(20),
              paddingRight: rem(20),
              width: "100%",
            }}
          >
            {Object.values(columns).map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                leads={column.leads}
              />
            ))}
          </Flex>
        </ScrollArea>
      </Stack>

      {/* Add Lead Modal */}
      <AddLeadModal opened={addLeadOpened} onClose={closeAddLead} />

      {/* Add Stage Modal */}
      <AddStageModal opened={addStageOpened} onClose={closeAddStage} />
    </div>
  );
}
