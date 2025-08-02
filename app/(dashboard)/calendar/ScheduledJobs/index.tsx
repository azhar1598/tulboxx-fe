import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { Card, Text, Badge, Group, Stack, Flex } from "@mantine/core";
import {
  IconUser,
  IconCurrencyDollar,
  IconAlertCircle,
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

const DraggableJobCard = ({
  job,
  onJobSelect,
}: {
  job: Job;
  onJobSelect: (job: Job) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: { job },
    });

  const style: React.CSSProperties = {
    cursor: isDragging ? "grabbing" : "grab",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        withBorder
        radius="md"
        padding="sm"
        mb="sm"
        className="hover:shadow-lg transition-shadow"
        onClick={() => onJobSelect(job)}
      >
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500} size="sm">
              {job.name}
            </Text>
            <Badge color="teal" variant="light">
              {job.type}
            </Badge>
          </Group>
          <Group gap="xs">
            <IconUser size={16} color="gray" />
            <Text size="xs" c="dimmed">
              {job.client?.name}
            </Text>
          </Group>
          <Group gap="xs">
            <IconCurrencyDollar size={16} color="gray" />
            <Text size="xs" c="dimmed">
              ${job.amount?.toLocaleString()}
            </Text>
          </Group>
        </Stack>
      </Card>
    </div>
  );
};

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
  const unscheduledJobs = jobs.filter(
    (job) => !job.date || isNaN(new Date(job.date).getTime())
  );

  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      className={styles["unscheduled-jobs"]}
    >
      <Flex justify="space-between" mb="md">
        <Text fw={700} size="xl">
          Unscheduled Jobs
        </Text>
        <Badge
          size="lg"
          variant="filled"
          color="gray"
          leftSection={<IconAlertCircle size={16} />}
        >
          {unscheduledJobs.length}
        </Badge>
      </Flex>
      <div className={styles["jobs-list"]}>
        {getJobsQuery.isLoading ? (
          <Text>Loading...</Text>
        ) : unscheduledJobs.length > 0 ? (
          unscheduledJobs.map((job) => (
            <DraggableJobCard
              key={job.id}
              job={job}
              onJobSelect={onJobSelect}
            />
          ))
        ) : (
          <Text c="dimmed" ta="center" mt="xl">
            No unscheduled jobs.
          </Text>
        )}
      </div>
    </Card>
  );
};

export default ScheduledJobs;
