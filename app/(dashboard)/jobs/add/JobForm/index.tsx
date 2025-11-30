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
import { useRouter, useSearchParams } from "next/navigation";
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
  customer: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  amount: z.union([z.number().min(0), z.literal(""), z.null()]).optional(),
  notes: z.string().optional(),
});

interface JobFormValues {
  name: string;
  customer: string;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  amount: number | "";
  notes: string;
}

import { extractEstimateJson1 } from "@/lib/constants";

const JobForm = ({ md = 6 }: { md?: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estimateId = searchParams.get("estimateId");
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
  const queryClient = useQueryClient();

  const { data: estimateData } = useQuery({
    queryKey: ["get-estimate", estimateId],
    queryFn: () => callApi.get(`/estimates/${estimateId}`),
    enabled: !!estimateId,
  });

  useEffect(() => {
    if (estimateData?.data) {
      const {
        projectName,
        client_id,
        total_amount,
        ai_generated_estimate,
        projectStartDate,
        projectEndDate,
        projectEstimate,
      } = estimateData.data;

      const parsedAiContent: any = extractEstimateJson1(ai_generated_estimate);

      form.setValues({
        name: "", // User will enter job name
        customer: client_id || "",
        amount: total_amount || projectEstimate || "",
        description: parsedAiContent?.projectOverview || "",
        start_date: projectStartDate ? new Date(projectStartDate) : null,
        end_date: projectEndDate ? new Date(projectEndDate) : null,
        notes: parsedAiContent?.scopeOfWork
          ? Array.isArray(parsedAiContent.scopeOfWork)
            ? parsedAiContent.scopeOfWork.join("\n")
            : parsedAiContent.scopeOfWork
          : "",
      });
    }
  }, [estimateData]);

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
          <TextInput
            label="Job Name"
            placeholder="Johnson - Grading"
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <DateInput
            {...form.getInputProps("start_date")}
            label="Start Date"
            placeholder="Select a start date"
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <DateInput
            {...form.getInputProps("end_date")}
            label="End Date"
            placeholder="Select an end date"
            valueFormat="DD-MM-YYYY"
            leftSection={<IconCalendar size={16} />}
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
