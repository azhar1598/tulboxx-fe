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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import { useEffect } from "react";
import CustomModal from "@/components/common/CustomMoodal";

const formSchema = z.object({
  name: z.string().min(1, "Stage name is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});

const EditStageModal = ({
  opened,
  onClose,
  currentStageSelected,
  setCurrentStageSelected,
}) => {
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      color: "",
      description: "",
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (!currentStageSelected) return;
    form.setValues({
      name: currentStageSelected?.title,
      color: currentStageSelected?.color,
      description: currentStageSelected?.description || "",
    });
    form.resetDirty();
  }, [currentStageSelected?.id]);

  const updateStageMutation = useMutation({
    mutationFn: (values: any) =>
      callApi.put(`/pipeline/stages/${currentStageSelected.id}`, values),
    onSuccess: () => {
      notification.success("Stage updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-leads"] });
      queryClient.invalidateQueries({ queryKey: ["get-stages"] });
      onClose();
      setCurrentStageSelected(null);
      form.reset();
    },
    onError: (error: any) => {
      notification.error(error?.data?.message || "Failed to add stage");
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    updateStageMutation.mutate(values);
  };

  console.log("form.values", form.values);

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Update Stage"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Stage Title"
            placeholder="Enter stage name"
            {...form.getInputProps("name")}
            withAsterisk
          />
          <Select
            label="Color"
            {...form.getInputProps("color")}
            data={[
              { value: "#10b981", label: "Green" },
              { value: "#3b82f6", label: "Blue" },
              { value: "#f59e0b", label: "Yellow" },
              { value: "#ef4444", label: "Red" },
              { value: "#8b5cf6", label: "Purple" },
              { value: "#06b6d4", label: "Cyan" },
            ]}
            withAsterisk
          />
          {/* <NumberInput
            label="Default Probability (%)"
            placeholder="Enter default probability"
            value={form.probability}
            onChange={(value: number) =>
              setForm({ ...form, probability: value.toString() })
            }
            min={0}
            max={100}
            rightSection="%"
          /> */}

          <Textarea
            rows={2}
            label="Description"
            placeholder="Enter stage description"
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="md">
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button
              type="submit"
              loading={updateStageMutation.isPending}
              disabled={!form.isValid() || !form.isDirty()}
            >
              Update Stage
            </Button>
          </Group>
        </Stack>
      </form>
    </CustomModal>
  );
};

export default EditStageModal;
