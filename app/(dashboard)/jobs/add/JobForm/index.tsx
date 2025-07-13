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
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconSend,
  IconUserPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useContext, useEffect } from "react";
import { UserContext } from "@/app/layout";
import { DateInput } from "@mantine/dates";

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
  date: Date;
  amount: number | "";
  hours: number | "";
  notes: string;
}

const JobForm = ({ md = 6 }: { md?: number }) => {
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
  const queryClient = useQueryClient();
  // const { data: clientOptions, isPending: isClientsLoading } =
  //   useDropdownOptions({
  //     queryKey: "get-clients-dropdown",
  //   });

  // useEffect(() => {
  //   if (!user) return;
  //   form.setFieldValue("user_id", user?.id);
  // }, [user]);

  const createJob = useMutation({
    mutationFn: () => callApi.post(`/jobs`, form.values),
    onSuccess: async (res) => {
      const { data } = res;

      notification.success(`Job created successfully`);
      router.push(`/jobs`);
    },
    onError: (err: any) => {
      notification.error(`${err?.data?.message}`);
      console.log("err", err);
    },
  });

  const isButtonEnabled = form.isValid() && !createJob.isPending;

  console.log("form.values", form.values);

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

  return (
    <form
      onSubmit={form.onSubmit(() => {
        createJob.mutate();
      })}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Job Name"
            placeholder="Type here..."
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <Select
            label="Job Type"
            placeholder="Select a job type"
            data={["Plumbing", "Electrical", "HVAC", "Other"]}
            {...form.getInputProps("type")}
            withAsterisk
            searchable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
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

        <Grid.Col span={{ base: 12, md: md }}>
          <Textarea
            label="Description"
            placeholder="Start typing..."
            {...form.getInputProps("description")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: md }}>
          {/* <TextInput
            label="Date"
            placeholder="YYYY-MM-DD"
           
            withAsterisk
          /> */}

          <DateInput
            {...form.getInputProps("date")}
            label="Scheduled Date"
            placeholder="Select a date"
            withAsterisk
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            {...form.getInputProps("amount")}
            withAsterisk
            hideControls
            leftSection={<IconCurrencyDollar size={16} />}
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <NumberInput
            label="Hours"
            placeholder="Enter estimated hours"
            {...form.getInputProps("hours")}
            withAsterisk
            hideControls
            allowDecimal={false}
            allowNegative={false}
            leftSection={<IconClock size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
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
          loading={createJob.isPending}
          leftSection={<IconUserPlus size="1rem" />}
          disabled={!isButtonEnabled}
        >
          Create Job
        </Button>
      </Group>
    </form>
  );
};

export default JobForm;
