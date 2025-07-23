import React from "react";
import { Card, Text, Badge, Group } from "@mantine/core";
import {
  IconGripVertical,
  IconClock,
  IconUser,
  IconCurrencyDollar,
  IconAlertCircle,
  IconCalendar,
} from "@tabler/icons-react";
import styles from "../calendar.module.css";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";

interface Job {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  hours: number;
  notes: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ScheduledJobsProps {
  onJobSelect: (job: Job) => void;
}

const ScheduledJobs = ({ onJobSelect }: ScheduledJobsProps) => {
  const getJobsQuery = useQuery({
    queryKey: ["get-jobs"],
    queryFn: async () => {
      const response = await callApi.get(`/jobs`, {
        params: {
          limit: -1,
        },
      });
      return response.data;
    },
    select(data) {
      return data?.data as Job[];
    },
  });

  const jobs = getJobsQuery.data || [];
  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={styles["unscheduled-jobs"]}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">
          Scheduled Jobs
        </Text>
        <Badge
          variant="filled"
          color="gray"
          leftSection={<IconAlertCircle size={14} />}
        >
          {jobs.length}
        </Badge>
      </Group>
      {sortedJobs.map((job) => (
        <Card
          withBorder
          radius="md"
          padding="sm"
          key={job.id}
          mb="sm"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onJobSelect(job)}
        >
          <Group>
            <IconGripVertical size={20} color="gray" />
            <div style={{ flex: 1 }}>
              <Group justify="space-between">
                <Text fw={500}>{job.name}</Text>
                <Badge color="blue">{job.type}</Badge>
              </Group>
              <Group>
                <IconUser size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {job.client.name}
                </Text>
              </Group>
              <Group>
                <IconCalendar size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {formatDate(job.date)}
                </Text>
              </Group>
              <Group>
                <IconClock size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {formatTime(job.date)} • {job.hours}h
                </Text>
              </Group>
              <Group>
                <IconCurrencyDollar size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  ${job.amount.toLocaleString()}
                </Text>
              </Group>
            </div>
          </Group>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledJobs;
