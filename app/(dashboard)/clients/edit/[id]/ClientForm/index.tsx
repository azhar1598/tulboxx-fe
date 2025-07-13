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
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/layout";
import { USStates } from "@/lib/constants";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.number().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.number().min(1, "Zip Code is required"),
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

const ClientForm = () => {
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
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  const { id } = useParams();

  const getClientQuery = useQuery({
    queryKey: ["get-client", id],
    queryFn: () => callApi.get(`/clients/${id}`),
  });

  console.log("getClientQuery.data", getClientQuery.data);

  useEffect(() => {
    if (getClientQuery.data) {
      const { name, email, phone, address, city, state, zip, notes } =
        getClientQuery.data?.data;
      form.setValues({
        name,
        email,
        phone: Number(phone),
        address,
        city,
        state,
        zip: Number(zip),
        notes: notes || "",
      });
      const selectedState = USStates.find((s) => s.value === state);
      if (selectedState) {
        setCities(selectedState.cities);
      }
      form.resetDirty();
    }
  }, [getClientQuery.data]);

  const updateClient = useMutation({
    mutationFn: () => callApi.put(`/clients/${id}`, form.values),
    onSuccess: async (res) => {
      const { data } = res;

      notification.success(`Client updated successfully`);
      router.push(`/clients`);
    },
    onError: (err: Error) => {
      notification.error(`${err}`);
      console.log(err.message);
    },
  });

  const isButtonEnabled =
    form.isValid() && !updateClient.isPending && id && form.isDirty();

  console.log("isButtonEnabled", isButtonEnabled);

  console.log(
    "form.values",
    form.isValid(),
    form.isDirty(),
    form.errors,
    formSchema.safeParse(form.values)
  );

  return (
    <form
      onSubmit={form.onSubmit(() => {
        const values = form.values;
        updateClient.mutate();
      })}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Name"
            placeholder="Type here..."
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Email"
            placeholder="client@email.com"
            disabled={true}
            {...form.getInputProps("email")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Phone"
            allowDecimal={false}
            hideControls
            allowNegative={false}
            placeholder="(555) 555-5555"
            {...form.getInputProps("phone")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="State"
            placeholder="Select State"
            data={USStates}
            {...form.getInputProps("state")}
            onChange={(value: any, option: any) => {
              form.getInputProps("state").onChange(value);
              form.setFieldValue("city", "");
              setCities(option?.cities || []);
            }}
            allowDeselect={false}
            withAsterisk
            searchable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="City"
            placeholder="Select City"
            data={cities}
            {...form.getInputProps("city")}
            disabled={!form.values.state}
            allowDeselect={false}
            withAsterisk
            searchable
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Address"
            placeholder="Start typing..."
            {...form.getInputProps("address")}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Zip Code"
            allowDecimal={false}
            hideControls
            allowNegative={false}
            placeholder="12345"
            {...form.getInputProps("zip")}
            withAsterisk
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
          loading={updateClient.isPending}
          leftSection={<IconUserPlus size="1rem" />}
          disabled={!isButtonEnabled}
        >
          Update Client
        </Button>
      </Group>
    </form>
  );
};

export default ClientForm;
