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
  type: z.string().min(1, "Job type is required"),
  customer: z.string().min(1, "Customer is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
  amount: z.number().min(0, "Amount must be a positive number"),
  hours: z.number().min(0, "Hours must be a positive number"),
  notes: z.string().optional(),
});

interface JobFormValues {
  name: string;
  type: string;
  customer: string;
  description: string;
  date: Date | null;
  amount: number | "";
  hours: number | "";
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
      type: "",
      customer: "",
      description: "",
      date: null,
      amount: "",
      hours: "",
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

  console.log("getClientsQuery", getClientsQuery);

  // const { data: clientOptions, isPending: isClientsLoading } =
  //   useDropdownOptions(queryFilters);

  const getJobQuery = useQuery({
    queryKey: ["get-job", id],
    queryFn: () => callApi.get(`/jobs/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (getJobQuery.data) {
      const { name, type, client_id, description, date, amount, hours, notes } =
        getJobQuery.data?.data;
      form.setValues({
        name,
        type,
        customer: client_id,
        description,
        date: date ? new Date(date) : null,
        amount: Number(amount),
        hours: Number(hours),
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
          <TextInput
            label="Job Name"
            placeholder="Type here..."
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Job Type"
            placeholder="Select a job type"
            data={["Plumbing", "Electrical", "HVAC", "Other"]}
            {...form.getInputProps("type")}
            withAsterisk
            searchable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Client"
            placeholder="Select a client"
            data={getClientsQuery ?? []}
            {...form.getInputProps("customer")}
            // disabled={isClientsLoading}
            withAsterisk
            searchable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            {...form.getInputProps("date")}
            label="Scheduled Date"
            placeholder="Select a date"
            withAsterisk
            valueFormat="DD-MM-YYYY"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Description"
            placeholder="Start typing..."
            {...form.getInputProps("description")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            {...form.getInputProps("amount")}
            withAsterisk
            leftSection={<DollarSignIcon size={16} />}
            hideControls
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Hours"
            placeholder="Enter estimated hours"
            {...form.getInputProps("hours")}
            withAsterisk
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
