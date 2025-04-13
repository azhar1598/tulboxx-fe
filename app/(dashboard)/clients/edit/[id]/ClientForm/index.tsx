"use client";
import { useForm, zodResolver } from "@mantine/form";
import { Schema, z } from "zod";
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

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.number().min(10, "Phone number is required"),
  type: z.string().min(1, "Please select a type"),
  address: z.string().min(1, "Address is required"),
});

const ClientForm = () => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phone: "",
      type: "residential",
      address: "",
    },
    validateInputOnChange: true,
  });

  const user = useContext(UserContext);

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
      const { name, email, phone, type, address } = getClientQuery.data?.data;
      form.setValues({
        name,
        email,
        phone: Number(phone),
        type,
        address,
      });
      form.resetDirty();
    }
  }, [getClientQuery.data]);

  const updateClient = useMutation({
    mutationFn: () => callApi.put(`/clients/${id}`, form.values),
    onSuccess: async (res) => {
      const { data } = res;

      notification.success(`Client created successfully`);
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
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Email"
            placeholder="client@email.com"
            disabled={true}
            {...form.getInputProps("email")}
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
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }} mt={8}>
          <Text size="14px" fw={500} mb={5}>
            Type
          </Text>
          <Radio.Group
            {...form.getInputProps("type")}
            defaultValue="residential"
            mt={12}
          >
            <Group>
              <Radio value="residential" label="Residential" />
              <Radio value="commercial" label="Commercial" />
            </Group>
          </Radio.Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Address"
            placeholder="Start typing..."
            {...form.getInputProps("address")}
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
