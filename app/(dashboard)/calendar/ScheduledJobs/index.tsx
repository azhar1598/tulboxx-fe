import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { Card, Text, Badge, Group } from "@mantine/core";
import {
  IconGripVertical,
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
    data: { job },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        cursor: "grabbing",
      }
    : {};

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        withBorder
        radius="md"
        padding="sm"
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
                {job.client?.name}
              </Text>
            </Group>
            <Group>
              <IconCurrencyDollar size={16} color="gray" />
              <Text size="sm" c="dimmed">
                ${job.amount?.toLocaleString()}
              </Text>
            </Group>
          </div>
        </Group>
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
          {unscheduledJobs.length}
        </Badge>
      </Group>
      {unscheduledJobs.map((job) => (
        <DraggableJobCard key={job.id} job={job} onJobSelect={onJobSelect} />
      ))}
    </div>
  );
};

export default ScheduledJobs;
