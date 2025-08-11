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
import { useRouter } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/layout";
import { USStates } from "@/lib/constants";
import { formatPhoneNumber } from "@/lib/utils";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  phone: z.union([z.string(), z.number()]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.union([z.string(), z.number()]).optional(),
  notes: z.string().optional(),
});

interface ClientFormValues {
  name: string;
  email: string;
  phone: string | number;
  address: string;
  state: string | null;
  city: string | null;
  zip: string | number;
  notes: string;
}

const ClientForm = ({
  md = 6,
  setClientModalOpened,
  getClients,
  estimateForm,
  invoiceForm,
  clientPage = false,
}: {
  md?: number;
  setClientModalOpened?: (value: boolean) => void;
  getClients?: any;
  estimateForm?: any;
  invoiceForm?: any;
  clientPage?: boolean;
}) => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm<ClientFormValues>({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      notes: "",
    },
    validateInputOnChange: true,
  });

  const user = useContext(UserContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  const createClient = useMutation({
    mutationFn: (clientData: ClientFormValues) =>
      callApi.post(`/clients`, clientData),
    onSuccess: async (res) => {
      const { data } = res;

      notification.success(`Client created successfully`);
      if (md === 6) {
        if (!clientPage) return;
        router.push(`/clients`);
      } else {
        setClientModalOpened(false);
        getClients?.refetch();
        queryClient.invalidateQueries({
          queryKey: ["get-clients-dropdown"],
        });
        estimateForm?.setFieldValue("clientId", data.client.id);
        invoiceForm?.setFieldValue("clientId", data.client.id);
      }
    },
    onError: (err: any) => {
      notification.error(`${err?.data?.message}`);
      console.log("err", err);
    },
  });

  const isButtonEnabled = form.isValid() && !createClient.isPending;

  console.log(form.values, form.errors, formSchema.safeParse(form.values));

  const [cities, setCities] = useState<any[]>([]);

  console.log("cities", cities);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const submissionValues = {
          ...values,
          phone: values.phone.toString().replace(/-/g, ""),
        };
        createClient.mutate(submissionValues);
      })}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Name"
            placeholder="Enter client's full name"
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Email"
            placeholder="Enter email address"
            {...form.getInputProps("email")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            {...form.getInputProps("phone")}
            onChange={(event) => {
              const formatted = formatPhoneNumber(event.currentTarget.value);
              form.setFieldValue("phone", formatted);
            }}
            maxLength={12}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Street Address"
            placeholder="Enter street address"
            {...form.getInputProps("address")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: md }}>
          {/* <Select
            label="City"
            placeholder="Select City"
            data={cities}
            {...form.getInputProps("city")}
            disabled={!form.values.state}
            allowDeselect={false}
            searchable
          /> */}

          <TextInput
            label="City"
            placeholder="Enter city"
            {...form.getInputProps("city")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <Select
            label="State"
            placeholder="Select State"
            data={USStates}
            {...form.getInputProps("state")}
            onChange={(value: any, option: any) => {
              form.getInputProps("state").onChange(value);

              setCities(option?.cities || []);
            }}
            allowDeselect={false}
            searchable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <NumberInput
            label="Zip Code"
            allowDecimal={false}
            hideControls
            allowNegative={false}
            placeholder="Enter ZIP code"
            {...form.getInputProps("zip")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <Textarea
            label="Additional Notes"
            placeholder="Add any relevant notes here"
            {...form.getInputProps("notes")}
          />
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        <Button
          type="submit"
          w={200}
          loading={createClient.isPending}
          leftSection={<IconUserPlus size="1rem" />}
          disabled={!isButtonEnabled}
        >
          Create Client
        </Button>
      </Group>
    </form>
  );
};

export default ClientForm;
