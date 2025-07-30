import { Modal, Text, Group, Badge, Stack, Button } from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconNotes,
  IconUser,
} from "@tabler/icons-react";

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

interface JobDetailsModalProps {
  job: Job | null;
  opened: boolean;
  onClose: () => void;
}

export function JobDetailsModal({
  job,
  opened,
  onClose,
}: JobDetailsModalProps) {
  if (!job) return null;

  const jobDate = new Date(job.date);
  const formattedDate = jobDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          {job.name}
        </Text>
      }
      size="md"
    >
      <Stack gap="md">
        <Group>
          <Badge size="lg" variant="light" color="blue">
            {job.type}
          </Badge>
        </Group>

        <Group>
          <IconCalendar size={20} />
          <Text>{formattedDate}</Text>
        </Group>

        <Group>
          <IconClock size={20} />
          <Text>{job.hours} hours</Text>
        </Group>

        <Group>
          <IconCurrencyDollar size={20} />
          <Text>${job.amount}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Client Details</Text>
          <Group ml="md">
            <IconUser size={20} />
            <Stack gap={4}>
              <Text>{job.client?.name}</Text>
              <Text size="sm" c="dimmed">
                {job.client?.email}
              </Text>
              <Text size="sm" c="dimmed">
                {job.client?.phone}
              </Text>
            </Stack>
          </Group>
        </Stack>

        {job.notes && (
          <Stack gap="xs">
            <Text fw={500}>Notes</Text>
            <Group ml="md">
              <IconNotes size={20} />
              <Text>{job.notes}</Text>
            </Group>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
