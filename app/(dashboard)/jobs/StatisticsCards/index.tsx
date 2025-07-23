import {
  SimpleGrid,
  Group,
  Text,
  ThemeIcon,
  Paper,
  Stack,
  Grid,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconProgressCheck,
  IconTarget,
  IconUsers,
  IconBriefcase,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo } from "react";

function StatisticsCards({ jobs }) {
  const stats = useMemo(() => {
    if (!jobs) {
      return {
        totalJobs: 0,
        inProgress: 0,
        scheduled: 0,
        completed: 0,
        activeJobsValue: 0,
      };
    }

    const now = dayjs();
    let inProgress = 0;
    let scheduled = 0;
    let completed = 0;
    let activeJobsValue = 0;

    jobs.forEach((job) => {
      if (job.status === "Completed") {
        completed++;
      } else if (dayjs(job.date).isAfter(now)) {
        scheduled++;
        activeJobsValue += job.amount;
      } else {
        inProgress++;
        activeJobsValue += job.amount;
      }
    });

    return {
      totalJobs: jobs.length,
      inProgress,
      scheduled,
      completed,
      activeJobsValue,
    };
  }, [jobs]);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="mb-4">
      <Paper withBorder p="md" radius="md" shadow="sm">
        <Group justify="space-between">
          <Text size="md" c="dimmed" fw={600}>
            Job Status Overview
          </Text>
          <ThemeIcon size="lg" radius="md" color="dark.4" variant="light">
            <IconBriefcase size={20} />
          </ThemeIcon>
        </Group>

        <Grid mt="md">
          <Grid.Col span={6}>
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              {stats.totalJobs}
            </Text>
            <Text size="sm" c="dimmed">
              Total Jobs
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              {stats.inProgress}
            </Text>
            <Text size="sm" c="dimmed">
              In Progress
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              {stats.scheduled}
            </Text>
            <Text size="sm" c="dimmed">
              Scheduled
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="2rem" fw={700} lh={1} c="dark.8">
              {stats.completed}
            </Text>
            <Text size="sm" c="dimmed">
              Completed
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <Group justify="space-between">
          <Text size="md" c="dimmed" fw={600}>
            Total Pipeline Value
          </Text>
          <ThemeIcon size="lg" radius="md" color="slate.6" variant="light">
            <IconCurrencyDollar size={20} />
          </ThemeIcon>
        </Group>

        <Stack gap="xs" mt="md">
          <Text size="2rem" fw={700} lh={1} c="dark.8">
            ${stats.activeJobsValue.toLocaleString()}
          </Text>
          <Text size="sm" c="dimmed">
            Active jobs estimated value
          </Text>
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}

export default StatisticsCards;
