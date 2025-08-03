import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import { IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import CustomModal from "@/components/common/CustomMoodal";

const formSchema = z.object({
  jobId: z.string().min(1, "Job selection is required"),
  date: z.date({ required_error: "Date is required" }),
  notes: z.string().optional(),
  option: z.any(), // to store the selected job option
});

export const ScheduleJobModal: React.FC<{
  opened: boolean;
  onClose: () => void;
}> = ({ opened, onClose }) => {
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      jobId: "",
      date: null,
      notes: "",
      option: null,
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
  });

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
      console.log("data", data);
      const options = data?.data?.map((option) => ({
        label: `${option.name}`,
        value: option.id.toString(),
        ...option,
      }));

      console.log("options", options);

      return options;
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: (values: any) => {
      // Extract only the needed fields from the selected option
      const payload = {
        amount: values.option.amount,
        customer: values.option.client_id,
        date: values.date.toISOString(),
        description: values.option.description,
        hours: values.option.hours,
        name: values.option.name,
        notes: values.notes,
        type: values.option.type,
        user_id: values.option.user_id,
      };

      return callApi.put(`/jobs/${values.jobId}`, payload);
    },
    onSuccess: () => {
      notification.success("Job scheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["get-jobs"] }); // Update this line
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      notification.error(error?.data?.message || "Failed to schedule job");
    },
  });

  const handleSubmit = (values: any) => {
    updateJobMutation.mutate({
      jobId: values.jobId,
      date: values.date,
      notes: values.notes,
      option: values.option,
    });
  };

  console.log("form----->", form.values);

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Schedule Job"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Choose Job"
            placeholder="Search Jobs..."
            data={getJobsQuery?.data}
            searchable
            clearable
            withAsterisk
            {...form.getInputProps("jobId")}
            rightSection={<IconSearch size={16} color="gray" />}
            onChange={(value, option) => {
              form.setFieldValue("jobId", value);
              form.setFieldValue("option", option); // Store the full option object in form
            }}
          />

          <DateInput
            {...form.getInputProps("date")}
            label="Scheduled Date"
            placeholder="Select a date"
            withAsterisk
            valueFormat="DD-MM-YYYY"
            minDate={new Date()} // This will disable all past dates
          />
          <Textarea
            label="Additional Notes"
            placeholder="Start typing..."
            {...form.getInputProps("notes")}
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              loading={updateJobMutation.isPending}
              disabled={!form.isValid()}
            >
              Schedule Job
            </Button>
          </Group>
        </Stack>
      </form>
    </CustomModal>
  );
};
