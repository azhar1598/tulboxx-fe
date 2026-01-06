import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  ColorSwatch,
  CheckIcon,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import CustomModal from "@/components/common/CustomMoodal";

const formSchema = z.object({
  name: z.string().min(1, "Stage name is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});

const STAGE_COLORS = [
  { value: "#60a5fa", label: "Blue" },
  { value: "#4ade80", label: "Green" },
  { value: "#f87171", label: "Red" },
  { value: "#fb923c", label: "Orange" },
  { value: "#facc15", label: "Yellow" },
  { value: "#c084fc", label: "Purple" },
  { value: "#f472b6", label: "Pink" },
];

const AddStageModal = ({ opened, onClose }) => {
  const notification = usePageNotifications();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    initialValues: {
      name: "",
      color: "#60a5fa",
      description: "",
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
  });
  console.log("temmmmm");
  const addStageMutation = useMutation({
    mutationFn: (values: any) => callApi.post("/pipeline/stages", values),
    onSuccess: () => {
      notification.success("Stage added successfully");
      queryClient.invalidateQueries({ queryKey: ["get-leads"] });
      queryClient.invalidateQueries({ queryKey: ["get-stages"] });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      notification.error(error?.data?.message || "Failed to add stage");
    },
  });

  const handleSubmit = (values: any) => {
    const stages: any[] | undefined = queryClient.getQueryData(["get-stages"]);

    console.log("stages", stages, values);
    if (
      stages &&
      stages.some(
        (stage) => stage?.name?.toLowerCase() === values?.name?.toLowerCase()
      )
    ) {
      notification.error("Stage with this name already exists.");
      return;
    }
    addStageMutation.mutate(values);
  };

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="ADD NEW STAGE"
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
            placeholder="Select color"
            data={STAGE_COLORS}
            {...form.getInputProps("color")}
            renderOption={({ option, checked }) => (
              <Group flex="1" gap="xs">
                <ColorSwatch color={option.value} size={16} />
                <span>{option.label}</span>
                {checked && (
                  <CheckIcon style={{ marginInlineStart: "auto" }} size={12} />
                )}
              </Group>
            )}
            leftSection={
              form.values.color ? (
                <ColorSwatch color={form.values.color} size={16} />
              ) : null
            }
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
            <Button variant="filled" color="gray" onClick={onClose} w={110}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={addStageMutation.isPending}
              disabled={!form.isValid()}
              w={110}
              color="blue"
            >
              Add Stage
            </Button>
          </Group>
        </Stack>
      </form>
    </CustomModal>
  );
};

export default AddStageModal;
