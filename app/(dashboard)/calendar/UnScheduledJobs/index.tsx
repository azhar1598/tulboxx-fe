import React from "react";
import { Card, Text, Badge, Group, Avatar } from "@mantine/core";
import {
  IconGripVertical,
  IconClock,
  IconUser,
  IconCurrencyDollar,
  IconAlertCircle,
} from "@tabler/icons-react";
import styles from "../calendar.module.css";

const UnscheduledJobs = () => {
  const jobs = [
    {
      title: "Emerge...",
      status: "pending",
      client: "Robert Brown",
      time: "12:00 AM",
      amount: "8500.00",
    },
  ];

  return (
    <div className={styles["unscheduled-jobs"]}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">
          Unscheduled Jobs
        </Text>
        <Badge
          variant="filled"
          color="gray"
          leftSection={<IconAlertCircle size={14} />}
        >
          1
        </Badge>
      </Group>
      {jobs.map((job, index) => (
        <Card withBorder radius="md" padding="sm" key={index} mb="sm">
          <Group>
            <IconGripVertical size={20} color="gray" />
            <div style={{ flex: 1 }}>
              <Group justify="space-between">
                <Text fw={500}>{job.title}</Text>
                <Badge color="orange">{job.status}</Badge>
              </Group>
              <Group>
                <IconUser size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {job.client}
                </Text>
              </Group>
              <Group>
                <IconClock size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {job.time}
                </Text>
              </Group>
              <Group>
                <IconCurrencyDollar size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {job.amount}
                </Text>
              </Group>
            </div>
          </Group>
        </Card>
      ))}
    </div>
  );
};

export default UnscheduledJobs;
