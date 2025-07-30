import {
  Modal,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  Select,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconNotes,
  IconUser,
  IconPencil,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
}

interface Job {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  hours: number;
  notes: string;
  client: {
    id: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["get-clients"],
    queryFn: async () => {
      const response = await callApi.get("/clients", { params: { limit: -1 } });
      return response.data?.data.map((client: any) => ({
        value: client.id,
        label: client.name,
      }));
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
      amount: 0,
      hours: 0,
      notes: "",
      date: new Date(),
      client_id: "",
    },
  });

  useEffect(() => {
    if (job) {
      form.setValues({
        name: job.name || "",
        type: job.type || "",
        amount: job.amount || 0,
        hours: job.hours || 0,
        notes: job.notes || "",
        date: job.date ? new Date(job.date) : new Date(),
        client_id: job.client?.id || "",
      });
    }
  }, [job]);

  const updateJobMutation = useMutation({
    mutationFn: (updatedJob: Partial<Job>) =>
      callApi.put(`/jobs/${job?.id}`, updatedJob),
    onSuccess: () => {
      notification.success("Job updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["get-jobs"] });
      setIsEditing(false);
      onClose();
    },
    onError: (error: any) => {
      notification.error(error.data.message);
    },
  });

  if (!job) return null;

  const handleSave = () => {
    updateJobMutation.mutate({
      ...form.values,
      date: form.values.date.toISOString(),
    });
  };

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
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      title={
        <Text fw={600} size="lg">
          {job.name}
        </Text>
      }
      size="md"
    >
      {isEditing ? (
        <Stack gap="md">
          <TextInput label="Job Name" {...form.getInputProps("name")} />
          <TextInput label="Job Type" {...form.getInputProps("type")} />
          <DateInput
            label="Date"
            placeholder="Select date"
            {...form.getInputProps("date")}
          />
          <Select
            label="Client"
            placeholder="Select client"
            data={clients}
            {...form.getInputProps("client_id")}
          />
          <NumberInput label="Amount" {...form.getInputProps("amount")} />
          <NumberInput label="Hours" {...form.getInputProps("hours")} />
          <Textarea label="Notes" {...form.getInputProps("notes")} />
          <Group justify="right" mt="md">
            <Button variant="default" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={updateJobMutation.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack gap="md">
          <Group justify="space-between">
            <Badge size="lg" variant="light" color="blue">
              {job.type}
            </Badge>
            <Button
              leftSection={<IconPencil size={14} />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
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
      )}
    </Modal>
  );
}
