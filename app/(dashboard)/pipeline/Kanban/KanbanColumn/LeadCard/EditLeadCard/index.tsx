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
import { useEffect } from "react";
import CustomModal from "@/components/common/CustomMoodal";

const formSchema = z.object({
  customerId: z.string().min(1, "Client is required"),
  stageId: z.string().min(1, "Stage is required"),
  estimatedValue: z.number().optional(),
  expectedCloseDate: z.date().optional().nullable(),
  notes: z.string().optional(),
});

const EditLeadModal = ({
  opened,
  onClose,
  getClients,
  getStages,
  selectedLead,
}) => {
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  console.log("selectedLead", selectedLead);

  const form = useForm({
    initialValues: {
      customerId: selectedLead?.customerId,
      stageId: selectedLead?.stageId,
      estimatedValue: selectedLead?.estimatedValue,
      expectedCloseDate: selectedLead?.expectedCloseDate,
      notes: selectedLead?.notes,
      id: selectedLead?.id,
      name: selectedLead?.name,
      percentage: selectedLead?.percentage,
      value: selectedLead?.value,
      // date: selectedLead?.date,
      avatar: selectedLead?.avatar,
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (!selectedLead) return;
    form.setValues({
      customerId: selectedLead?.customerId,
      stageId: selectedLead?.stageId,
      estimatedValue: selectedLead?.estimatedValue,
      expectedCloseDate: selectedLead?.expectedCloseDate
        ? new Date(`${selectedLead.expectedCloseDate}T00:00:00`)
        : null,
      notes: selectedLead?.notes,
      id: selectedLead?.id,
      name: selectedLead?.name,
      percentage: selectedLead?.percentage,
      value: selectedLead?.value,
    });
    form.resetDirty();
  }, [selectedLead]);

  const updateLeadMutation = useMutation({
    mutationFn: (values: any) =>
      callApi.patch(`/pipeline/leads/${selectedLead.id}`, values),
    onSuccess: () => {
      notification.success("Lead updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-leads"] });
      queryClient.invalidateQueries({ queryKey: ["get-stages"] });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      notification.error(error?.data?.message || "Failed to update lead");
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    updateLeadMutation.mutate(values);
  };

  return (
    <CustomModal opened={opened} onClose={onClose} title="Edit Lead" size="md">
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
              loading={updateLeadMutation.isPending}
              disabled={!form.isValid() || !form.isDirty()}
            >
              Update Lead
            </Button>
          </Group>
        </Stack>
      </form>
    </CustomModal>
  );
};

export default EditLeadModal;
