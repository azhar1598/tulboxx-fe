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
  type: z.string().optional(),
  customer: z.string().optional(),
  description: z.string().optional(),
  date: z.date().nullable().optional(),
  amount: z.union([z.number().min(0), z.literal(""), z.null()]).optional(),
  hours: z.union([z.number().min(0), z.literal(""), z.null()]).optional(),
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
          <TextInput
            label="Job Type"
            placeholder="Plumbing, Electrical, HVAC, Other"
            {...form.getInputProps("type")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
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

        <Grid.Col span={{ base: 12, md: md }}>
          <Textarea
            label="Description"
            placeholder="Start typing..."
            {...form.getInputProps("description")}
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
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            {...form.getInputProps("amount")}
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
