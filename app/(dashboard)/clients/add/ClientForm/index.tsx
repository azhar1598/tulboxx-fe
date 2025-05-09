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
import { useContext, useEffect } from "react";
import { UserContext } from "@/app/layout";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.number().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

const ClientForm = ({
  md = 6,
  setClientModalOpened,
  getClients,
  estimateForm,
  invoiceForm,
}: {
  md?: number;
  setClientModalOpened?: (value: boolean) => void;
  getClients?: any;
  estimateForm?: any;
  invoiceForm?: any;
}) => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
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
    mutationFn: () => callApi.post(`/clients`, form.values),
    onSuccess: async (res) => {
      const { data } = res;

      notification.success(`Client created successfully`);
      if (md === 6) {
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

  return (
    <form
      onSubmit={form.onSubmit(() => {
        const values = form.values;
        createClient.mutate();
      })}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Name"
            placeholder="Type here..."
            {...form.getInputProps("name")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <TextInput
            label="Email"
            placeholder="client@email.com"
            {...form.getInputProps("email")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
          <NumberInput
            label="Phone"
            allowDecimal={false}
            hideControls
            allowNegative={false}
            placeholder="(555) 555-5555"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: md }}>
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
