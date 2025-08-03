import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import { IconCurrencyDollar, IconSearch } from "@tabler/icons-react";
import { DateInput, DatePickerInput } from "@mantine/dates";
import CustomModal from "@/components/common/CustomMoodal";

const formSchema = z.object({
  customerId: z.string().min(1, "Client is required"),
  stageId: z.string().min(1, "Stage is required"),
  estimatedValue: z.number().optional(),
  expectedCloseDate: z.date().optional().nullable(),
  notes: z.string().optional(),
});

const AddLeadModal = ({ opened, onClose, getClients, getStages }) => {
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      customerId: "",
      stageId: "",
      estimatedValue: undefined,
      expectedCloseDate: null,
      notes: "",
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
  });

  const addLeadMutation = useMutation({
    mutationFn: (values: any) => callApi.post("/pipeline/leads", values),
    onSuccess: () => {
      notification.success("Lead added successfully");
      queryClient.invalidateQueries({ queryKey: ["get-leads"] });
      queryClient.invalidateQueries({ queryKey: ["get-stages"] });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      notification.error(error?.data?.message || "Failed to add lead");
    },
  });

  const handleSubmit = (values: any) => {
    const leads: any[] | undefined = queryClient.getQueryData(["get-leads"]);

    console.log("leads", leads, values);
    if (
      leads &&
      leads.some((lead) => lead.client_id.toString() === values.customerId)
    ) {
      notification.error("This client is already assigned to a lead.");
      return;
    }
    addLeadMutation.mutate(values);
  };

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Add New Lead"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Choose Client"
            placeholder="Search Clients..."
            data={getClients?.data}
            searchable
            clearable
            w=""
            {...form.getInputProps("customerId")}
            rightSection={<IconSearch size={16} color="gray" />}
            withAsterisk
          />
          <Select
            label="Stage"
            placeholder="Select a stage"
            data={getStages?.data || []}
            {...form.getInputProps("stageId")}
            withAsterisk
          />
          <NumberInput
            label="Estimated Value"
            placeholder="Enter estimated value"
            {...form.getInputProps("estimatedValue")}
            leftSection={<IconCurrencyDollar size={16} color="gray" />}
            hideControls
            allowDecimal={false}
            allowNegative={false}
          />

          <DateInput
            placeholder="Date input"
            label="Expected Close Date"
            {...form.getInputProps("expectedCloseDate")}
            {...form.getInputProps("expectedCloseDate")}
          />
          <Textarea
            label="Notes"
            placeholder="Enter any relevant notes"
            rows={3}
            {...form.getInputProps("notes")}
          />

          <Group justify="flex-end" mt="md">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              loading={addLeadMutation.isPending}
              disabled={!form.isValid()}
            >
              Add Lead
            </Button>
          </Group>
        </Stack>
      </form>
    </CustomModal>
  );
};

export default AddLeadModal;
