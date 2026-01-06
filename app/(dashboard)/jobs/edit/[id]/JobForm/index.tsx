"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  TextInput,
  Group,
  Button,
  Stack,
  Title,
  Text,
  Paper,
  Radio,
  Textarea,
  Select,
  Switch,
  Grid,
  NumberInput,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconSend,
  IconUserPlus,
  IconCurrencyDollar,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useContext, useEffect } from "react";
import { UserContext } from "@/app/layout";
import { DateInput } from "@mantine/dates";
import { DollarSignIcon } from "lucide-react";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Job title is required"),
  customer: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  amount: z.union([z.number().min(0), z.literal(""), z.null()]).optional(),
  notes: z.string().optional(),
});

interface JobFormValues {
  name: string;
  customer: string | null;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  amount: number | "";
  notes: string;
  user_id?: string;
}

const JobForm = () => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm<JobFormValues>({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      customer: "",
      description: "",
      start_date: null,
      end_date: null,
      amount: "",
      notes: "",
    },
    validateInputOnChange: true,
  });

  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  const { id } = useParams();

  const queryFilters: any = {
    url: "/clients",
    key: "get-clients",
    page: 1,
    pageSize: 10,
    label: "name",
    value: "id",
  };

  const getClientsQuery = useDropdownOptions(queryFilters);

  console.log(
    "getClientsQuery",
    getClientsQuery,
    formSchema.safeParse(form.values)
  );

  // const { data: clientOptions, isPending: isClientsLoading } =
  //   useDropdownOptions(queryFilters);

  const getJobQuery = useQuery({
    queryKey: ["get-job", id],
    queryFn: () => callApi.get(`/jobs/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (getJobQuery.data) {
      const { name, client_id, description, start_date, end_date, amount, notes } =
        getJobQuery.data?.data;
      form.setValues({
        name,
        customer: client_id || "",
        description,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        amount: Number(amount) || "",
        notes: notes || "",
      });
      form.resetDirty();
    }
  }, [getJobQuery.data]);

  const updateJob = useMutation({
    mutationFn: () => callApi.put(`/jobs/${id}`, form.values),
    onSuccess: async () => {
      notification.success(`Job updated successfully`);
      router.push(`/jobs`);
    },
    onError: (err: any) => {
      notification.error(`${err?.data?.message || "Error updating job"}`);
    },
  });

  const isButtonEnabled =
    form.isValid() && !updateJob.isPending && id && form.isDirty();

  console.log("form.values", form.values);

  return (
    <form
      onSubmit={form.onSubmit(() => {
        updateJob.mutate();
      })}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Client"
            placeholder="Select a client"
            data={getClientsQuery ?? []}
            {...form.getInputProps("customer")}
            // disabled={isClientsLoading}
            searchable
            clearable
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Job Name"
            placeholder="Johnson - Grading"
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            {...form.getInputProps("start_date")}
            label="Start Date"
            placeholder="Select a start date"
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            {...form.getInputProps("end_date")}
            label="End Date"
            placeholder="Select an end date"
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Description"
            placeholder="Start typing..."
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            {...form.getInputProps("amount")}
            leftSection={<IconCurrencyDollar size={16} />}
            hideControls
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Additional Notes"
            placeholder="Start typing..."
            {...form.getInputProps("notes")}
          />
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        <Button
          type="submit"
          w={200}
          loading={updateJob.isPending}
          leftSection={<IconUserPlus size="1rem" />}
          disabled={!isButtonEnabled}
        >
          Update Job
        </Button>
      </Group>
    </form>
  );
};

export default JobForm;
