import {
  SimpleGrid,
  Group,
  Text,
  ThemeIcon,
  Paper,
  Stack,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconProgressCheck,
  IconTarget,
  IconUsers,
} from "@tabler/icons-react";
import React, { useMemo } from "react";

function StatisticsCards({ columns, getLeads, stages }) {
  const statistics = useMemo(() => {
    const allLeads = Object.values(columns).flatMap(
      (column: any) => column.leads
    );
    const totalLeads = allLeads.length;
    const pipelineValue = Object.values(columns).reduce(
      (sum, column: any) => sum + column.value,
      0
    );
    const weightedValue = Object.values(columns).reduce(
      (sum, column: any) => sum + column.weighted,
      0
    );
    const activeStages = Object.values(columns).filter(
      (column: any) => column.leads.length > 0
    ).length;

    return {
      totalLeads,
      pipelineValue,
      weightedValue,
      activeStages,
    };
  }, [columns]);

  console.log("getLeads", getLeads);

  const totalPipelineValue = useMemo(() => {
    return getLeads?.reduce((sum, lead) => sum + lead.estimated_value, 0);
  }, [getLeads]);

  return (
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
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              {getLeads?.length}
            </Text>
          </Stack>
          <ThemeIcon size="lg" radius="md" color="dark.4" variant="light">
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
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              ${totalPipelineValue?.toLocaleString()}
            </Text>
          </Stack>
          <ThemeIcon size="lg" radius="md" color="slate.6" variant="light">
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
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              ${statistics.weightedValue.toLocaleString()}
            </Text>
          </Stack>
          <ThemeIcon size="lg" radius="md" color="slate.6" variant="light">
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
            <Text size="2rem" fw={700} lh={1} c="slate.8">
              {stages?.length}
            </Text>
          </Stack>
          <ThemeIcon size="lg" radius="md" color="slate.6" variant="light">
            <IconProgressCheck size={20} />
          </ThemeIcon>
        </Group>
      </Paper>
    </SimpleGrid>
  );
}

export default StatisticsCards;
