import {
  Modal,
  Text,
  Group,
  Stack,
  Button,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendar,
  IconNotes,
  IconUser,
  IconPencil,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useEffect, useState } from "react";
import CustomModal from "@/components/common/CustomMoodal";

interface Client {
  id: string;
  name: string;
}

interface Job {
  id: string;
  name: string;
  type: string;
  amount: number;
  startDate: string;
  endDate: string;
  hours: number;
  notes: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  client_id?: string;
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
      amount: null,
      hours: null,
      notes: "",
      startDate: new Date(),
      endDate: new Date(),
      client_id: "",
    },
  });

  useEffect(() => {
    if (job) {
      form.setValues({
        name: job.name || "",
        type: job.type || "",
        amount: job.amount || null,
        hours: job.hours || null,
        notes: job.notes || "",
        startDate: job.startDate ? new Date(job.startDate) : new Date(),
        endDate: job.endDate ? new Date(job.endDate) : new Date(),
        client_id: job.client_id || "",
      });
    }
  }, [job]);

  console.log("job", job);

  const updateJobMutation = useMutation({
    mutationFn: (updatedJob: Partial<Job>) => {
      const payload = {
        ...updatedJob,
        start_date: updatedJob.startDate,
        end_date: updatedJob.endDate,
      };
      return callApi.put(`/jobs/${job?.id}`, payload);
    },
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
      startDate: form.values.startDate.toISOString(),
      endDate: form.values.endDate.toISOString(),
    });
  };

  const startDate = new Date(job.startDate);
  const endDate = new Date(job.endDate);
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    // <Modal
    //   opened={opened}
    //   onClose={() => {
    //     setIsEditing(false);
    //     onClose();
    //   }}
    //   title={
    //     <Text fw={600} size="lg">
    //       {job.name}
    //     </Text>
    //   }
    //   size="md"

    <CustomModal
      opened={opened}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      title={"Job Details"}
      size="md"
    >
      {isEditing ? (
        <Stack gap="md">
          <TextInput label="Job Name" {...form.getInputProps("name")} />
          <Group grow>
            <DateInput
              label="Start Date"
              placeholder="Start Date"
              {...form.getInputProps("startDate")}
            />
            <DateInput
              label="End Date"
              placeholder="End Date"
              {...form.getInputProps("endDate")}
            />
          </Group>
          <Select
            label="Client"
            placeholder="Select client"
            data={clients.map((client: any) => ({
              value: client.value,
              label: client.label,
            }))}
            {...form.getInputProps("client_id")}
          />
          <Textarea label="Notes" {...form.getInputProps("notes")} />
          <Group justify="right" mt="md">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={updateJobMutation.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600} size="lg">
              {job.name}
            </Text>
            <Button
              leftSection={<IconPencil size={14} />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </Group>
          <Group>
            <IconCalendar size={20} />
            <Text>{dateRange}</Text>
          </Group>

          {job.client && (
            <Stack gap="xs">
              <Text fw={500}>Client Details</Text>
              <Group ml="md">
                <IconUser size={20} />
                <Stack gap={4}>
                  <Text>{job.client.name}</Text>
                  <Text size="sm" c="dimmed">
                    {job.client.email}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {job.client.phone}
                  </Text>
                </Stack>
              </Group>
            </Stack>
          )}

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
    </CustomModal>
  );
}
